import { useEffect } from 'react'

/**
 * useScrollReveal
 * Observes all elements with .reveal, .reveal-left, .reveal-right, .reveal-scale
 * and adds .visible class when they enter the viewport.
 *
 * Usage: Call this hook once in a layout component or each page.
 * Elements just need the CSS class — no extra JS needed per element.
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-up'
    const elements  = document.querySelectorAll(selectors)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        threshold:  0.12,
        rootMargin: '0px 0px -50px 0px', // trigger slightly before fully in view
      }
    )

    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, deps)
}

/**
 * useHeroReveal
 * Hero elements reveal immediately on page load (no scroll needed).
 * Call this in hero/splash sections only.
 */
export function useHeroReveal() {
  useEffect(() => {
    const heroElements = document.querySelectorAll('.hero .reveal, .hero-reveal')
    const timers = []

    heroElements.forEach((el, i) => {
      const timer = setTimeout(() => {
        el.classList.add('visible')
      }, 100 + i * 120) // stagger: 100ms, 220ms, 340ms...
      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [])
}