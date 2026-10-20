import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo-atouts-tampons.png'
import { navLinks } from '../data/navigation.js'

// Dropdown entries, rendered recursively so menus can nest to any depth
function NavMenuItems({ items, parentKey, expandedMenus, onToggle, onNavigate }) {
  return items.map((item) => {
    const entry = typeof item === 'string' ? { label: item } : item
    const key = `${parentKey}/${entry.label}`
    const expanded = expandedMenus.has(key)

    return (
      <li key={entry.label} className={`nav-dropdown__item${expanded ? ' is-expanded' : ''}`}>
        {entry.to ? (
          <Link to={entry.to} onClick={onNavigate}>{entry.label}</Link>
        ) : (
          <a href="#" onClick={onNavigate}>{entry.label}</a>
        )}
        {entry.children && (
          <>
            <button
              className="nav-expand"
              type="button"
              aria-label={`Sous-menu ${entry.label}`}
              aria-expanded={expanded}
              onClick={() => onToggle(key)}
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </button>
            <ul className="nav-submenu">
              <NavMenuItems
                items={entry.children}
                parentKey={key}
                expandedMenus={expandedMenus}
                onToggle={onToggle}
                onNavigate={onNavigate}
              />
            </ul>
          </>
        )}
      </li>
    )
  })
}

function Header({ cartTotal, cartLinkRef }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState(() => new Set())
  const [searchOpen, setSearchOpen] = useState(false)

  const searchButtonRef = useRef(null)
  const searchFormRef = useRef(null)
  const searchInputRef = useRef(null)
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

  // Sub-menus are opened by tapping on mobile (hover is used on desktop)
  const toggleMenu = (key) => {
    setExpandedMenus((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const setSearch = (open) => {
    searchToggled.current = true
    setSearchOpen(open)
  }

  return (
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
        <Link className="brand" to="/" aria-label="Atouts Tampons - Accueil">
          <img src={logo} alt="Atouts Tampons" width="600" height="157" />
        </Link>
        <nav className={`main-nav${navOpen ? ' open' : ''}`} aria-label="Navigation principale">
          {navLinks.map((link, index) => (
            <div
              key={link.label}
              className={`nav-item${index >= navLinks.length - 3 ? ' nav-item--end' : ''}${expandedMenus.has(link.label) ? ' is-expanded' : ''}`}
            >
              {link.to ? (
                <NavLink to={link.to} end onClick={() => setNavOpen(false)}>
                  {link.label}
                </NavLink>
              ) : (
                <a href="#" onClick={() => setNavOpen(false)}>
                  {link.label}
                </a>
              )}
              {link.children && (
                <>
                  <button
                    className="nav-expand"
                    type="button"
                    aria-label={`Sous-menu ${link.label}`}
                    aria-expanded={expandedMenus.has(link.label)}
                    onClick={() => toggleMenu(link.label)}
                  >
                    <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                  </button>
                  <ul className="nav-dropdown">
                    <NavMenuItems
                      items={link.children}
                      parentKey={link.label}
                      expandedMenus={expandedMenus}
                      onToggle={toggleMenu}
                      onNavigate={() => setNavOpen(false)}
                    />
                  </ul>
                </>
              )}
            </div>
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
  )
}

export default Header
