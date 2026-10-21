import { useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'
import ProductShowcase from './components/ProductShowcase.jsx'

import heroVideo from './assets/sections/hero-main-video.webm'
import companyImg from './assets/sections/company.jpg'
import productionImg from './assets/sections/production-01.jpg'

import brandMarky from './assets/brands/marky.jpg'
import brandLabeler from './assets/brands/craft-labeler.jpg'
import brandMake from './assets/brands/make-stamp-pads.jpg'
import brandCleaner from './assets/brands/stamp-cleaner.jpg'
import brandLadot from './assets/brands/ladot.jpg'
import brandWoodies from './assets/brands/woodies.jpg'
import brandMaja from './assets/brands/princess-maja.png'
import brandNio from './assets/brands/nio-school.jpg'


import productPencilCase from './assets/products/marky-pencil-case-pink.jpg'
import productLadotSet from './assets/products/ladot-set-bear-dolphin.jpg'
import productTextileStamp from './assets/products/marky-textile-stamp-green.jpg'
import productInkPad from './assets/products/make-1-ink-pad-uv.jpg'

const heroPerks = [
  { icon: 'fa-solid fa-pen-ruler', label: 'Personnalisation', text: 'Texte, logo ou motif' },
  { icon: 'fa-solid fa-truck-fast', label: 'Livraison rapide', text: '2 à 7 jours ouvrables' },
  { icon: 'fa-solid fa-award', label: 'Qualité COLOP', text: 'Fabrication européenne' },
]

const categories = [
  { icon: 'fa-solid fa-crown', name: 'MARKY', count: 14 },
  { icon: 'fa-solid fa-tag', name: 'Craft Labeler', count: 8 },
  { icon: 'fa-solid fa-stamp', name: 'Encreurs MAKE', count: 15 },
  { icon: 'fa-solid fa-droplet', name: 'Nettoyant pour tampons', count: 1 },
  { icon: 'fa-solid fa-sun', name: 'Tatouages temporaires LaDot', count: 85 },
  { icon: 'fa-solid fa-leaf', name: 'Woodies', count: 50 },
  { icon: 'fa-regular fa-gem', name: 'Princess Maja', count: 42 },
  { icon: 'fa-solid fa-graduation-cap', name: 'NIO School', count: 45 },
  { icon: 'fa-solid fa-wand-magic-sparkles', name: 'CLEANY', count: 12 },
]

const brands = [
  { className: 'marky', img: brandMarky, name: 'MARKY', text: 'Tampons textiles pour la vie de famille' },
  { className: 'labeler', img: brandLabeler, name: 'Craft Labeler', text: 'Gaufrer, étiqueter, décorer' },
  { className: 'make', img: brandMake, name: 'Encreurs MAKE', text: 'Des couleurs nettes pour créer' },
  { className: 'cleaner', img: brandCleaner, name: 'Nettoyant pour tampons', text: 'Entretien des tampons et encreurs' },
  { className: 'ladot', img: brandLadot, name: 'LaDot', text: 'Tampons de tatouages temporaires' },
  { className: 'woodies', img: brandWoodies, name: 'Woodies', text: 'Motifs classiques en bois' },
  { className: 'maja', img: brandMaja, name: 'Princess Maja', text: 'Tampons ludiques pour enfants' },
  { className: 'nio', img: brandNio, name: 'NIO School', text: 'Petits tampons pour grandes idées' },
]

const colopFacts = [
  { icon: 'fa-solid fa-earth-europe', text: 'Fabrication 100 % européenne' },
  { icon: 'fa-solid fa-award', text: 'Qualité premium et matériaux durables' },
  { icon: 'fa-solid fa-palette', text: "Plus de 20 ans d'expérience en tampons créatifs" },
]

const siteFeatures = [
  { icon: 'fa-solid fa-pen-ruler', text: 'Personnalisation en ligne' },
  { icon: 'fa-solid fa-truck-fast', text: 'Livraison en 2 à 7 jours' },
  { icon: 'fa-solid fa-lock', text: 'Paiement sécurisé' },
  { icon: 'fa-solid fa-headset', text: 'Service client à votre écoute' },
]

const products = [
  { img: productPencilCase, name: 'Trousse Marky - rose', reviews: 124, price: 11.95, flag: null, flagClass: '' },
  { img: productLadotSet, name: 'Set LaDot S - Ours & Dauphin', reviews: 98, price: 19.95, flag: 'LaDot', flagClass: 'flag--purple' },
  { img: productTextileStamp, name: 'Tampon textile Marky - vert', reviews: 76, price: 17.95, flag: 'MARKY', flagClass: 'flag--green' },
  { img: productInkPad, name: 'Encreur MAKE 1 - encre UV', reviews: 54, price: 6.19, flag: 'Nouveau', flagClass: 'flag--blue' },
]

const revealSelector = '.section-intro, .brand-tile, .product-card, .manufacturing, .about-card'

function Home() {
  const { showToast, addToCart } = useOutletContext()
  const [filtersHidden, setFiltersHidden] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [wishlist, setWishlist] = useState(() => new Set())

  const rootRef = useRef(null)
  useReveal(rootRef, revealSelector)

  const toggleWishlist = (event, index) => {
    event.stopPropagation()
    const active = !wishlist.has(index)
    setWishlist((current) => {
      const next = new Set(current)
      if (active) next.add(index)
      else next.delete(index)
      return next
    })
    showToast(active ? 'Ajouté aux favoris' : 'Retiré des favoris')
  }

  const handleAddToCart = (event, product) => {
    event.stopPropagation()
    addToCart(product.name)
  }

  const selectCategory = (event, index) => {
    event.preventDefault()
    setActiveCategory((current) => (current === index ? null : index))
  }

  return (
    <main ref={rootRef}>
      <ProductShowcase />

      <section className="hero">
        <div className="hero__inner">
          <div className="hero-copy">
            <span className="hero-kicker">Bienvenue chez Atouts Tampons</span>
            <p>
              Tampons personnalisés, prêts à l'emploi ou créatifs : créez le tampon qui vous ressemble en quelques clics
              et recevez-le directement chez vous.
            </p>
            <div className="hero-actions">
              <a className="btn btn--arrow" href="#">Découvrir la boutique</a>
            </div>
            <ul className="hero-perks">
              {heroPerks.map((perk) => (
                <li key={perk.label}>
                  <i className={perk.icon} aria-hidden="true"></i>
                  <span><strong>{perk.label}</strong>{perk.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-art">
            <video className="hero-video" autoPlay muted loop playsInline aria-label="Vidéo des produits COLOP Arts & Crafts">
              <source src={heroVideo} type="video/webm" />
            </video>
          </div>
        </div>
      </section>


      <div className="after-universe">


        <section className="products">
          <div className="section-heading">
            <h2>Meilleures ventes</h2>
          </div>
          <div className="product-grid">
            {products.map((product, index) => {
              const inWishlist = wishlist.has(index)
              return (
                <article key={product.name} className="product-card">
                  <button
                    className="wishlist-button"
                    type="button"
                    aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    aria-pressed={inWishlist}
                    onClick={(event) => toggleWishlist(event, index)}
                  >
                    <i className={`${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                  </button>
                  <div className="product-image">
                    <img src={product.img} alt={product.name} />
                  </div>
                  {product.flag && <span className={`flag ${product.flagClass}`}>{product.flag}</span>}
                  <h3>{product.name}</h3>
                  <div className="rating" aria-label="Note 5 sur 5">
                    <span>★★★★★</span><small>({product.reviews})</small>
                  </div>
                  <p className="price">€{product.price.toFixed(2)}</p>
                  <p className="meta">TVA incluse · délai de livraison 2 à 7 jours ouvrables</p>
                  <button className="add-to-cart" type="button" onClick={(event) => handleAddToCart(event, product)}>
                    <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>Ajouter au panier
                  </button>
                </article>
              )
            })}
          </div>
          <a className="products-more" href="#">Voir tous les produits</a>
        </section>


        <section className="about" aria-labelledby="about-title">
          <div className="about__intro">
            <span className="eyebrow">Qui sommes-nous ?</span>
            <h2 id="about-title">COLOP &amp; Atouts Tampons</h2>
            <p>
              Un fabricant européen reconnu et une boutique en ligne pensée pour vous : découvrez qui se cache derrière
              vos tampons.
            </p>
          </div>

          <div className="about-grid">
            <article className="about-card">
              <div className="about-card__image">
                <img src={companyImg} alt="Produits COLOP" />
              </div>
              <div className="about-card__body">
                <span className="about-card__label"><i className="fa-solid fa-industry" aria-hidden="true"></i>Le fabricant</span>
                <h3>COLOP, l'expert européen du tampon</h3>
                <p>
                  Entreprise familiale autrichienne, COLOP conçoit et fabrique des tampons encreurs, dateurs,
                  numéroteurs et tampons créatifs reconnus pour leur fiabilité. Chaque produit allie savoir-faire
                  industriel, design moderne et qualité premium.
                </p>
                <ul className="about-list">
                  {colopFacts.map((fact) => (
                    <li key={fact.text}>
                      <i className={fact.icon} aria-hidden="true"></i>{fact.text}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="about-card about-card--site">
              <div className="about-card__body">
                <span className="about-card__label"><i className="fa-solid fa-store" aria-hidden="true"></i>La boutique en ligne</span>
                <h3>Atouts Tampons, vos tampons COLOP en ligne</h3>
                <p>
                  Atouts Tampons vous donne accès à toute la gamme COLOP : tampons personnalisés, modèles prêts à
                  l'emploi, tampons créatifs, accessoires et gravures. Composez votre tampon en ligne, validez votre
                  aperçu et recevez-le rapidement chez vous.
                </p>
                <ul className="about-list about-list--grid">
                  {siteFeatures.map((feature) => (
                    <li key={feature.text}>
                      <i className={feature.icon} aria-hidden="true"></i>{feature.text}
                    </li>
                  ))}
                </ul>
                <div className="about-actions">
                  <a className="btn btn--arrow" href="#">Créer mon tampon</a>
                  <Link className="btn btn--ghost" to="/a-propos">En savoir plus sur nous</Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
