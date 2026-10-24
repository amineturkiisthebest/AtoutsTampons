import { useRef } from 'react'
import { Link } from 'react-router-dom'

// Full-screen welcome section at the top of the home page, sitting under the transparent header
function LandingHero() {
  const sectionRef = useRef(null)

  const scrollToNext = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="landing">
      <div className="landing__inner">
        <span className="landing__kicker">Tampons personnalisés</span>
        <h1 className="landing__title">
          Chaque idée mérite son <span className="landing__underline">empreinte.</span>
        </h1>
        <p className="landing__text">
          Tampons professionnels, dateurs et créations pour toute la famille : personnalisés en ligne, livrés chez vous.
        </p>
        <div className="landing__actions">
          <Link className="landing__cta" to="/tampons-p">
            Créer mon tampon <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </Link>
          <Link className="landing__secondary" to="/prets-a-l-emploi">Voir les modèles prêts à l'emploi</Link>
        </div>
      </div>
      <button className="landing__scroll" type="button" onClick={scrollToNext}>
        Découvrez notre univers
        <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
      </button>
    </section>
  )
}

export default LandingHero
