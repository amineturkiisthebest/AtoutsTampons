import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'
import { navLinks } from './data/navigation.js'

const parentMenu = navLinks.find((link) => link.label === 'Tampons personnalisés')
const category = parentMenu.children.find((item) => item.label === 'Tampons de texte')

// Presentation details for each option listed in the menu
const optionDetails = {
  Rectangulaires: {
    shape: 'rect',
    text: "Le format classique pour l'adresse, les coordonnées ou le cachet de votre entreprise.",
    uses: ['Adresse', 'Cachet entreprise', 'Coordonnées'],
    sample: ['ATOUTS TAMPONS', '167 bd de Créteil', '94100 Saint-Maur'],
  },
  Longs: {
    shape: 'long',
    text: 'Une grande longueur de ligne pour les mentions détaillées et les textes sur plusieurs colonnes.',
    uses: ['Mentions légales', 'SIRET / TVA', 'Références'],
    sample: ['ATOUTS TAMPONS · 01 48 85 37 47', 'contact@atoutstampons.fr'],
  },
  Carrés: {
    shape: 'square',
    text: 'Un format compact et équilibré, idéal pour un logo accompagné de quelques lignes de texte.',
    uses: ['Logo', 'Visa', 'Contrôle qualité'],
    sample: ['VU ET', 'APPROUVÉ'],
  },
  'Ronds et ovales': {
    shape: 'round',
    text: 'Des formes élégantes pour les cachets officiels, associations, signatures et étiquettes.',
    uses: ['Cachet officiel', 'Association', 'Signature'],
    sample: ['ATOUTS', 'TAMPONS'],
  },
}

const options = category.children.map((label) => ({ label, ...optionDetails[label] }))

const steps = [
  { icon: 'fa-solid fa-shapes', title: 'Choisissez la forme', text: 'Sélectionnez le format adapté à votre texte.' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Personnalisez', text: 'Saisissez vos lignes, ajoutez un logo et visualisez le rendu.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez-le', text: 'Votre tampon est fabriqué et livré en 2 à 7 jours ouvrables.' },
]

const revealSelector = '.stamp-option, .steps__item, .stamp-help'

function TamponsT() {
  const rootRef = useRef(null)
  useReveal(rootRef, revealSelector)

  return (
    <main ref={rootRef}>
      <section className="page-hero">
        <div className="page-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link to={parentMenu.to}>{parentMenu.label}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{category.label}</span>
          </nav>
          <span className="hero-kicker">{parentMenu.label}</span>
          <p>
            Adresse, cachet, mention ou signature : choisissez la forme de votre tampon de texte puis personnalisez-le
            en quelques clics.
          </p>
        </div>
      </section>

      <div className="after-universe">
        <section className="stamp-section" aria-labelledby="options-title">
          <div className="section-heading">
            <h2 id="options-title">Choisissez votre forme</h2>
          </div>
          <div className="stamp-options">
            {options.map((option) => (
              <article key={option.label} className="stamp-option">
                <div className="stamp-option__preview">
                  <div className={`stamp-imprint stamp-imprint--${option.shape}`} aria-hidden="true">
                    {option.sample.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                </div>
                <div className="stamp-option__body">
                  <h3>{option.label}</h3>
                  <p>{option.text}</p>
                  <ul className="stamp-option__uses" aria-label="Idéal pour">
                    {option.uses.map((use) => (
                      <li key={use}>{use}</li>
                    ))}
                  </ul>
                  <a className="btn btn--small btn--arrow" href="#">Voir les modèles</a>
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
            <p>Notre équipe vous aide à choisir la forme et la taille idéales pour votre tampon.</p>
          </div>
          <Link className="btn btn--ghost btn--arrow" to="/a-propos">Nous contacter</Link>
        </section>
      </div>
    </main>
  )
}

export default TamponsT
