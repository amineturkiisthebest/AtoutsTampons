import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import '../css/style.css'

// Shared page frame: header, footer, cart counter and toast notifications
function Layout() {
  const [cartTotal, setCartTotal] = useState(0)
  const [toast, setToast] = useState({ message: '', visible: false })
  const cartLinkRef = useRef(null)
  const toastTimer = useRef(null)
  const { pathname } = useLocation()

  // Start each page at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const showToast = (message) => {
    setToast({ message, visible: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, visible: false })), 2200)
  }

  const addToCart = (productName) => {
    setCartTotal((total) => total + 1)

    const cartLink = cartLinkRef.current
    if (cartLink) {
      cartLink.classList.remove('bump')
      void cartLink.offsetWidth // restart the animation
      cartLink.classList.add('bump')
    }

    showToast(`« ${productName} » ajouté au panier`)
  }

  return (
    <>
      <Header cartTotal={cartTotal} cartLinkRef={cartLinkRef} />
      <Outlet context={{ showToast, addToCart }} />
      <Footer />
      <div className={`toast${toast.visible ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast.message}</div>
    </>
  )
}

export default Layout
