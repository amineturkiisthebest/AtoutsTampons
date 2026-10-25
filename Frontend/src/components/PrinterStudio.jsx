import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import stampsPhoto from '../assets/sections/company.jpg'
import botanicalArt from '../assets/sections/sidebar-bottom.png'
import shellImg from '../assets/printer30/printer30-shell.webp'
import insertMask from '../assets/printer30/printer30-insert.png'

// Three.js is only downloaded when this section renders
const Printer3D = lazy(() => import('./Printer3D.jsx'))

// COLOP Printer 30 (atoutstampons.fr)
const PRICE = 38.4
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const svgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

// COLOP's wave pattern, drawn as SVG so it stays sharp at any size
const wavesDesign = (light, dark) => {
  let paths = ''
  for (let i = 0; i < 28; i++) {
    const o = i * 11
    paths += `<path d='M ${-60 + o} 330 C ${60 + o} ${210 - o * 0.35}, ${150 + o * 0.5} 140, 330 ${-30 + o * 0.35}'/>`
  }
  return svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${light}'/><stop offset='1' stop-color='${dark}'/></linearGradient></defs><rect width='300' height='300' fill='url(#g)'/><g fill='none' stroke='#fff' stroke-opacity='.85' stroke-width='1.6'>${paths}</g></svg>`,
  )
}

// Sunset landscape (no text)
const sunsetDesign = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'>
    <defs>
      <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#4b5fa8'/><stop offset='0.45' stop-color='#e98a8c'/><stop offset='0.75' stop-color='#ffc27a'/><stop offset='1' stop-color='#ffe2a8'/>
      </linearGradient>
      <radialGradient id='sun' cx='0.5' cy='0.5' r='0.5'>
        <stop offset='0' stop-color='#fff6d5'/><stop offset='0.6' stop-color='#ffd27a'/><stop offset='1' stop-color='#ffd27a' stop-opacity='0'/>
      </radialGradient>
    </defs>
    <rect width='300' height='300' fill='url(#sky)'/>
    <circle cx='190' cy='175' r='70' fill='url(#sun)'/>
    <circle cx='190' cy='175' r='30' fill='#fff1c4'/>
    <path d='M0 200 C60 160 110 180 160 200 S250 170 300 190 V300 H0 Z' fill='#c56a7a' opacity='0.85'/>
    <path d='M0 230 C70 200 130 215 190 235 S270 215 300 225 V300 H0 Z' fill='#8d4a6b'/>
    <path d='M0 260 C80 240 150 252 220 268 S280 255 300 260 V300 H0 Z' fill='#4e2f57'/>
    <g fill='none' stroke='#3a2b4a' stroke-width='2.5' stroke-linecap='round'>
      <path d='M70 90 q7 -7 14 0 q7 -7 14 0'/><path d='M106 72 q5 -5 10 0 q5 -5 10 0'/>
    </g>
  </svg>`,
)

// Insert designs floating around the printer; `pos` places each card in the scene, `depth` sets its parallax
const designs = [
  { id: 'blue', label: 'Vague bleue', src: wavesDesign('#5bb4ff', '#0b4fb3'), pos: { left: '33%', top: '17%' }, tilt: -8, depth: 26 },
  { id: 'sunset', label: 'Coucher de soleil', src: sunsetDesign, pos: { left: '57%', top: '13%' }, tilt: 9, depth: -20 },
  { id: 'stamps', label: 'Vos créations', src: stampsPhoto, pos: { left: '25%', top: '52%' }, tilt: -10, depth: 34 },
  { id: 'botanical', label: 'Botanique', src: botanicalArt, pos: { left: '71%', top: '40%' }, tilt: 11, depth: -30 },
  { id: 'red', label: 'Vague COLOP', src: wavesDesign('#ff4040', '#b3000c'), pos: { left: '80%', top: '72%' }, tilt: -6, depth: 18 },
]
const uploadPos = { left: '5%', top: '72%' }

const formatPrice = (price) => `${price.toFixed(2).replace('.', ',')} €`

// Printer 30 photo split into layers (see assets/printer30): the shell has a transparent window where the
// printed insert sits, so the chosen design shows through it, under the real plastic, band and base.
// Positions are in % of the photo (902 x 767).
const INSERT_BOX = { left: '22.506%', top: '4.954%', width: '59.091%', height: '62.712%' }

// Mask for the highlight: the shell's own alpha plus the insert shape placed on its box.
// (A percentage mask-position p places the image at (box - image) * p, hence left / (100 - width).)
const shineMask = `url("${shellImg}"), url("${insertMask}")`
const SHINE_MASK = {
  WebkitMaskImage: shineMask,
  maskImage: shineMask,
  WebkitMaskSize: '100% 100%, 59.091% 62.712%',
  maskSize: '100% 100%, 59.091% 62.712%',
  WebkitMaskPosition: '0 0, 55.016% 13.286%',
  maskPosition: '0 0, 55.016% 13.286%',
}

function Printer30({ design }) {
  return (
    <div className="ps-p30" role="img" aria-label="COLOP Printer 30 personnalisé">
      <div className="ps-p30__insert" style={{ ...INSERT_BOX, WebkitMaskImage: `url("${insertMask}")`, maskImage: `url("${insertMask}")` }}>
        <span key={design} className="ps-p30__design" style={{ backgroundImage: `url("${design}")` }}></span>
        <span className="ps-p30__gloss"></span>
      </div>
      <img className="ps-p30__shell" src={shellImg} alt="" draggable="false" />
      {/* Moving highlight, clipped to the printer (shell + insert) so it only lights the object */}
      <span className="ps-p30__shine" style={SHINE_MASK} aria-hidden="true">
        <span></span>
      </span>
    </div>
  )
}

// Card floating: same rhythm as the former CSS animation (5 s, 12 px), each card offset in time
const CARD_PERIOD = 5
const CARD_PHASES = [0, 1, 2, 3, 1.5, 2.5]
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Home page section: a Printer 30 surrounded by floating insert designs; pick one (or your own image) to dress the printer
function PrinterStudio() {
  const { addToCart } = useOutletContext()
  const [designId, setDesignId] = useState('blue')
  const [upload, setUpload] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const sectionRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [model3d, setModel3d] = useState('loading')
  const handle3dLoad = useCallback(() => setModel3d('ready'), [])
  const handle3dError = useCallback(() => setModel3d('failed'), [])
  const cardsRef = useRef(null)
  const shadowRef = useRef(null)

  // While the 3D printer runs, the cards' floating and the ground shadow are driven from its 30 fps loop instead of
  // CSS animations, which would make the browser redraw the whole screen at the monitor's full refresh rate
  const handle3dFrame = useCallback((t, hover) => {
    if (reduceMotion) return
    Array.from(cardsRef.current?.children ?? []).forEach((card, index) => {
      const phase = (t + CARD_PHASES[index % CARD_PHASES.length]) / CARD_PERIOD
      card.style.translate = `0 ${(-6 * (1 - Math.cos(phase * Math.PI * 2))).toFixed(1)}px`
    })
    if (shadowRef.current) {
      const lift = (hover + 1) / 2
      shadowRef.current.style.scale = (1 - lift * 0.2).toFixed(3)
      shadowRef.current.style.opacity = (1 - lift * 0.4).toFixed(3)
    }
  }, [])

  const design = designId === 'upload' && upload ? upload.url : designs.find((d) => d.id === designId).src

  // Demonstration only: the image stays in the browser (local object URL) and is never sent or exported
  useEffect(() => () => upload && URL.revokeObjectURL(upload.url), [upload])

  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Choisissez un fichier image.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('Image trop lourde (10 Mo max).')
      return
    }
    setUploadError('')
    setUpload({ url: URL.createObjectURL(file), name: file.name })
    setDesignId('upload')
  }

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    pointer.current = { x, y }
    sectionRef.current.style.setProperty('--mx', x.toFixed(3))
    sectionRef.current.style.setProperty('--my', y.toFixed(3))
  }

  const handlePointerLeave = () => {
    pointer.current = { x: 0, y: 0 }
    sectionRef.current.style.setProperty('--mx', '0')
    sectionRef.current.style.setProperty('--my', '0')
  }

  return (
    <section ref={sectionRef} className={`ps${model3d === 'ready' ? ' ps--3d' : ''}`} aria-labelledby="ps-title" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div className="ps__frame">
        <div className="ps-copy">
          <h2 className="ps-headline" id="ps-title">
            <span>Votre tampon,</span>
            <span className="ps-headline__accent">votre style</span>
          </h2>
          <p className="ps-intro">
            Habillez votre COLOP Printer 30 d'un motif, de votre logo ou de votre propre photo : choisissez un visuel
            autour du tampon pour l'essayer.
          </p>
        </div>

        <div ref={cardsRef} className="ps-cards" role="group" aria-label="Choisir l'habillage du tampon">
          {designs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`ps-card${designId === item.id ? ' is-active' : ''}`}
              style={{ ...item.pos, '--tilt': `${item.tilt}deg`, '--depth': item.depth }}
              aria-pressed={designId === item.id}
              aria-label={`Habillage : ${item.label}`}
              onClick={() => setDesignId(item.id)}
            >
              <span className="ps-card__img" style={{ backgroundImage: `url("${item.src}")` }}></span>
              <span className="ps-card__label">{item.label}</span>
            </button>
          ))}
          <label
            className={`ps-card ps-card--upload${designId === 'upload' ? ' is-active' : ''}`}
            style={{ ...uploadPos, '--tilt': '6deg', '--depth': -24 }}
          >
            <span className="ps-card__img" style={upload ? { backgroundImage: `url("${upload.url}")` } : undefined}>
              {!upload && <i className="fa-solid fa-plus" aria-hidden="true"></i>}
            </span>
            <span className="ps-card__label">{upload ? 'Votre image' : 'Importer votre image'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} onClick={() => upload && setDesignId('upload')} />
          </label>
        </div>

        <div className="ps-stage">
          <div className={`ps-printer ps-printer--${model3d}`}>
            <span ref={shadowRef} className="ps-printer__shadow" aria-hidden="true"></span>
            {/* Photo version: shown while the 3D model loads, and kept if WebGL is unavailable */}
            <div className="ps-printer__float ps-printer__photo">
              <Printer30 design={design} />
            </div>
            {model3d !== 'failed' && (
              <Suspense fallback={null}>
                <Printer3D design={designId === 'blue' ? null : design} pointer={pointer} onLoad={handle3dLoad} onError={handle3dError} onFrame={handle3dFrame} />
              </Suspense>
            )}
          </div>

          <div className="ps-bar">
            <span className="ps-bar__price">{formatPrice(PRICE)}</span>
            <button type="button" className="ps-bar__cart" onClick={() => addToCart('COLOP Printer 30 personnalisé')} aria-label="Ajouter au panier">
              <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>
            </button>
          </div>
          {uploadError && <p className="ps-error" role="alert">{uploadError}</p>}
        </div>
      </div>
    </section>
  )
}

export default PrinterStudio
