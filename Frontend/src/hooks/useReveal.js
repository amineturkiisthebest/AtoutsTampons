import { useEffect } from 'react'

// Fade elements matching `selector` inside `rootRef` in as they scroll into view
function useReveal(rootRef, selector) {
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

    const targets = rootRef.current.querySelectorAll(selector)
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
  }, [rootRef, selector])
}

export default useReveal
