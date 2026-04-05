import { useState, useEffect } from 'react'

// ── useTheme ─────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ss-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ss-theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light'), isDark: theme === 'dark' }
}

// ── useScrollReveal ───────────────────────────────────────────────────
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, deps)
}

// ── useHeroReveal (hero items reveal on load, not scroll) ─────────────
export function useHeroReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.hero-reveal')
    const timers = []
    els.forEach((el, i) => { timers.push(setTimeout(() => el.classList.add('visible'), 100 + i * 120)) })
    return () => timers.forEach(clearTimeout)
  }, [])
}