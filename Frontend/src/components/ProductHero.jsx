import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useOutletContext } from 'react-router-dom'

import printerImg from '../assets/showcase/printer-20.png'
import markyImg from '../assets/showcase/marky-diy.png'
import ladotImg from '../assets/showcase/ladot-papillon.png'
import woodiesImg from '../assets/showcase/woodies-bateau.png'
import emarkImg from '../assets/showcase/emark.png'
import inkPadImg from '../assets/showcase/encrier-e05.png'

// Products from the atoutstampons.fr catalogue. `accent` tints the whole section when the product is selected,
// `particles` are the icons that burst from a click and float around the product.
const products = [
  {
    name: 'COLOP Printer 20',
    category: 'Tampons de texte',
    img: printerImg,
    accent: '#ef1d2a',
    headline: ['Net', '& Précis'],
    tagline: "Votre adresse, votre cachet ou votre signature : le tampon auto-encreur indispensable au bureau.",
    slogan: ['Parfait à chaque', 'empreinte'],
    particles: ['fa-solid fa-stamp', 'fa-solid fa-star', 'fa-solid fa-check'],
    price: 29.4,
    to: '/tampons-t',
  },
  {
    name: 'Marky DIY - vert',
    category: 'Marky',
    img: markyImg,
    accent: '#5fb32a',
    headline: ['Fun', '& Malin'],
    tagline: "Marquez vêtements et affaires des enfants avec leur prénom, grâce au jeu de lettres inclus.",
    slogan: ['Plus rien', 'ne se perd'],
    particles: ['fa-solid fa-shirt', 'fa-solid fa-heart', 'fa-solid fa-star'],
    price: 21.54,
    to: '/marky',
  },
  {
    name: 'Pierre LaDot - Papillon',
    category: 'LaDot',
    img: ladotImg,
    accent: '#d9628f',
    headline: ['Tattoo', 'Éphémère'],
    tagline: 'Une pierre-tampon pour appliquer en quelques secondes un tatouage temporaire au motif papillon.',
    slogan: ['Brillez', 'en un geste'],
    particles: ['fa-solid fa-wand-magic-sparkles', 'fa-solid fa-heart', 'fa-regular fa-gem'],
    price: 9.54,
    to: '/ladot',
  },
  {
    name: 'Woodies - Bateau à voile',
    category: 'Woodies',
    img: woodiesImg,
    accent: '#b07d4b',
    headline: ['Bois', 'Naturel'],
    tagline: 'Un tampon en bois au motif de voilier dessiné à la main, pour décorer cartes, carnets et emballages.',
    slogan: ['Créez', 'avec cœur'],
    particles: ['fa-solid fa-leaf', 'fa-solid fa-sailboat', 'fa-solid fa-heart'],
    price: 6.6,
    to: '/woodies',
  },
  {
    name: 'COLOP e-mark',
    category: 'Impression mobile',
    img: emarkImg,
    accent: '#16a394',
    headline: ['Imprimez', 'Partout'],
    tagline: "L'imprimante mobile qui imprime en couleur textes, logos et images, directement depuis votre smartphone.",
    slogan: ['La couleur', 'sans limite'],
    particles: ['fa-solid fa-droplet', 'fa-solid fa-palette', 'fa-solid fa-mobile-screen'],
    price: 430,
    to: '/impression-mobile',
  },
  {
    name: 'COLOP Encrier E/05',
    category: 'Encriers',
    img: inkPadImg,
    accent: '#3a4f7a',
    headline: ['Encre', 'Neuve'],
    tagline: 'La cassette encreuse de rechange qui redonne à votre tampon une empreinte nette et bien encrée.',
    slogan: ['Toujours', 'bien encré'],
    particles: ['fa-solid fa-droplet', 'fa-solid fa-fill-drip', 'fa-solid fa-check'],
    price: 6,
    to: '/encriers',
  },
]

// Decorative icons floating around the product; `depth` sets how strongly each one reacts to the cursor
const decor = [
  { top: '14%', left: '30%', size: 26, depth: 34, delay: 0 },
  { top: '26%', left: '66%', size: 34, depth: -26, delay: 0.6 },
  { top: '62%', left: '26%', size: 30, depth: 22, delay: 1.2 },
  { top: '72%', left: '62%', size: 24, depth: -38, delay: 0.3 },
  { top: '44%', left: '74%', size: 20, depth: 46, delay: 0.9 },
  { top: '40%', left: '22%', size: 18, depth: -18, delay: 1.5 },
]

const BURST_SIZE = 12
const formatPrice = (price) => `${price.toFixed(2).replace('.', ',')} €`
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Home page hero: the product follows the cursor, icons burst from clicks and the section's colour follows the selected product
function ProductHero() {
  const { addToCart } = useOutletContext()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('')
  const [bursts, setBursts] = useState([])
  const sectionRef = useRef(null)
  const busy = useRef(false)
  const burstId = useRef(0)
  const product = products[index]
  const others = [1, 2].map((offset) => (index + offset) % products.length)

  useEffect(() => {
    products.forEach(({ img }) => {
      const image = new Image()
      image.src = img
    })
  }, [])

  const select = async (next) => {
    if (busy.current || next === index) return
    busy.current = true
    setPhase('is-leaving')
    await wait(380)
    setIndex(next)
    setPhase('is-entering')
    await wait(750)
    setPhase('')
    busy.current = false
  }

  const step = (direction) => select((index + direction + products.length) % products.length)

  // Cursor position as -1…1 on each axis, written to CSS variables (no re-render on every move)
  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    sectionRef.current.style.setProperty('--mx', x.toFixed(3))
    sectionRef.current.style.setProperty('--my', y.toFixed(3))
  }

  const handlePointerLeave = () => {
    sectionRef.current.style.setProperty('--mx', '0')
    sectionRef.current.style.setProperty('--my', '0')
  }

  // Icons burst out from wherever the visitor clicks or taps (outside the links and buttons)
  const handlePointerDown = (event) => {
    if (event.target.closest('a, button') || prefersReducedMotion()) return
    const id = ++burstId.current
    const particles = Array.from({ length: BURST_SIZE }, (_, i) => {
      const angle = (i / BURST_SIZE) * Math.PI * 2 + Math.random() * 0.5
      const distance = 70 + Math.random() * 110
      return {
        icon: product.particles[i % product.particles.length],
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        rotate: Math.round(Math.random() * 360 - 180),
        size: 14 + Math.round(Math.random() * 16),
      }
    })
    setBursts((current) => [...current, { id, x: event.clientX, y: event.clientY, color: product.accent, particles }])
    window.setTimeout(() => setBursts((current) => current.filter((burst) => burst.id !== id)), 1000)
  }

  return (
    <section
      ref={sectionRef}
      className="ph"
      aria-label="Nos produits phares"
      style={{ '--accent': product.accent }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <div className="ph__top-fade" aria-hidden="true"></div>
      <div className="ph__glow" aria-hidden="true"></div>

      <div className="ph__frame">
        <div className={`ph-copy ${phase}`}>
          <h2 className="ph-headline">
            <span>{product.headline[0]}</span>
            <span>{product.headline[1]}</span>
          </h2>
          <div className="ph-intro">
            <span className="ph-category">{product.category}</span>
            <p>{product.tagline}</p>
            <div className="ph-actions">
              <button className="ph-shop" type="button" onClick={() => addToCart(product.name)}>
                Ajouter au panier <span className="ph-shop__plus" aria-hidden="true"><i className="fa-solid fa-plus"></i></span>
              </button>
              <Link className="ph-link" to={product.to}>Voir la gamme</Link>
            </div>
          </div>
        </div>

        <div className="ph-stage" aria-live="polite">
          {decor.map((item, decorIndex) => (
            <span
              key={decorIndex}
              className="ph-decor"
              style={{ top: item.top, left: item.left, '--depth': item.depth, '--delay': `${item.delay}s` }}
              aria-hidden="true"
            >
              <i className={product.particles[decorIndex % product.particles.length]} style={{ fontSize: item.size }}></i>
            </span>
          ))}
          <div className="ph-product">
            <img key={product.img} className={`ph-product__img ${phase}`} src={product.img} alt={product.name} />
          </div>
        </div>

        <div className="ph-picker">
          <div className="ph-cards">
            {others.map((productIndex) => {
              const item = products[productIndex]
              return (
                <button
                  key={item.name}
                  type="button"
                  className="ph-card"
                  style={{ '--card-accent': item.accent }}
                  onClick={() => select(productIndex)}
                  aria-label={`Voir ${item.name}`}
                >
                  <span className="ph-card__img"><img src={item.img} alt="" /></span>
                  <span className="ph-card__name">{item.name}</span>
                  <span className="ph-card__price">{formatPrice(item.price)}</span>
                </button>
              )
            })}
          </div>
          <div className="ph-arrows">
            <button type="button" aria-label="Produit précédent" onClick={() => step(-1)}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <span className="ph-count">{String(index + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</span>
            <button type="button" aria-label="Produit suivant" onClick={() => step(1)}>
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <p className={`ph-slogan ${phase}`} aria-hidden="true">
          <span>{product.slogan[0]}</span>
          <span>{product.slogan[1]}</span>
        </p>

        <div className="ph-badge">
          <span className="ph-badge__icon"><i className="fa-solid fa-award" aria-hidden="true"></i></span>
          <span>
            <small>Qualité COLOP</small>
            Fabriqué en Europe
          </span>
        </div>

        <div className="ph-price-tag" aria-label={`Prix : ${formatPrice(product.price)}`}>
          <small>{product.name}</small>
          {formatPrice(product.price)}
        </div>
      </div>

      {/* Rendered on <body> at viewport coordinates so the section's edges never clip the burst */}
      {createPortal(
        bursts.map((burst) => (
          <span key={burst.id} className="ph-burst" style={{ left: burst.x, top: burst.y, color: burst.color }} aria-hidden="true">
            {burst.particles.map((particle, particleIndex) => (
              <i
                key={particleIndex}
                className={particle.icon}
                style={{ '--dx': `${particle.dx}px`, '--dy': `${particle.dy}px`, '--rot': `${particle.rotate}deg`, fontSize: particle.size }}
              ></i>
            ))}
          </span>
        )),
        document.body,
      )}
    </section>
  )
}

export default ProductHero
