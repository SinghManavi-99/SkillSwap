import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <div className="flex items-center gap-2">
      {/* Sun icon */}
      <span
        className="text-base transition-opacity"
        style={{ opacity: isDark ? 0.4 : 1 }}
        title="Light mode"
      >
        ☀️
      </span>

      {/* Toggle pill */}
      <button
        onClick={toggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        style={{
          background: isDark ? '#7C3AED' : '#D1D5DB',
        }}
        aria-label="Toggle theme"
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
          style={{ transform: isDark ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>

      {/* Moon icon */}
      <span
        className="text-base transition-opacity"
        style={{ opacity: isDark ? 1 : 0.4 }}
        title="Dark mode"
      >
        🌙
      </span>
    </div>
  )
}