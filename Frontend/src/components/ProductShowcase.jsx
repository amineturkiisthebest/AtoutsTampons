import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

import printerImg from '../assets/showcase/printer-20.png'
import markyImg from '../assets/showcase/marky-diy.png'
import ladotImg from '../assets/showcase/ladot-papillon.png'
import woodiesImg from '../assets/showcase/woodies-bateau.png'
import emarkImg from '../assets/showcase/emark.png'
import inkPadImg from '../assets/showcase/encrier-e05.png'

// Products from the atoutstampons.fr catalogue, one per range; `accent` colours the ink splash of each step
const products = [
  {
    name: 'COLOP Printer 20',
    category: 'Tampons de texte',
    img: printerImg,
    accent: '#ef1d2a',
    text: "Le tampon auto-encreur incontournable du bureau : votre adresse, votre cachet ou votre signature, personnalisés sur plusieurs lignes.",
    features: [
      ['fa-solid fa-pen-ruler', 'Texte', 'personnalisé'],
      ['fa-solid fa-rotate', 'Auto-', 'encreur'],
      ['fa-solid fa-briefcase', 'Usage', 'professionnel'],
    ],
    price: 29.4,
    to: '/tampons-t',
  },
  {
    name: 'Marky DIY - vert',
    category: 'Tampons créatifs · Marky',
    img: markyImg,
    accent: '#75c92f',
    text: "Le tampon textile pour marquer vêtements et affaires des enfants avec leur prénom, grâce au jeu de lettres inclus.",
    features: [
      ['fa-solid fa-shirt', 'Spécial', 'textile'],
      ['fa-solid fa-font', 'Lettres', 'incluses'],
      ['fa-solid fa-child-reaching', 'Pour les', 'enfants'],
    ],
    price: 21.54,
    to: '/marky',
  },
  {
    name: 'Pierre LaDot - Papillon',
    category: 'Tampons créatifs · LaDot',
    img: ladotImg,
    accent: '#d9628f',
    text: 'Une pierre-tampon grand format pour appliquer en quelques secondes un tatouage temporaire au motif papillon.',
    features: [
      ['fa-solid fa-wand-magic-sparkles', 'Tatouage', 'temporaire'],
      ['fa-regular fa-clock', 'Prêt en', 'secondes'],
      ['fa-regular fa-gem', 'Format', 'large'],
    ],
    price: 9.54,
    to: '/ladot',
  },
  {
    name: 'Woodies - Bateau à voile',
    category: 'Tampons créatifs · Woodies',
    img: woodiesImg,
    accent: '#b98a5a',
    text: 'Un tampon en bois naturel au motif de voilier dessiné à la main, pour décorer cartes, carnets et emballages.',
    features: [
      ['fa-solid fa-tree', 'Bois', 'naturel'],
      ['fa-solid fa-paintbrush', 'Dessiné', 'à la main'],
      ['fa-solid fa-gift', 'Idéal pour', 'décorer'],
    ],
    price: 6.6,
    to: '/woodies',
  },
  {
    name: 'COLOP e-mark',
    category: 'Impression mobile',
    img: emarkImg,
    accent: '#1fb5a5',
    text: "L'imprimante mobile qui imprime en couleur textes, logos et images sur de nombreuses surfaces, directement depuis votre smartphone.",
    features: [
      ['fa-solid fa-mobile-screen', 'Pilotée par', 'application'],
      ['fa-solid fa-palette', 'Impression', 'couleur'],
      ['fa-solid fa-layer-group', 'Multi-', 'surfaces'],
    ],
    price: 430,
    to: '/impression-mobile',
  },
  {
    name: 'COLOP Encrier E/05',
    category: 'Accessoires · Encriers',
    img: inkPadImg,
    accent: '#26362f',
    text: 'La cassette encreuse de rechange qui redonne à votre tampon une empreinte nette et bien encrée.',
    features: [
      ['fa-solid fa-fill-drip', 'Encre', 'neuve'],
      ['fa-solid fa-arrows-rotate', 'Rechange', 'facile'],
      ['fa-solid fa-check', 'Empreinte', 'nette'],
    ],
    price: 6,
    to: '/encriers',
  },
]

const formatPrice = (price) => `${price.toFixed(2).replace('.', ',')} €`
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

// Click-driven product carousel shown at the top of the home page (same interaction as the Marky hero)
function ProductShowcase() {
  const { addToCart } = useOutletContext()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('')
  const busy = useRef(false)
  const sectionRef = useRef(null)
  const product = products[index]

  // Warm the cache so each product appears without a delay
  useEffect(() => {
    products.forEach(({ img }) => {
      const image = new Image()
      image.src = img
    })
  }, [])

  const goTo = async (next) => {
    if (busy.current || next === index) return
    busy.current = true
    setPhase('is-leaving')
    await wait(380)
    setIndex(next)
    setPhase('is-entering')
    await wait(700)
    setPhase('')
    busy.current = false
  }

  // A click anywhere in the section (outside its links and buttons) shows the next product
  const handleClick = (event) => {
    if (event.target.closest('a, button:not(.showcase-hint)')) return
    goTo((index + 1) % products.length)
  }

  return (
    <section
      ref={sectionRef}
      className="showcase"
      aria-roledescription="carrousel"
      aria-label="Nos produits phares"
      onClick={handleClick}
      style={{ '--showcase-accent': product.accent }}
    >
      <div className="showcase__inner">
        <div className={`showcase-copy ${phase}`} aria-live="polite">
          <span className="hero-kicker">Nos produits phares</span>
          <p className="showcase-counter">
            <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(products.length).padStart(2, '0')}
          </p>
          <h2 className="showcase-title">
            <span>{product.category}</span>
            {product.name}
          </h2>
          <p className="showcase-text">{product.text}</p>
          <div className="showcase-features">
            {product.features.map(([icon, line1, line2]) => (
              <span key={line1 + line2}>
                <i className={icon} aria-hidden="true"></i>
                <b>{line1}<br />{line2}</b>
              </span>
            ))}
          </div>
          <div className="showcase-actions">
            <span className="showcase-price">{formatPrice(product.price)}</span>
            <button className="btn showcase-cart" type="button" onClick={() => addToCart(product.name)}>
              <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>Ajouter au panier
            </button>
            <Link className="showcase-link" to={product.to}>Voir la gamme</Link>
          </div>
        </div>

        <div className="showcase-art">
          <div className="showcase-stage">
            <span className={`showcase-splash ${phase}`} aria-hidden="true"></span>
            <img
              key={product.img}
              className={`showcase-product ${phase}`}
              src={product.img}
              alt={product.name}
            />
            <button type="button" className={`showcase-hint${phase ? ' is-hidden' : ''}`}>
              <i className="fa-solid fa-hand-pointer" aria-hidden="true"></i>Cliquez pour la suite
            </button>
          </div>

          <div className="showcase-thumbs" role="tablist" aria-label="Choisir un produit">
            {products.map((item, itemIndex) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                className={`showcase-thumb${itemIndex === index ? ' is-active' : ''}`}
                aria-selected={itemIndex === index}
                aria-label={item.name}
                onClick={() => goTo(itemIndex)}
              >
                <img src={item.img} alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase
