import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useReveal from './hooks/useReveal.js'
import { navLinks } from './data/navigation.js'

const parentMenu = navLinks.find((link) => link.label === 'Tampons personnalisés')
const category = parentMenu.children.find((item) => item.label === 'Dateurs')

// Presentation details for each option listed in the menu.
// Imprint lines are text, or { date } for the date band printed by the stamp.
const optionDetails = {
  Rectangulaires: {
    shape: 'rect',
    text: 'Le dateur polyvalent : une date au centre, entourée de votre formule et de vos coordonnées.',
    uses: ['Payé le', 'Reçu le', 'Courrier'],
    sample: ['PAYÉ LE', { date: '20 OCT 2026' }, 'ATOUTS TAMPONS'],
  },
  Carrés: {
    shape: 'square',
    text: 'Un format compact qui laisse de la place pour une mention et un visa autour de la date.',
    uses: ['Visa', 'Contrôle', 'Validation'],
    sample: ['REÇU', { date: '20 OCT 2026' }, 'Visa :'],
  },
  'Ronds et ovales': {
    shape: 'round',
    text: 'Une forme élégante pour dater vos documents officiels, factures et courriers entrants.',
    uses: ['Arrivée courrier', 'Facturation', 'Officiel'],
    sample: ['ARRIVÉ', { date: '20 OCT 2026' }],
  },
  'Grandes tailles': {
    shape: 'large',
    text: 'Plus de lignes de texte autour de la date pour vos services, adresses et mentions détaillées.',
    uses: ['Comptabilité', 'Coordonnées', 'Service'],
    sample: ['ATOUTS TAMPONS', '167 bd de Créteil', { date: '20 OCT 2026' }, 'SERVICE COMPTABILITÉ'],
  },
  'Doubles dateurs': {
    shape: 'double',
    text: 'Deux dates réglables indépendamment pour suivre la réception puis le traitement de vos documents.',
    uses: ['Réception', 'Traitement', 'Suivi'],
    sample: ['REÇU LE', { date: '20 OCT 2026' }, 'TRAITÉ LE', { date: '27 OCT 2026' }],
  },
}

const options = category.children.map((label) => ({ label, ...optionDetails[label] }))

const steps = [
  { icon: 'fa-solid fa-shapes', title: 'Choisissez la forme', text: 'Sélectionnez le format de dateur adapté à votre usage.' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Personnalisez', text: 'Ajoutez votre formule, vos coordonnées ou votre logo autour de la date.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez-le', text: 'Votre dateur est fabriqué et livré en 2 à 7 jours ouvrables.' },
]

const revealSelector = '.stamp-option, .steps__item, .stamp-help'

function Dateurs() {
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
            Datez vos courriers, factures et documents avec un dateur COLOP personnalisé : choisissez sa forme, puis
            ajoutez votre formule autour de la date.
          </p>
        </div>
      </section>

      <div className="after-universe">
        <section className="stamp-section" aria-labelledby="options-title">
          <div className="section-heading">
            <h2 id="options-title">Choisissez votre dateur</h2>
          </div>
          <div className="stamp-options stamp-options--three">
            {options.map((option) => (
              <article key={option.label} className="stamp-option">
                <div className="stamp-option__preview">
                  <div className={`stamp-imprint stamp-imprint--${option.shape}`} aria-hidden="true">
                    {option.sample.map((line, index) =>
                      typeof line === 'string' ? (
                        <span key={index}>{line}</span>
                      ) : (
                        <span key={index} className="stamp-imprint__date">{line.date}</span>
                      )
                    )}
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
            <p>Notre équipe vous aide à choisir le dateur le mieux adapté à vos documents.</p>
          </div>
          <Link className="btn btn--ghost btn--arrow" to="/a-propos">Nous contacter</Link>
        </section>
      </div>
    </main>
  )
}

export default Dateurs
