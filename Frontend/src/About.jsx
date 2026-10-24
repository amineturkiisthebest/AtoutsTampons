import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'

import companyImg from './assets/sections/company.webp'

const address = '167 boulevard de Créteil, 94100 Saint-Maur-des-Fossés'
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=17&output=embed`
const mapLink = 'https://maps.app.goo.gl/8RKmpjJBeLUn3xQH7'
// Street View panorama of the storefront (same viewpoint as mapLink)
const streetViewEmbedUrl =
  'https://www.google.com/maps/embed?pb=!4v1760970000000!6m8!1m7!1scxyQv-xBDkqCkl3MjQAwlg!2m2!1d48.797917!2d2.4974829!3f347.4!4f7.9!5f0.78'

const mapViews = [
  { id: 'plan', label: 'Plan', icon: 'fa-solid fa-map', src: mapEmbedUrl, title: "Plan d'accès Atouts Tampons" },
  { id: 'street', label: 'Street View', icon: 'fa-solid fa-street-view', src: streetViewEmbedUrl, title: 'Vue de la boutique Atouts Tampons dans Street View' },
]

const values = [
  { icon: 'fa-solid fa-pen-ruler', title: 'Sur mesure', text: 'Logo, signature ou formule spécifique : chaque tampon est adapté à vos besoins.' },
  { icon: 'fa-solid fa-boxes-stacked', title: 'Toutes quantités', text: 'Petites ou grandes commandes, pour les particuliers comme pour les entreprises.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Simple et rapide', text: 'Une commande en quelques clics et une livraison rapide partout en France.' },
  { icon: 'fa-solid fa-headset', title: 'Conseil personnalisé', text: 'Notre service client répond à vos questions et vous aide à choisir le bon tampon.' },
]

const contactDetails = [
  { icon: 'fa-solid fa-location-dot', label: 'Adresse', value: '167 boulevard de Créteil\n94100 Saint-Maur-des-Fossés' },
  { icon: 'fa-solid fa-phone', label: 'Téléphone', value: '01 48 85 37 47', href: 'tel:+33148853747' },
  { icon: 'fa-solid fa-fax', label: 'Fax', value: '01 48 85 04 18' },
  { icon: 'fa-solid fa-envelope', label: 'E-mail', value: 'contact@atoutstampons.fr', href: 'mailto:contact@atoutstampons.fr' },
  { icon: 'fa-regular fa-clock', label: 'Horaires', value: 'Du lundi au vendredi\nde 9h00 à 17h00' },
]

const revealSelector = '.about-story, .value-card, .contact-card, .map-card'

function About() {
  const [mapView, setMapView] = useState('plan')
  const activeView = mapViews.find((view) => view.id === mapView)

  const rootRef = useRef(null)
  useReveal(rootRef, revealSelector)

  return (
    <main ref={rootRef}>
      <section className="page-hero">
        <div className="page-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">À propos de nous</span>
          </nav>
          <span className="hero-kicker">À propos de nous</span>
          <p>
            Spécialistes du tampon personnalisé, nous accompagnons particuliers, associations et entreprises de toutes
            tailles avec des produits COLOP fiables et adaptés à chaque besoin.
          </p>
        </div>
      </section>

      <div className="after-universe">
        <section className="about-story">
          <div className="about-story__text">
            <span className="eyebrow">Notre métier</span>
            <h2>Des tampons pensés pour vous</h2>
            <p>
              Atouts Tampons est spécialisé dans la création de tampons personnalisés. Nous adaptons chaque tampon à vos
              besoins : intégration du logo de votre entreprise, signature personnalisée ou formule spécifique.
            </p>
            <p>
              Que vous ayez besoin d'un seul tampon ou d'une commande en grande quantité, nous répondons à toutes les
              demandes, des indépendants aux grandes structures. Notre processus de commande est simple et nos délais de
              livraison rapides.
            </p>
            <p>
              Pour vos outils administratifs, vos projets créatifs ou un usage personnel, Atouts Tampons est un
              partenaire de confiance.
            </p>
          </div>
          <div className="about-story__image">
            <img loading="lazy" decoding="async" src={companyImg} alt="Tampons et accessoires COLOP" />
          </div>
        </section>

        <section className="values" aria-label="Nos engagements">
          {values.map((value) => (
            <article key={value.title} className="value-card">
              <i className={value.icon} aria-hidden="true"></i>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </section>

        <section className="contact" aria-labelledby="contact-title">
          <div className="section-heading">
            <h2 id="contact-title">Nous trouver</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <ul className="contact-list">
                {contactDetails.map((detail) => (
                  <li key={detail.label}>
                    <i className={detail.icon} aria-hidden="true"></i>
                    <span>
                      <strong>{detail.label}</strong>
                      {detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="contact-note">
                Vous souhaitez devenir revendeur ? Écrivez-nous à{' '}
                <a href="mailto:contact@atoutstampons.fr?subject=Demande%20de%20revendeur">contact@atoutstampons.fr</a>{' '}
                avec l'objet « Demande de revendeur ».
              </p>
              <a className="btn btn--small" href="mailto:contact@atoutstampons.fr">
                <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>Nous écrire
              </a>
            </div>

            <div className="map-card">
              <iframe
                key={activeView.id}
                title={activeView.title}
                src={activeView.src}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
              <div className="map-switch" role="group" aria-label="Type de vue">
                {mapViews.map((view) => (
                  <button
                    key={view.id}
                    type="button"
                    className={view.id === mapView ? 'is-active' : undefined}
                    aria-pressed={view.id === mapView}
                    onClick={() => setMapView(view.id)}
                  >
                    <i className={view.icon} aria-hidden="true"></i>{view.label}
                  </button>
                ))}
              </div>
              <a className="map-card__link" href={mapLink} target="_blank" rel="noreferrer">
                <i className="fa-solid fa-diamond-turn-right" aria-hidden="true"></i>Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default About
