import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'

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
  // Mutable sequence state read by the click handler (kept out of React state to avoid stale closures)
  const sequence = useRef({ step: 0, color: 'green', running: false, resetting: false, videoRunning: false })

  useReveal(rootRef, '.marky-intro, .marky-featured, .marky-card')

  // Click-driven hero: each click plays the transition to the next step, and after the last step returns to the start
  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    const seq = sequence.current
    let alive = true

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

    const runNextStep = async () => {
      seq.running = true
      const previous = seq.step
      seq.step += 1
      const next = seq.step

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
      seq.running = false
    }

    const resetSequence = async () => {
      seq.resetting = true
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
      await wait(520)
      setTextAnimation('')
    }

    // Clicks on the hero's links and buttons keep their own behaviour, except the "next step" hint button
    const handleClick = (event) => {
      if (event.target.closest('a, button:not(.marky-hint)')) return
      if (seq.running || seq.resetting || seq.videoRunning) return
      if (seq.step < MAX_STEP) runNextStep()
      else resetSequence()
    }

    hero.addEventListener('click', handleClick)

    // Warm the cache so transitions start without a pause. Waits until the page is idle so it doesn't compete
    // with the first paint, and fetches the current colour before the others.
    const warmColor = (color) => {
      Object.values(frames[color] ?? {}).forEach((src) => loadImage(src))
      Object.values(transitions[color] ?? {}).forEach((src) => {
        const probe = document.createElement('video')
        probe.preload = 'auto'
        probe.src = src
      })
    }
    const whenIdle = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 1200))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const idleId = whenIdle(() => {
      warmColor(seq.color)
      Object.keys(frames).filter((color) => color !== seq.color).forEach(warmColor)
    })

    return () => {
      cancelIdle(idleId)
      alive = false
      hero.removeEventListener('click', handleClick)
      // Fresh sequence if the page is mounted again
      Object.assign(seq, { step: 0, running: false, resetting: false, videoRunning: false })
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
              <button type="button" className={`marky-hint${videoRunning ? ' is-hidden' : ''}`} disabled={videoRunning}>
                <i className="fa-solid fa-hand-pointer" aria-hidden="true"></i>
                {textStep < MAX_STEP ? 'Cliquez pour la suite' : 'Cliquez pour recommencer'}
              </button>
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
              <img loading="lazy" decoding="async" src={frameFor(stampColor, 0)} alt={`Tampon textile MARKY ${colors.find((c) => c.id === stampColor).label.toLowerCase()}`} />
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
