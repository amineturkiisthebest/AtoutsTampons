import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import PageScrollbar from './PageScrollbar.jsx'
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

  // Stable callbacks and context: toast and cart updates don't re-render the current page
  const showToast = useCallback((message) => {
    setToast({ message, visible: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, visible: false })), 2200)
  }, [])

  const addToCart = useCallback((productName) => {
    setCartTotal((total) => total + 1)

    const cartLink = cartLinkRef.current
    if (cartLink) {
      cartLink.classList.remove('bump')
      void cartLink.offsetWidth // restart the animation
      cartLink.classList.add('bump')
    }

    showToast(`« ${productName} » ajouté au panier`)
  }, [showToast])

  const outletContext = useMemo(() => ({ showToast, addToCart }), [showToast, addToCart])

  return (
    <>
      <Header cartTotal={cartTotal} cartLinkRef={cartLinkRef} />
      <Suspense fallback={<div className="page-loading" aria-busy="true"></div>}>
        <Outlet context={outletContext} />
      </Suspense>
      <Footer />
      <PageScrollbar />
      <div className={`toast${toast.visible ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast.message}</div>
    </>
  )
}

export default Layout
