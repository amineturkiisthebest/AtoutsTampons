import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

import modelUrl from '../assets/printer30/printer30.glb?url'
// Where the blue insert is printed in the model's own colour texture (UV space, white + alpha)
import insertUvMaskUrl from '../assets/printer30/printer30-insert-uv.png'
// Clean black COLOP band (straightened from the product photo), laid over the model's band
import bandUrl from '../assets/printer30/printer30-band.jpg'

const HOVER_PERIOD = 5
// Rendering budget: frames per second and maximum pixel density of the canvas
const FPS = 30
const MAX_PIXEL_RATIO = 1.5
const SWAY_PERIOD = 9
const SWAY = THREE.MathUtils.degToRad(9)
const TILT_Y = THREE.MathUtils.degToRad(16)
const TILT_X = THREE.MathUtils.degToRad(9)
// The model's front (design side) faces +x; 305° shows it in a 3/4 view with a side cap on the left, like the product photo
const BASE_YAW = THREE.MathUtils.degToRad(305)

// Printed insert area, as fractions of the model's bounding box (measured by raycasting the model and
// reading its colour texture): the whole front above the black band, and the whole top surface
const INSERT_Z = [0.008, 0.997]
// Starts just inside the black band so the image meets it with a straight edge (no gap showing underneath)
const FRONT_Y = [0.398, 1]
const TOP_X = [0.006, 0.955]
// Black COLOP band on the front, as fractions of the model's height (measured on the model's texture)
const BAND_Y = [0.304, 0.404]

// Image -> canvas texture with "cover" cropping to the target aspect ratio
const loadDesign = (src, aspect) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const width = 1024
      const height = Math.round(width / aspect)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const sourceWidth = image.naturalWidth || 1024
      const sourceHeight = image.naturalHeight || 1024
      const scale = Math.max(width / sourceWidth, height / sourceHeight)
      const drawWidth = sourceWidth * scale
      const drawHeight = sourceHeight * scale
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      resolve(texture)
    }
    image.onerror = reject
    image.src = src
  })

let insertUvMask = null
const loadInsertUvMask = () => {
  insertUvMask ??= new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = insertUvMaskUrl
  })
  return insertUvMask
}

// Average colour of the outer border of the design (what the edges of the insert should look like)
const borderColor = (canvas) => {
  const size = 32
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  ctx.canvas.width = size
  ctx.canvas.height = size
  ctx.drawImage(canvas, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)
  const sum = [0, 0, 0]
  let count = 0
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x > 2 && x < size - 3 && y > 2 && y < size - 3) continue
      const i = (y * size + x) * 4
      sum[0] += data[i]
      sum[1] += data[i + 1]
      sum[2] += data[i + 2]
      count++
    }
  }
  return `rgb(${sum.map((value) => Math.round(value / count)).join(', ')})`
}

// The model's own texture with every blue insert texel painted `color`, so no original blue can show
// at edges the decals can't reach (sharp rounded corners)
const recolorInsert = (baseMap, mask, color) => {
  const { width, height } = baseMap.image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(baseMap.image, 0, 0, width, height)
  const layer = document.createElement('canvas')
  layer.width = width
  layer.height = height
  const layerCtx = layer.getContext('2d')
  layerCtx.fillStyle = color
  layerCtx.fillRect(0, 0, width, height)
  layerCtx.globalCompositeOperation = 'destination-in'
  layerCtx.drawImage(mask, 0, 0, width, height)
  ctx.drawImage(layer, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.flipY = baseMap.flipY
  texture.colorSpace = baseMap.colorSpace
  texture.wrapS = baseMap.wrapS
  texture.wrapT = baseMap.wrapT
  texture.channel = baseMap.channel
  texture.anisotropy = 4
  return texture
}

// Glossy printed plastic: the clear coat catches the moving key light
// Keep only the decal triangles that face the projection direction (dot > `min`): drops the back-facing ones;
// the smooth fade at the edges is done per pixel in decalMaterial
const keepFacing = (geometry, direction, min) => {
  const position = geometry.getAttribute('position')
  const normal = geometry.getAttribute('normal')
  const uv = geometry.getAttribute('uv')
  const keep = { position: [], normal: [], uv: [] }
  const n = new THREE.Vector3()
  for (let i = 0; i < position.count; i += 3) {
    n.set(0, 0, 0)
    for (let k = 0; k < 3; k++) n.add(new THREE.Vector3().fromBufferAttribute(normal, i + k))
    if (n.normalize().dot(direction) < min) continue
    for (let k = 0; k < 3; k++) {
      keep.position.push(position.getX(i + k), position.getY(i + k), position.getZ(i + k))
      keep.normal.push(normal.getX(i + k), normal.getY(i + k), normal.getZ(i + k))
      keep.uv.push(uv.getX(i + k), uv.getY(i + k))
    }
  }
  const filtered = new THREE.BufferGeometry()
  filtered.setAttribute('position', new THREE.Float32BufferAttribute(keep.position, 3))
  filtered.setAttribute('normal', new THREE.Float32BufferAttribute(keep.normal, 3))
  filtered.setAttribute('uv', new THREE.Float32BufferAttribute(keep.uv, 2))
  geometry.dispose()
  return filtered
}

// `priority`: where the front and top decals overlap on the rounded edge, the higher one is drawn.
// Standard (not physical/clear-coat) material: still glossy under the moving key light, much cheaper per pixel
// `direction`: the side the decal faces; the image fades out smoothly, per pixel, where the surface turns away from it
// (rounded corners), which gives clean curved edges instead of the model's triangle outline
const decalMaterial = (map, priority, direction) => {
  const material = new THREE.MeshStandardMaterial({
    map,
    roughness: 0.28,
    metalness: 0,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4 - priority * 2,
    polygonOffsetUnits: -4 - priority * 2,
  })
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFacingDir = { value: direction }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vFacingNormal;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvFacingNormal = normal;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uFacingDir;\nvarying vec3 vFacingNormal;')
      .replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\ngl_FragColor.a *= smoothstep(0.2, 0.45, dot(normalize(vFacingNormal), uFacingDir));',
      )
  }
  return material
}

// The model's own band texture has a slightly malformed logo (its "C" is split across texture pieces), so a clean
// band image is projected over it. Drawn above the insert decals (priority 2); always present, whatever the design.
const addBandDecal = (state) => {
  const { pivot, mesh, box } = state
  const size = box.getSize(new THREE.Vector3())
  const at = (axis, fraction) => box.min[axis] + size[axis] * fraction
  const width = size.z * (INSERT_Z[1] - INSERT_Z[0])
  const height = size.y * (BAND_Y[1] - BAND_Y[0])
  const y = at('y', (BAND_Y[0] + BAND_Y[1]) / 2)
  const z = at('z', (INSERT_Z[0] + INSERT_Z[1]) / 2)

  const saved = { position: pivot.position.clone(), rotation: pivot.rotation.clone() }
  pivot.position.set(0, 0, 0)
  pivot.rotation.set(0, 0, 0)
  pivot.updateMatrixWorld(true)
  const hit = new THREE.Raycaster(new THREE.Vector3(box.max.x + 1, y, z), new THREE.Vector3(-1, 0, 0)).intersectObject(mesh, false)[0]
  if (hit) {
    const texture = new THREE.TextureLoader().load(bandUrl)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    const geometry = keepFacing(
      new DecalGeometry(mesh, new THREE.Vector3(hit.point.x, y, z), new THREE.Euler(0, Math.PI / 2, 0), new THREE.Vector3(width, height, size.x * 0.5)),
      new THREE.Vector3(1, 0, 0),
      0.05,
    )
    pivot.add(new THREE.Mesh(geometry, decalMaterial(texture, 2, new THREE.Vector3(1, 0, 0))))
  }
  pivot.position.copy(saved.position)
  pivot.rotation.copy(saved.rotation)
}

// COLOP Printer 30 rendered in WebGL.
// `design`: image URL for the insert, or null to keep the model's own (blue wave) design.
// `pointer`: ref holding the cursor position (-1…1) over the section.
// `onFrame(t, hover)`: called on every rendered frame, so other moving elements can follow the same 30 fps clock
function Printer3D({ design, pointer, onLoad, onError, onFrame }) {
  const mountRef = useRef(null)
  const onFrameRef = useRef(onFrame)
  const sceneRef = useRef(null)

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    const mount = mountRef.current
    let renderer
    try {
      // Multisampling only on standard-density screens; on high-density ones the extra pixels already smooth edges
      renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 1.5, alpha: true, powerPreference: 'low-power' })
    } catch {
      onError?.()
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100)
    // Framed for the enlarged canvas (see .ps-3d): the printer is shown ~12% larger than before, with room around it
    // Aimed slightly below the printer so it sits higher in the frame, clear of the price bar underneath
    camera.position.set(0, 0.46, 5.9)
    camera.lookAt(0, -0.25, 0)

    // Lighting: soft sky/ground fill, a warm key light that follows the cursor (moving highlights), a cool rim light
    scene.add(new THREE.HemisphereLight(0xffffff, 0xf3d9c8, 0.7))
    const key = new THREE.DirectionalLight(0xfff1e0, 2.4)
    key.position.set(-2.5, 3, 3)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xcfe0ff, 1.4)
    rim.position.set(3, 1.5, -2.5)
    scene.add(rim)

    // pivot: floats and turns; holder: centres and scales the model inside it
    const pivot = new THREE.Group()
    scene.add(pivot)
    const holder = new THREE.Group()
    pivot.add(holder)
    sceneRef.current = { pivot, holder, mesh: null, box: null, decals: [] }

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = mount
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let disposed = false
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return
        const model = gltf.scene
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(box.getCenter(new THREE.Vector3()))
        holder.scale.setScalar(1.75 / size.y)
        holder.add(model)
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.envMapIntensity = 0.75
            sceneRef.current.mesh = child
            sceneRef.current.baseMap = child.material.map
          }
        })
        sceneRef.current.box = new THREE.Box3().setFromObject(holder)
        addBandDecal(sceneRef.current)
        sceneRef.current.ready = true
        sceneRef.current.onReady?.()
        onLoad?.()
      },
      undefined,
      () => onError?.(),
    )

    // Animation: hover, idle sway and cursor tilt, eased; paused when the section is off screen.
    // Drawn at most FPS times a second (the slow motion doesn't need the screen's full refresh rate)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smooth = { x: 0, y: 0 }
    const start = performance.now()
    let frame = 0
    let visible = true
    let last = 0

    const render = (now = performance.now()) => {
      frame = visible ? requestAnimationFrame(render) : 0
      if (last && now - last < 1000 / FPS - 2) return
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      const t = (now - start) / 1000
      const target = pointer?.current ?? { x: 0, y: 0 }
      // Same easing speed whatever the frame rate (equivalent to 6% per frame at 60 fps)
      const ease = 1 - Math.pow(0.94, dt * 60)
      smooth.x += (target.x - smooth.x) * ease
      smooth.y += (target.y - smooth.y) * ease
      const hover = reduceMotion ? 0 : Math.sin((t / HOVER_PERIOD) * Math.PI * 2)
      const sway = reduceMotion ? 0 : Math.sin((t / SWAY_PERIOD) * Math.PI * 2)
      pivot.position.y = hover * 0.06
      pivot.rotation.y = BASE_YAW + sway * SWAY + smooth.x * TILT_Y
      pivot.rotation.x = smooth.y * TILT_X
      key.position.x = -2.5 - smooth.x * 3
      key.position.y = 3 - smooth.y * 1.5
      renderer.render(scene, camera)
      onFrameRef.current?.(t, hover)
    }
    render()

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) render()
    })
    visibility.observe(mount)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      visibility.disconnect()
      resizeObserver.disconnect()
      pmrem.dispose()
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose()
          Object.values(child.material).forEach((value) => value?.isTexture && value.dispose())
          child.material.dispose()
        }
      })
      sceneRef.current?.baseMap?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      sceneRef.current = null
    }
  }, [pointer, onLoad, onError])

  // Apply the chosen design as decals projected onto the front face and the top of the printer
  useEffect(() => {
    const state = sceneRef.current
    if (!state) return undefined
    let cancelled = false

    const clearDecals = () => {
      state.decals.forEach((decal) => {
        decal.geometry.dispose()
        decal.material.map?.dispose()
        decal.material.dispose()
        state.pivot.remove(decal)
      })
      state.decals = []
    }

    const setBaseMap = (map) => {
      const { mesh, baseMap } = state
      if (mesh.material.map !== baseMap) mesh.material.map.dispose()
      mesh.material.map = map
      mesh.material.needsUpdate = true
    }

    const apply = async () => {
      if (!design) {
        clearDecals()
        setBaseMap(state.baseMap)
        return
      }
      const { pivot, mesh, box } = state
      const size = box.getSize(new THREE.Vector3())
      const at = (axis, fraction) => box.min[axis] + size[axis] * fraction
      const width = size.z * (INSERT_Z[1] - INSERT_Z[0])
      const frontHeight = size.y * (FRONT_Y[1] - FRONT_Y[0])
      const topDepth = size.x * (TOP_X[1] - TOP_X[0])
      const z = at('z', (INSERT_Z[0] + INSERT_Z[1]) / 2)
      const frontY = at('y', (FRONT_Y[0] + FRONT_Y[1]) / 2)
      const topX = at('x', (TOP_X[0] + TOP_X[1]) / 2)

      // The whole image goes on the front (the side people look at); the top gets a mirrored continuation of the
      // image's top edge, so the design flows over the rounded edge without hiding part of the image up there
      const [frontMap, mask] = await Promise.all([loadDesign(design, width / frontHeight), loadInsertUvMask()])
      if (cancelled || sceneRef.current !== state) {
        frontMap.dispose()
        return
      }
      const recolored = recolorInsert(state.baseMap, mask, borderColor(frontMap.image))
      const front = frontMap.image
      const topCanvas = document.createElement('canvas')
      topCanvas.width = front.width
      topCanvas.height = Math.max(1, Math.round(front.width * (topDepth / width)))
      const topCtx = topCanvas.getContext('2d')
      const strip = Math.min(front.height, topCanvas.height)
      topCtx.translate(0, topCanvas.height)
      topCtx.scale(1, -1)
      topCtx.drawImage(front, 0, 0, front.width, strip, 0, 0, topCanvas.width, topCanvas.height)
      const topMap = new THREE.CanvasTexture(topCanvas)
      topMap.colorSpace = THREE.SRGBColorSpace
      topMap.anisotropy = 4

      // Decals are computed with the pivot at rest, so they end up in the pivot's own space and follow its motion
      const saved = { position: pivot.position.clone(), rotation: pivot.rotation.clone() }
      pivot.position.set(0, 0, 0)
      pivot.rotation.set(0, 0, 0)
      pivot.updateMatrixWorld(true)

      const raycaster = new THREE.Raycaster()
      raycaster.set(new THREE.Vector3(box.max.x + 1, frontY, z), new THREE.Vector3(-1, 0, 0))
      const frontHit = raycaster.intersectObject(mesh, false)[0]
      raycaster.set(new THREE.Vector3(topX, box.max.y + 1, z), new THREE.Vector3(0, -1, 0))
      const topHit = raycaster.intersectObject(mesh, false)[0]

      const decals = []
      if (frontHit) {
        // Projected along -x; image right -> -z, image up -> +y
        const geometry = keepFacing(
          new DecalGeometry(
            mesh,
            new THREE.Vector3(frontHit.point.x, frontY, z),
            new THREE.Euler(0, Math.PI / 2, 0),
            new THREE.Vector3(width, frontHeight, size.x * 0.5),
          ),
          new THREE.Vector3(1, 0, 0),
          0.05,
        )
        decals.push(new THREE.Mesh(geometry, decalMaterial(frontMap, 0, new THREE.Vector3(1, 0, 0))))
      }
      if (topHit) {
        // Projected along -y; image right -> -z (as on the front), image up -> -x (continuing over the edge)
        const orientation = new THREE.Euler().setFromRotationMatrix(
          new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0)),
        )
        const geometry = keepFacing(
          new DecalGeometry(mesh, new THREE.Vector3(topX, topHit.point.y, z), orientation, new THREE.Vector3(width, topDepth, size.y * 0.1)),
          new THREE.Vector3(0, 1, 0),
          0.05,
        )
        decals.push(new THREE.Mesh(geometry, decalMaterial(topMap, 1, new THREE.Vector3(0, 1, 0))))
      }

      pivot.position.copy(saved.position)
      pivot.rotation.copy(saved.rotation)
      clearDecals()
      setBaseMap(recolored)
      decals.forEach((decal) => pivot.add(decal))
      state.decals = decals
    }

    if (state.ready) apply()
    else state.onReady = apply

    return () => {
      cancelled = true
      if (state.onReady === apply) state.onReady = null
    }
  }, [design])

  return <div ref={mountRef} className="ps-3d" role="img" aria-label="COLOP Printer 30 en 3D"></div>
}

export default Printer3D
