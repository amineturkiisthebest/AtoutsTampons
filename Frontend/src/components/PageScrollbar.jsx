import { useEffect, useRef } from 'react'

const MIN_THUMB = 40

// Thin scrollbar drawn over the page, so the content shows through behind it (the native one is hidden in CSS).
// The thumb is moved directly on the DOM, once per frame, so scrolling never re-renders React.
function PageScrollbar() {
  const barRef = useRef(null)
  const thumbRef = useRef(null)
  const thumbHeight = useRef(0)
  const drag = useRef(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const view = window.innerHeight
      const total = document.documentElement.scrollHeight
      const hidden = total <= view
      barRef.current.hidden = hidden
      if (hidden) return
      const height = Math.max(MIN_THUMB, (view * view) / total)
      const top = (window.scrollY / (total - view)) * (view - height)
      thumbHeight.current = height
      thumbRef.current.style.height = `${height}px`
      thumbRef.current.style.transform = `translateY(${top}px)`
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Page height changes when routes or images load
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [])

  const startDrag = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { y: event.clientY, scroll: window.scrollY }
  }

  const moveDrag = (event) => {
    if (!drag.current) return
    const view = window.innerHeight
    const total = document.documentElement.scrollHeight
    const ratio = (total - view) / (view - thumbHeight.current)
    window.scrollTo({ top: drag.current.scroll + (event.clientY - drag.current.y) * ratio, behavior: 'instant' })
  }

  const endDrag = () => {
    drag.current = null
  }

  return (
    <div ref={barRef} className="page-scrollbar" aria-hidden="true" hidden>
      <div
        ref={thumbRef}
        className="page-scrollbar__thumb"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      ></div>
    </div>
  )
}

export default PageScrollbar
