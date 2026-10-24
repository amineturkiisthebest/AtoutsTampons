import { useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'
import ProductHero from './components/ProductHero.jsx'
import LandingHero from './components/LandingHero.jsx'

import companyImg from './assets/sections/company.webp'

import productPencilCase from './assets/products/marky-pencil-case-pink.webp'
import productLadotSet from './assets/products/ladot-set-bear-dolphin.webp'
import productTextileStamp from './assets/products/marky-textile-stamp-green.webp'
import productInkPad from './assets/products/make-1-ink-pad-uv.webp'

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

// Two entry points so business and family/creative visitors each find their range straight away
const audiences = [
  {
    className: 'audience-card--pro',
    icon: 'fa-solid fa-briefcase',
    eyebrow: 'Pour les professionnels',
    title: "Cachets d'entreprise, adresses et dateurs",
    text: 'Tampons auto-encreurs, dateurs et numéroteurs personnalisés avec votre texte ou votre logo.',
    to: '/tampons-p',
    cta: 'Créer mon tampon pro',
    links: [
      { label: 'Tampons de texte', to: '/tampons-t' },
      { label: 'Dateurs', to: '/dateurs' },
      { label: "Prêts à l'emploi", to: '/prets-a-l-emploi' },
      { label: 'Gravures', to: '/gravures' },
    ],
  },
  {
    className: 'audience-card--home',
    icon: 'fa-solid fa-palette',
    eyebrow: 'Pour la maison & la création',
    title: 'Marquage, loisirs créatifs et enfants',
    text: 'Marquez les affaires des enfants, décorez cartes et carnets, créez en famille.',
    to: '/tampons-creatifs',
    cta: 'Explorer les tampons créatifs',
    links: [
      { label: 'Marky', to: '/marky' },
      { label: 'Woodies', to: '/woodies' },
      { label: 'LaDot', to: '/ladot' },
      { label: 'NIO', to: '/nio' },
    ],
  },
]

const howSteps = [
  { icon: 'fa-solid fa-hand-pointer', title: 'Choisissez un modèle', text: "Format, forme et couleur d'encre selon votre usage." },
  { icon: 'fa-solid fa-pen-ruler', title: 'Personnalisez en ligne', text: "Ajoutez votre texte ou votre logo et vérifiez l'aperçu de l'empreinte." },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez-le chez vous', text: 'Fabriqué puis expédié sous 2 à 7 jours ouvrables.' },
]

const formatPrice = (price) => `${price.toFixed(2).replace('.', ',')} €`

const products = [
  { img: productPencilCase, name: 'Trousse Marky - rose', price: 11.95, flag: null, flagClass: '' },
  { img: productLadotSet, name: 'Set LaDot S - Ours & Dauphin', price: 19.95, flag: 'LaDot', flagClass: 'flag--purple' },
  { img: productTextileStamp, name: 'Tampon textile Marky - vert', price: 17.95, flag: 'MARKY', flagClass: 'flag--green' },
  { img: productInkPad, name: 'Encreur MAKE 1 - encre UV', price: 6.19, flag: 'Nouveau', flagClass: 'flag--blue' },
]

const revealSelector = '.section-intro, .brand-tile, .product-card, .manufacturing, .about-card, .audience-card, .how-step'

function Home() {
  const { showToast, addToCart } = useOutletContext()
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

  return (
    <main ref={rootRef}>
      <LandingHero />
      <ProductHero />

      <div className="after-universe">
        <section className="audiences" aria-labelledby="audiences-title">
          <div className="about__intro">
            <span className="eyebrow">Que recherchez-vous ?</span>
            <h2 id="audiences-title">Le bon tampon, quel que soit votre projet</h2>
          </div>
          <div className="audience-grid">
            {audiences.map((audience) => (
              <article key={audience.eyebrow} className={`audience-card ${audience.className}`}>
                <span className="audience-card__icon"><i className={audience.icon} aria-hidden="true"></i></span>
                <span className="audience-card__eyebrow">{audience.eyebrow}</span>
                <h3>{audience.title}</h3>
                <p>{audience.text}</p>
                <ul className="audience-card__links">
                  {audience.links.map((link) => (
                    <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                  ))}
                </ul>
                <Link className="btn btn--arrow audience-card__cta" to={audience.to}>{audience.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="how" aria-labelledby="how-title">
          <div className="about__intro">
            <span className="eyebrow">Comment ça marche ?</span>
            <h2 id="how-title">Votre tampon personnalisé en 3 étapes</h2>
          </div>
          <ol className="how-steps">
            {howSteps.map((step, index) => (
              <li key={step.title} className="how-step">
                <span className="how-step__number">{index + 1}</span>
                <i className={step.icon} aria-hidden="true"></i>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="how__action">
            <Link className="btn btn--arrow" to="/tampons-p">Créer mon tampon</Link>
          </div>
        </section>

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
                    <img loading="lazy" decoding="async" src={product.img} alt={product.name} />
                  </div>
                  {product.flag && <span className={`flag ${product.flagClass}`}>{product.flag}</span>}
                  <h3>{product.name}</h3>
                  <p className="price">{formatPrice(product.price)}</p>
                  <p className="meta">TVA incluse · délai de livraison 2 à 7 jours ouvrables</p>
                  <button className="add-to-cart" type="button" onClick={(event) => handleAddToCart(event, product)}>
                    <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>Ajouter au panier
                  </button>
                </article>
              )
            })}
          </div>
          <Link className="products-more" to="/tampons-creatifs">Voir tous les tampons créatifs</Link>
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
                <img loading="lazy" decoding="async" src={companyImg} alt="Produits COLOP" />
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
                  <Link className="btn btn--arrow" to="/tampons-p">Créer mon tampon</Link>
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
