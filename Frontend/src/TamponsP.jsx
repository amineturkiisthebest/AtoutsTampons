import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'
import { navLinks } from './data/navigation.js'

import textStampsImg from './assets/stamps/tampons-de-texte.png'
import datersImg from './assets/stamps/dateurs.png'
import numberersImg from './assets/stamps/numeroteurs.png'

const category = navLinks.find((link) => link.label === 'Tampons personnalisés')

// Presentation details for each option listed in the menu
const optionDetails = {
  'Tampons de texte': {
    img: textStampsImg,
    alt: 'Tampons de texte COLOP Printer, Pocket et Professional',
    text: 'Adresse, cachet, mention ou signature : le tampon encreur personnalisé avec votre texte et votre logo.',
  },
  Dateurs: {
    img: datersImg,
    alt: 'Dateurs COLOP Printer et Professional',
    text: 'Datez vos courriers et documents en un geste, avec une formule personnalisée autour de la date.',
  },
  Numéroteurs: {
    img: numberersImg,
    alt: 'Numéroteurs COLOP Printer et Mini-Folio',
    text: 'Numérotez factures, bons et dossiers automatiquement, avec une numérotation fixe ou incrémentale.',
  },
}

const options = category.children.map((item) => ({ ...item, ...optionDetails[item.label] }))

const steps = [
  { icon: 'fa-solid fa-shapes', title: 'Choisissez le type', text: 'Texte, dateur ou numéroteur selon votre usage.' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Personnalisez', text: 'Saisissez vos lignes, ajoutez un logo et visualisez le rendu.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez-le', text: 'Votre tampon est fabriqué et livré en 2 à 7 jours ouvrables.' },
]

const revealSelector = '.stamp-option, .steps__item, .stamp-help'

function TamponsP() {
  const rootRef = useRef(null)
  useReveal(rootRef, revealSelector)

  return (
    <main ref={rootRef}>
      <section className="page-hero">
        <div className="page-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{category.label}</span>
          </nav>
          <span className="hero-kicker">Fabriqués sur mesure</span>
          <p>
            Tampons de texte, dateurs ou numéroteurs : composez le tampon COLOP adapté à votre activité et
            personnalisez-le en quelques clics.
          </p>
        </div>
      </section>

      <div className="after-universe">
        <section className="stamp-section" aria-labelledby="options-title">
          <div className="section-heading">
            <h2 id="options-title">Choisissez votre type de tampon</h2>
          </div>
          <div className="stamp-options stamp-options--three">
            {options.map((option) => (
              <article key={option.label} className="stamp-option">
                <div className="stamp-option__preview stamp-option__preview--photo">
                  <img src={option.img} alt={option.alt} />
                </div>
                <div className="stamp-option__body">
                  <h3>{option.label}</h3>
                  <p>{option.text}</p>
                  {option.children && (
                    <ul className="stamp-option__uses" aria-label="Formats disponibles">
                      {option.children.map((child) => (
                        <li key={child}>{child}</li>
                      ))}
                    </ul>
                  )}
                  {option.to ? (
                    <Link className="btn btn--small btn--arrow" to={option.to}>Découvrir</Link>
                  ) : (
                    <a className="btn btn--small btn--arrow" href="#">Découvrir</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="steps" aria-label="Comment ça marche">
          {steps.map((step, index) => (
            <div key={step.title} className="steps__item">
              <span className="steps__number">{index + 1}</span>
              <i className={step.icon} aria-hidden="true"></i>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </section>

        <section className="stamp-help">
          <div>
            <h2>Besoin d'un conseil ?</h2>
            <p>Notre équipe vous aide à choisir le tampon le mieux adapté à votre activité.</p>
          </div>
          <Link className="btn btn--ghost btn--arrow" to="/a-propos">Nous contacter</Link>
        </section>
      </div>
    </main>
  )
}

export default TamponsP
