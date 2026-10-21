import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { navLinks } from '../data/navigation.js'

const defaultSteps = [
  { icon: 'fa-solid fa-hand-pointer', title: 'Choisissez', text: 'Parcourez la gamme et sélectionnez les produits adaptés.' },
  { icon: 'fa-solid fa-cart-shopping', title: 'Commandez', text: 'Ajoutez-les à votre panier et validez en quelques clics.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez', text: 'Votre commande est livrée en 2 à 7 jours ouvrables.' },
]

const revealSelector = '.stamp-option, .steps__item, .stamp-help'

/**
 * Page for a menu entry: a top-level menu (e.g. Tampons créatifs) when `category` is omitted,
 * or one entry of it (e.g. Tampons créatifs › Woodies).
 * The cards come from that entry's sub-menu; `options` maps each label to { icon, text, uses } or { img, alt, text, uses }.
 * When `uses` is omitted, the option's own sub-menu entries are shown as tags instead.
 * `image` and `accent` are optional: a hero photo and a brand colour for icons and tags.
 */
function CategoryPage({
  parent,
  category: categoryLabel,
  intro,
  options,
  image,
  imageAlt = '',
  accent,
  steps = defaultSteps,
  helpText,
  kicker,
  sectionTitle,
}) {
  const rootRef = useRef(null)
  useReveal(rootRef, revealSelector)

  const parentMenu = navLinks.find((link) => link.label === parent)
  const category = categoryLabel
    ? parentMenu.children.find((item) => typeof item === 'object' && item.label === categoryLabel)
    : parentMenu
  const items = category.children.map((child) => {
    const entry = typeof child === 'string' ? { label: child } : child
    const subOptions = entry.children?.map((sub) => (typeof sub === 'string' ? sub : sub.label))
    return { ...entry, ...options[entry.label], tags: options[entry.label]?.uses ?? subOptions ?? [] }
  })

  const columns = items.length === 2 || items.length === 4 ? 'stamp-options--two' : 'stamp-options--three'

  return (
    <main ref={rootRef} className={accent ? 'brand-page' : undefined} style={accent ? { '--brand': accent } : undefined}>
      <section className="page-hero">
        <div className={`page-hero__inner${image ? ' page-hero__inner--split' : ''}`}>
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link to="/">Accueil</Link>
              <span aria-hidden="true">/</span>
              {category !== parentMenu && (
                <>
                  {parentMenu.to ? <Link to={parentMenu.to}>{parentMenu.label}</Link> : <span>{parentMenu.label}</span>}
                  <span aria-hidden="true">/</span>
                </>
              )}
              <span aria-current="page">{category.label}</span>
            </nav>
            <span className="hero-kicker">{kicker ?? parentMenu.label}</span>
            <p>{intro}</p>
          </div>
          {image && (
            <div className="page-hero__art">
              <img src={image} alt={imageAlt} />
            </div>
          )}
        </div>
      </section>

      <div className="after-universe">
        <section className="stamp-section" aria-labelledby="options-title">
          <div className="section-heading">
            <h2 id="options-title">{sectionTitle ?? `La gamme ${category.label}`}</h2>
          </div>
          <div className={`stamp-options ${columns}`}>
            {items.map((item) => (
              <article key={item.label} className="stamp-option">
                {item.img ? (
                  <div className="stamp-option__preview stamp-option__preview--photo">
                    <img src={item.img} alt={item.alt ?? item.label} />
                  </div>
                ) : (
                  <div className="stamp-option__preview stamp-option__preview--icon">
                    <span className="brand-icon" aria-hidden="true">
                      <i className={item.icon}></i>
                    </span>
                  </div>
                )}
                <div className="stamp-option__body">
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                  {item.tags.length > 0 && (
                    <ul className="stamp-option__uses" aria-label={item.uses ? 'Idéal pour' : 'Modèles disponibles'}>
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                  {item.to ? (
                    <Link className="btn btn--small btn--arrow" to={item.to}>Voir les produits</Link>
                  ) : (
                    <a className="btn btn--small btn--arrow" href="#">Voir les produits</a>
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
            <p>{helpText ?? `Notre équipe vous aide à choisir les produits ${category.label} adaptés à vos besoins.`}</p>
          </div>
          <Link className="btn btn--ghost btn--arrow" to="/a-propos">Nous contacter</Link>
        </section>
      </div>
    </main>
  )
}

export default CategoryPage
