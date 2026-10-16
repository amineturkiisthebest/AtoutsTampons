import { useEffect, useRef, useState } from 'react'
import './css/style.css'

import logo from './assets/logo-atouts-tampons.png'
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

import newsCreativeworld from './assets/news/creativeworld-2025.jpg'
import newsStampCleaner from './assets/news/stamp-cleaner.jpg'
import newsMake2 from './assets/news/make-2-stamp-pad.jpg'
import newsLadot from './assets/news/new-ladot-sets.jpg'
import newsBackToSchool from './assets/news/back-to-school-2024.png'

import productPencilCase from './assets/products/marky-pencil-case-pink.jpg'
import productLadotSet from './assets/products/ladot-set-bear-dolphin.jpg'
import productTextileStamp from './assets/products/marky-textile-stamp-green.jpg'
import productInkPad from './assets/products/make-1-ink-pad-uv.jpg'

const navLinks = [
  { label: 'Tampons personalisés' },
  { label: "Prèts à l'emploi" },
  { label: 'Tampons créatifs' },
  { label: 'Tampons Speciaux' },
  { label: 'Accessoires', active: true },
  { label: 'Gravures' },
  { label: 'Impression mobile' },
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

const news = [
  { img: newsCreativeworld, tag: '2025', title: 'COLOP à Creativeworld 2025', text: 'Retour sur notre présence au salon Creativeworld 2025 et les moments forts de cette édition.' },
  { img: newsStampCleaner, tag: 'Nouveau', title: 'Nouveau nettoyant pour tampons COLOP', text: 'Un nettoyage efficace et doux pour prolonger la durée de vie de vos tampons.' },
  { img: newsMake2, tag: 'MAKE', title: 'Nouvel encreur MAKE 2', text: 'Encore plus de couleurs intenses pour toutes vos créations.' },
  { img: newsLadot, tag: 'LaDot', title: 'Nouveaux sets LaDot', text: 'Des motifs uniques et funs pour petits et grands.' },
  { img: newsBackToSchool, tag: 'École', title: 'Rentrée scolaire 2024', text: 'Préparez la rentrée avec nos tampons pratiques et personnalisables.' },
]

const products = [
  { img: productPencilCase, name: 'Trousse Marky - rose', reviews: 124, price: 11.95, flag: null, flagClass: '' },
  { img: productLadotSet, name: 'Set LaDot S - Ours & Dauphin', reviews: 98, price: 19.95, flag: 'LaDot', flagClass: 'flag--purple' },
  { img: productTextileStamp, name: 'Tampon textile Marky - vert', reviews: 76, price: 17.95, flag: 'MARKY', flagClass: 'flag--green' },
  { img: productInkPad, name: 'Encreur MAKE 1 - encre UV', reviews: 54, price: 6.19, flag: 'Nouveau', flagClass: 'flag--blue' },
]

const footerColumns = {
  'Tampons traditionnels': ['Trouver un revendeur', 'Espace partenaire', 'Systèmes & matériaux', 'Actualités'],
  'Impression mobile': ['Trouver un revendeur', 'Espace partenaire', 'Support', 'Blog'],
  'Arts & Crafts': ['Espace partenaire', 'Projets'],
  Infos: ['Mentions légales', 'Politique de confidentialité', 'Conditions générales', 'Contactez-nous'],
}

const revealSelector = '.section-intro, .brand-tile, .partnership, .news article, .product-card, .manufacturing'

function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filtersHidden, setFiltersHidden] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [wishlist, setWishlist] = useState(() => new Set())
  const [cartTotal, setCartTotal] = useState(0)
  const [toast, setToast] = useState({ message: '', visible: false })

  const rootRef = useRef(null)
  const searchButtonRef = useRef(null)
  const searchFormRef = useRef(null)
  const searchInputRef = useRef(null)
  const cartLinkRef = useRef(null)
  const toastTimer = useRef(null)
  const searchToggled = useRef(false)

  // Header background once the page is scrolled
  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 8)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  // Header search bar: move focus and close on outside click
  useEffect(() => {
    if (searchToggled.current) {
      if (searchOpen) searchInputRef.current?.focus()
      else searchButtonRef.current?.focus()
    }
    if (!searchOpen) return

    const handleClick = (event) => {
      if (!searchFormRef.current.contains(event.target) && !searchButtonRef.current.contains(event.target)) {
        searchToggled.current = false
        setSearchOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [searchOpen])

  const setSearch = (open) => {
    searchToggled.current = true
    setSearchOpen(open)
  }

  // Fade sections in as they scroll into view
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const targets = rootRef.current.querySelectorAll(revealSelector)
    // Drop the reveal classes afterwards so hover transforms work again
    const handleTransitionEnd = (event) => event.currentTarget.classList.remove('reveal', 'is-visible')

    targets.forEach((element) => {
      element.classList.add('reveal')
      element.addEventListener('transitionend', handleTransitionEnd, { once: true })
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      targets.forEach((element) => {
        element.removeEventListener('transitionend', handleTransitionEnd)
        element.classList.remove('reveal', 'is-visible')
      })
    }
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const showToast = (message) => {
    setToast({ message, visible: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, visible: false })), 2200)
  }

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

  const addToCart = (event, product) => {
    event.stopPropagation()
    setCartTotal((total) => total + 1)

    const cartLink = cartLinkRef.current
    if (cartLink) {
      cartLink.classList.remove('bump')
      void cartLink.offsetWidth // restart the animation
      cartLink.classList.add('bump')
    }

    showToast(`« ${product.name} » ajouté au panier`)
  }

  const selectCategory = (event, index) => {
    event.preventDefault()
    setActiveCategory((current) => (current === index ? null : index))
  }

  return (
    <div ref={rootRef}>
      <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="header-grid">
          <button
            className="nav-toggle"
            type="button"
            aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span></span><span></span><span></span>
          </button>
          <a className="brand" href="#" aria-label="Atouts Tampons - Accueil">
            <img src={logo} alt="Atouts Tampons" width="600" height="157" />
          </a>
          <nav className={`main-nav${navOpen ? ' open' : ''}`} aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a key={link.label} className={link.active ? 'active' : undefined} href="#" onClick={() => setNavOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              ref={searchButtonRef}
              className="search-button"
              type="button"
              aria-label="Rechercher"
              aria-controls="header-search"
              aria-expanded={searchOpen}
              onClick={() => setSearch(true)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <a ref={cartLinkRef} className="cart-link" href="#" aria-label="Mon panier" title="Mon panier">
              <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
              <span className="cart-count" hidden={cartTotal === 0}>{cartTotal}</span>
            </a>
            <a className="signin-link" href="#" aria-label="Se connecter">
              <i className="fa-regular fa-user" aria-hidden="true"></i><span>Se connecter</span>
            </a>
          </div>
          <form
            ref={searchFormRef}
            className="header-search"
            id="header-search"
            role="search"
            action=""
            method="get"
            hidden={!searchOpen}
            onKeyDown={(event) => event.key === 'Escape' && setSearch(false)}
          >
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input
              ref={searchInputRef}
              type="search"
              name="q"
              placeholder="Rechercher un tampon, un encreur, une marque…"
              aria-label="Rechercher sur le site"
              autoComplete="off"
            />
            <button className="header-search__close" type="button" aria-label="Fermer la recherche" onClick={() => setSearch(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </form>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__inner">
            <div className="hero-copy">
              <span className="hero-kicker">Produits créatifs authentiques</span>
              <h1>ARTS &amp; CRAFTS</h1>
              <p>Découvrez une sélection unique de tampons, encreurs et accessoires créatifs, fabriqués avec passion et savoir-faire.</p>
              <div className="hero-actions">
                <a className="btn btn--arrow" href="#collection">Notre collection</a>
                <a className="btn btn--ghost btn--arrow" href="#">Nous trouver</a>
              </div>
            </div>
            <div className="hero-art">
              <video className="hero-video" autoPlay muted loop playsInline aria-label="Vidéo des produits COLOP Arts & Crafts">
                <source src={heroVideo} type="video/webm" />
              </video>
            </div>
          </div>
        </section>

        <div className={`layout${filtersHidden ? ' filters-hidden' : ''}`} id="collection">
          <aside className="filters" aria-label="Catégories de la boutique">
            <button
              className="filter-toggle"
              type="button"
              aria-label={filtersHidden ? 'Afficher les filtres' : 'Masquer les filtres'}
              aria-expanded={!filtersHidden}
              onClick={() => setFiltersHidden((hidden) => !hidden)}
            ></button>
            <div className="filters-panel">
              <div className="filter-brand">
                <strong>Crafty Labeler</strong>
                <span>Arts &amp; Crafts</span>
              </div>
              <h2>Filtrer par</h2>
              <h3><i className="fa-solid fa-sliders" aria-hidden="true"></i>Options d'achat</h3>
              <h4>Catégorie</h4>
              <ul>
                {categories.map((category, index) => (
                  <li
                    key={category.name}
                    className={activeCategory === index ? 'is-active' : undefined}
                    onClick={(event) => selectCategory(event, index)}
                  >
                    <i className={`option-icon ${category.icon}`} aria-hidden="true"></i>
                    <a href="#">{category.name}</a>
                    <span>{category.count}</span>
                  </li>
                ))}
              </ul>
              <a className="btn view-all" href="#"><i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>Voir tous les produits</a>
            </div>
          </aside>

          <div className="content">
            <section className="section-intro">
              <h2>Découvrez notre univers <span>Arts &amp; Crafts</span></h2>
              <p>
                Nous proposons une large gamme de tampons et d'encreurs pour de nombreuses occasions et utilisations :
                des tampons en bois soigneusement fabriqués, des tampons ingénieux pour le lavage des mains, des tampons
                auto-encreurs de styles variés et des tampons de tatouages temporaires primés.
              </p>
            </section>

            <section className="brand-grid" aria-label="Marques Arts & Crafts">
              {brands.map((brand) => (
                <a key={brand.className} className={`brand-tile ${brand.className}`} href="#">
                  <img src={brand.img} alt="" />
                  <strong>{brand.name}</strong>
                  <span>{brand.text}</span>
                  <em>Explorer</em>
                </a>
              ))}
            </section>
          </div>
        </div>

        <div className="after-universe">
          <section className="partnership">
            <div>
              <span className="eyebrow">Notre engagement</span>
              <h2>Un partenariat solide pour des tampons créatifs</h2>
              <p>
                COLOP Arts &amp; Crafts est l'alliance d'une équipe créative forte de plus de 20 ans d'expérience dans le
                développement et la production de tampons créatifs, avec le fabricant autrichien COLOP. Nous misons sur
                une fabrication 100% européenne, une qualité premium et une image de marque moderne et professionnelle.
              </p>
              <a className="btn btn--small" href="#"><i className="fa-solid fa-file-arrow-down" aria-hidden="true"></i>Télécharger le catalogue</a>
            </div>
            <img src={companyImg} alt="Produits créatifs COLOP Arts & Crafts" />
          </section>

          <section className="news">
            <div className="section-heading">
              <h2>Actualités</h2>
              <a href="#">Voir toutes les actualités</a>
            </div>
            <div className="news-grid">
              {news.map((item, index) => (
                <article key={item.title} className={index === 0 ? 'featured-news' : ''}>
                  <img src={item.img} alt="" />
                  <span className="tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a href="#">Lire plus</a>
                </article>
              ))}
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
                      <img src={product.img} alt={product.name} />
                    </div>
                    {product.flag && <span className={`flag ${product.flagClass}`}>{product.flag}</span>}
                    <h3>{product.name}</h3>
                    <div className="rating" aria-label="Note 5 sur 5">
                      <span>★★★★★</span><small>({product.reviews})</small>
                    </div>
                    <p className="price">€{product.price.toFixed(2)}</p>
                    <p className="meta">TVA incluse · délai de livraison 2 à 7 jours ouvrables</p>
                    <button className="add-to-cart" type="button" onClick={(event) => addToCart(event, product)}>
                      <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>Ajouter au panier
                    </button>
                  </article>
                )
              })}
            </div>
            <a className="products-more" href="#">Voir tous les produits</a>
          </section>

          <section className="manufacturing">
            <div className="manufacturing__image">
              <img src={productionImg} alt="Fabrication de tampons COLOP" />
            </div>
            <div>
              <h2>Fabrication de tampons</h2>
              <p>
                En tant que l'un des plus grands fabricants européens de produits de tampons créatifs, nous participons
                depuis plus de 20 ans au développement, au marketing et à la production de tampons à motifs, de tampons
                de loisirs créatifs et de tampons pour enfants.
              </p>
              <p>
                Les tampons sont des ambassadeurs communicatifs, créatifs et faciles à utiliser pour votre marque.
                Tampons en bois classiques, tampons pour enfants, tampons de loisirs créatifs, encreurs ou displays
                complets : nous réalisons vos idées rapidement et professionnellement.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          {Object.entries(footerColumns).map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              {links.map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="copyright">&copy; {new Date().getFullYear()} by COLOP Stempelerzeugung Skopek Gesellschaft m.b.H. &amp; Co. KG.</div>
          <div className="social-row">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="Pinterest"><i className="fa-brands fa-pinterest-p"></i></a>
            <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </footer>

      <div className={`toast${toast.visible ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast.message}</div>
    </div>
  )
}

export default Home
