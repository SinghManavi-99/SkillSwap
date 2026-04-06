import { useState, useEffect } from 'react'

// ── useTheme ─────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ss-theme')
    if (saved) return saved

    // ✅ safe check
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ss-theme', theme)
  }, [theme])

  return {
    theme,
    toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')),
    isDark: theme === 'dark'
  }
}

// ── useScrollReveal ───────────────────────────────────
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    )

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // ✅ optimization
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, deps)
}

// ── useHeroReveal ─────────────────────────────────────
export function useHeroReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.hero-reveal')
    if (!elements.length) return

    const timers = []

    elements.forEach((el, i) => {
      const t = setTimeout(() => {
        el.classList.add('visible')
      }, 100 + i * 120)

      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [])
}