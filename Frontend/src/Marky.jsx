import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'

import refillKitImg from './assets/marky/products/refill-kit.png'
import ironOnLabelsImg from './assets/marky/products/iron-on-labels.jpg'
import penLabelsImg from './assets/marky/products/pen-labels.jpg'
import dishwasherLabelsImg from './assets/marky/products/dishwasher-labels.jpg'
import backpackPinkImg from './assets/marky/products/backpack-pink.jpg'
import backpackGreenImg from './assets/marky/products/backpack-green.jpg'
import backpackBlueImg from './assets/marky/products/backpack-blue.jpg'
import pencilCasePinkImg from './assets/products/marky-pencil-case-pink.jpg'
import pencilCaseGreenImg from './assets/marky/products/pencil-case-green.jpg'
import pencilCaseBlueImg from './assets/marky/products/pencil-case-blue.jpg'
import sosWristbandsImg from './assets/marky/products/sos-wristbands.jpg'

// Hero keyframes ({color}-{state}.webp) and the videos that animate from one state to the next ({color}{from}-{to}.webm)
const frames = {}
for (const [path, url] of Object.entries(import.meta.glob('./assets/marky/frames/*.webp', { eager: true, import: 'default' }))) {
  const [, color, state] = path.match(/(\w+)-(\d)\.webp$/)
  ;(frames[color] ??= {})[state] = url
}

const transitions = {}
for (const [path, url] of Object.entries(import.meta.glob('./assets/marky/transitions/*.webm', { eager: true, import: 'default' }))) {
  const [, color, from] = path.match(/(\w+?)(\d)-\d\.webm$/)
  ;(transitions[color] ??= {})[from] = url
}

const colors = [
  { id: 'green', label: 'Vert' },
  { id: 'pink', label: 'Rose' },
  { id: 'blue', label: 'Bleu' },
]

const MAX_STEP = 5

const frameFor = (color, state) => frames[color]?.[state] ?? frames.green[state] ?? frames.green[0]
const transitionFor = (color, from) => transitions[color]?.[from] ?? transitions.green[from]

// Text shown next to the animation for each step; the title's first line is highlighted in red
const stepContent = [
  {
    heading: 'MARKY',
    title: ['Le tampon ludique', 'qui donne le', 'sourire !'],
    subtitle: 'Des idées ingénieuses pour marquer et protéger les affaires de vos enfants, simplement et avec fun.',
    features: [
      ['fa-solid fa-droplet', 'Résistant', "à l'eau"],
      ['fa-solid fa-soap', 'Lavable en', 'machine'],
      ['fa-solid fa-shield-heart', 'Conforme', 'EN 71-3'],
    ],
    cta: 'Découvrir son utilisation',
    status: 'Fabriqué en Europe',
  },
  {
    title: ['Composez le nom', 'et préparez le', 'tampon !'],
    subtitle: 'Insérez les lettres, choisissez un petit symbole et préparez MARKY pour marquer les affaires de votre enfant en quelques secondes.',
    features: [
      ['fa-solid fa-font', 'Lettres', 'incluses'],
      ['fa-regular fa-face-smile', 'Symboles', 'amusants'],
      ['fa-solid fa-hand-sparkles', 'Prêt en', 'un instant'],
    ],
    cta: "Voir l'étape suivante",
    status: 'Transition en cours',
  },
  {
    title: ['Tamponnez, collez', 'et gardez tout', 'identifié !'],
    subtitle: 'Appliquez le marquage sur les vêtements, les gourdes, les boîtes et les fournitures pour retrouver chaque affaire sans stress.',
    features: [
      ['fa-solid fa-shirt', 'Textiles', 'marqués'],
      ['fa-solid fa-bottle-water', 'Objets', 'protégés'],
      ['fa-solid fa-check-double', 'Routine', 'terminée'],
    ],
    cta: 'Découvrir les produits',
    status: 'Étape finalisée',
  },
  {
    title: ['Rangez, partez', 'et laissez MARKY', 'suivre !'],
    subtitle: 'La solution est prête pour accompagner la routine quotidienne : les affaires restent reconnaissables, organisées et faciles à retrouver.',
    features: [
      ['fa-solid fa-box-open', 'Affaires', 'rangées'],
      ['fa-solid fa-route', 'Prêt pour', 'la journée'],
      ['fa-solid fa-heart', 'Sourire', 'assuré'],
    ],
    cta: 'Voir la collection',
    status: 'Parcours complet',
  },
  {
    title: ['Retrouvez tout', 'avec un simple', "coup d'œil !"],
    subtitle: "Chaque objet porte son repère clair et durable, pour une journée plus fluide à l'école, au sport ou en sortie.",
    features: [
      ['fa-solid fa-magnifying-glass', 'Objets', 'retrouvés'],
      ['fa-solid fa-child-reaching', 'Enfants', 'autonomes'],
      ['fa-solid fa-star', 'Routine', 'simplifiée'],
    ],
    cta: 'Choisir mon MARKY',
    status: 'Dernière étape',
  },
  {
    title: ['MARKY devient', 'votre allié', 'quotidien !'],
    subtitle: "Du matin jusqu'au retour à la maison, le marquage reste lisible, pratique et rassurant pour toute la famille.",
    features: [
      ['fa-solid fa-house-chimney', 'Retour', 'sans perte'],
      ['fa-solid fa-calendar-check', 'Usage', 'quotidien'],
      ['fa-solid fa-thumbs-up', 'Parents', 'rassurés'],
    ],
    cta: 'Ajouter au panier',
    status: 'Séquence terminée',
  },
]

const kitContents = [
  '1 tampon MARKY (disponible en rose, vert ou bleu)',
  '1 jeu de caractères (lettres, chiffres et 12 pictogrammes)',
  '20 étiquettes adhésives résistantes au lave-vaisselle (en 2 tailles)',
  '1 mètre de ruban thermocollant pour les vêtements sombres',
  '1 pincette pour composer le texte',
]
const formatPrice = (price) => `€${price.toFixed(2)}`

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

const loadImage = (src) => new Promise((resolve) => {
  const image = new Image()
  image.onload = resolve
  image.onerror = resolve
  image.src = src
})

const setScrollLock = (locked) => {
  document.documentElement.classList.toggle('marky-sequence-locked', locked)
  document.body.classList.toggle('marky-sequence-locked', locked)
}

function ColorSwatches({ options, value, onChange, className = '' }) {
  return (
    <div className={`marky-swatches ${className}`}>
      {options.map((color) => (
        <button
          key={color}
          type="button"
          className={`marky-swatch marky-swatch--${color}${color === value ? ' is-active' : ''}`}
          aria-label={colors.find((c) => c.id === color).label}
          aria-pressed={color === value}
          onClick={() => onChange(color)}
        ></button>
      ))}
    </div>
  )
}

function AccessoryCard({ product, onAdd }) {
  const colorOptions = Object.keys(product.images).filter((key) => key !== 'default')
  const [color, setColor] = useState(colorOptions[0])
  const image = product.images[color] ?? product.images.default

  return (
    <article className="marky-card">
      <div className="marky-card__image">
        <img src={image} alt={product.name} />
        {colorOptions.length > 0 && (
          <ColorSwatches className="marky-card__colors" options={colorOptions} value={color} onChange={setColor} />
        )}
      </div>
      <div className="marky-card__content">
        <h3>{product.name}</h3>
        <p className="marky-card__desc">{product.desc}</p>
        <ul className="marky-card__bullets">
          {product.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div className="marky-card__bottom">
          <span className="marky-price">{formatPrice(product.price)}</span>
          <button className="marky-card__add" type="button" aria-label="Ajouter au panier" onClick={() => onAdd(product.name)}>
            <i className="fa-solid fa-cart-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </article>
  )
}

function Marky() {
  const { addToCart } = useOutletContext()

  const [heroColor, setHeroColor] = useState('green')
  const [frameState, setFrameState] = useState(0)
  const [textStep, setTextStep] = useState(0)
  const [textAnimation, setTextAnimation] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const [imageHidden, setImageHidden] = useState(false)
  const [videoRunning, setVideoRunning] = useState(false)
  const [stampColor, setStampColor] = useState('green')

  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  // Mutable sequence state read by the scroll handlers (kept out of React state to avoid stale closures)
  const sequence = useRef({ step: 0, color: 'green', running: false, resetting: false, complete: false, videoRunning: false })

  useReveal(rootRef, '.marky-intro, .marky-featured, .marky-card')

  // Scroll-driven hero: each downward scroll inside the hero plays the next transition instead of scrolling
  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    const seq = sequence.current
    let touchStartY = 0
    let alive = true

    const isHeroActive = () => window.scrollY < hero.offsetTop + hero.offsetHeight - 4
    const holdHero = () => window.scrollTo({ top: hero.offsetTop, left: 0 })
    const preventScroll = (event) => {
      if (event.cancelable) event.preventDefault()
    }

    const playTransition = (from) => new Promise((resolve) => {
      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        seq.videoRunning = false
        setVideoRunning(false)
        video.removeEventListener('ended', finish)
        resolve()
      }

      seq.videoRunning = true
      setVideoRunning(true)
      const src = transitionFor(seq.color, from)
      if (video.dataset.src !== src) {
        video.pause()
        video.src = src
        video.dataset.src = src
        video.load()
      }
      video.addEventListener('ended', finish, { once: true })
      video.currentTime = 0
      setShowVideo(true)
      video.play()?.catch(finish)
      window.setTimeout(finish, 12000)
    })

    // fromClick: a click may replay the sequence even after it has been completed by scrolling
    const runNextStep = async (fromClick = false) => {
      if ((seq.complete && !fromClick) || seq.resetting || seq.running || seq.step >= MAX_STEP || !isHeroActive()) return

      seq.running = true
      const previous = seq.step
      seq.step += 1
      const next = seq.step
      setScrollLock(true)
      holdHero()

      const transition = playTransition(previous)

      setTextAnimation('is-leaving')
      await wait(460)
      setTextStep(next)
      setTextAnimation('is-entering')
      await wait(620)
      setTextAnimation('')

      await transition
      await loadImage(frameFor(seq.color, next))
      if (!alive) return
      setFrameState(next)
      setShowVideo(false)
      video.pause()

      setScrollLock(false)
      seq.running = false
    }

    // After the last step, the next scroll (or click) brings the hero back to its start and releases the page
    const resetSequence = async (fromClick = false) => {
      if (seq.resetting || seq.running || seq.videoRunning || (seq.complete && !fromClick) || seq.step < MAX_STEP) return

      seq.resetting = true
      seq.complete = true
      setScrollLock(true)
      holdHero()
      seq.step = 0
      video.pause()
      setShowVideo(false)

      setTextAnimation('is-leaving')
      setImageHidden(true)
      await wait(360)
      setTextStep(0)
      await loadImage(frameFor(seq.color, 0))
      if (!alive) return
      setFrameState(0)
      setTextAnimation('is-entering')
      setImageHidden(false)
      seq.resetting = false
      setScrollLock(false)
      await wait(520)
      setTextAnimation('')
    }

    const handleDown = (event) => {
      if (seq.running || seq.resetting) {
        preventScroll(event)
        return
      }
      if (seq.complete || !isHeroActive()) return

      preventScroll(event)
      if (seq.step < MAX_STEP) runNextStep()
      else resetSequence()
    }

    const handleWheel = (event) => {
      if (event.deltaY > 0) handleDown(event)
      else if (seq.running || seq.resetting) preventScroll(event)
    }

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (event) => {
      const touchY = event.touches[0]?.clientY ?? touchStartY
      if (touchStartY - touchY > 8) handleDown(event)
      else if (seq.running || seq.resetting) preventScroll(event)
    }

    const handleKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(event.key)) handleDown(event)
    }

    // A click anywhere in the hero (outside its links and buttons) also plays the next step
    const handleClick = (event) => {
      if (event.target.closest('a, button') || seq.running || seq.resetting) return
      if (seq.step < MAX_STEP) runNextStep(true)
      else resetSequence(true)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    hero.addEventListener('click', handleClick)

    // Warm the cache so transitions start without a pause
    Object.values(frames).forEach((states) => Object.values(states).forEach((src) => loadImage(src)))
    Object.values(transitions).forEach((states) => Object.values(states).forEach((src) => {
      const probe = document.createElement('video')
      probe.preload = 'auto'
      probe.src = src
    }))

    return () => {
      alive = false
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
      hero.removeEventListener('click', handleClick)
      setScrollLock(false)
      // Fresh sequence if the page is mounted again
      Object.assign(seq, { step: 0, running: false, resetting: false, complete: false, videoRunning: false })
    }
  }, [])

  const selectHeroColor = (color) => {
    if (sequence.current.videoRunning || color === heroColor) return
    sequence.current.color = color
    setHeroColor(color)
  }

  const content = stepContent[textStep]

  return (
    <main ref={rootRef} className="marky-page">
      <section ref={heroRef} className="marky-hero">
        <div className="marky-hero__inner">
          <div className="marky-hero-copy">
            <div className={`marky-step-text ${textAnimation}`} data-step={textStep}>
              <h1>{content.heading ?? `ÉTAPE ${textStep}`}</h1>
              <h2 className="marky-hero-title">
                {content.title[0]}
                <br />
                {content.title[1]} <strong>{content.title[2]}</strong>
              </h2>
              <p className="marky-subtitle">{content.subtitle}</p>
              <div className="marky-feature-row" aria-label={textStep === 0 ? 'Avantages MARKY' : `Étape ${textStep} MARKY`}>
                {content.features.map(([icon, line1, line2]) => (
                  <span key={line1 + line2}>
                    <i className={icon} aria-hidden="true"></i>
                    <b>{line1}<br />{line2}</b>
                  </span>
                ))}
              </div>
              <div className="marky-hero-actions">
                <a className="marky-primary" href="#marky-utilisation">{content.cta}</a>
                <span className="marky-made"><i className="fa-solid fa-spinner" aria-hidden="true"></i> {content.status}</span>
              </div>
            </div>
          </div>

          <div className="marky-hero-art">
            <div className="marky-hero-card" aria-label="Animation MARKY">
              <div className="marky-color-dots" role="group" aria-label="Choisir une couleur MARKY">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    className={`marky-color-dot marky-color-dot--${color.id}${color.id === heroColor ? ' is-active' : ''}`}
                    aria-label={color.label}
                    aria-pressed={color.id === heroColor}
                    disabled={videoRunning}
                    onClick={() => selectHeroColor(color.id)}
                  ></button>
                ))}
              </div>
              <img
                className={`marky-hero-media${!showVideo && !imageHidden ? ' is-active' : ''}`}
                src={frameFor(heroColor, frameState)}
                alt={`MARKY ${colors.find((c) => c.id === heroColor).label.toLowerCase()} étape ${frameState}`}
              />
              <span className={`marky-hint${videoRunning ? ' is-hidden' : ''}`} aria-hidden="true">
                <i className="fa-solid fa-computer-mouse"></i>Cliquez ou faites défiler
              </span>
              <video
                ref={videoRef}
                className={`marky-hero-media${showVideo ? ' is-active' : ''}`}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              ></video>
            </div>
          </div>
        </div>
      </section>

      <div className="marky-wrap">
        <section className="marky-intro" id="marky-utilisation">
          <h2>Qu'est-ce que <span>MARKY</span> ?</h2>
          <p>
            Les parents ne connaissent que trop bien le problème : les enfants perdent constamment leurs effets
            personnels — que ce soit à la crèche, à l'école, lors des sorties ou du sport. Qu'il s'agisse de vestes, de
            bonnets, de bouteilles d'eau, de boîtes à goûter, de chaussures ou de crayons, la liste des objets
            fréquemment égarés est longue.
          </p>
          <p>
            C'est exactement là que MARKY intervient : notre objectif est d'aider les parents à protéger les affaires de
            leurs enfants simplement, sûrement et de façon personnalisée. Tous les produits MARKY sont bien pensés, de
            qualité supérieure, et offrent une aide pratique au quotidien avec un facteur ludique pour les enfants.
          </p>
        </section>

        <section className="marky-featured">
          <div className="marky-featured__grid">
            <div className="marky-featured__image">
              <img src={frameFor(stampColor, 0)} alt={`Tampon textile MARKY ${colors.find((c) => c.id === stampColor).label.toLowerCase()}`} />
              <div className="marky-featured__picker">
                <span>Couleur du tampon :</span>
                <ColorSwatches options={colors.map((c) => c.id)} value={stampColor} onChange={setStampColor} />
              </div>
            </div>
            <div className="marky-featured__details">
              <span className="marky-flag">Produit phare</span>
              <h2>Tampon textile &amp; d'objets MARKY</h2>
              <p className="marky-tagline">Le moyen le plus rapide, le plus simple et le plus pratique de protéger tous les objets des enfants.</p>
              <p className="marky-description">
                Avec son encre dermatologiquement testée et résistante aux lavages, MARKY permet de marquer vêtements et
                objets directement. Le jeu de lettres inclus permet de personnaliser l'empreinte avec le nom de l'enfant
                et de petits symboles rigolos.
              </p>

              <h3>Contenu du kit :</h3>
              <ul className="marky-kit-list">
                {kitContents.map((item) => (
                  <li key={item}><i className="fa-solid fa-check" aria-hidden="true"></i>{item}</li>
                ))}
              </ul>

              <div className="marky-price-action">
                <span className="marky-price">{formatPrice(17.95)}</span>
                <button className="marky-buy" type="button" onClick={() => addToCart('Tampon textile & d’objets MARKY')}>
                  <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i> Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

export default Marky
