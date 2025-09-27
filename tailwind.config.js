/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Tesla/Rolex-inspired color palette
        premium: {
          black: '#0a0a0a',
          charcoal: '#1a1a1a',
          silver: '#c0c0c0',
          gold: '#d4af37',
          platinum: '#e5e4e2',
        },
        magical: {
          deep: '#1e1b4b',
          mystic: '#312e81',
          ethereal: '#4c1d95',
          shimmer: '#7c3aed',
          glow: '#a855f7',
        }
      },
      fontFamily: {
        'premium': ['Inter', 'system-ui', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
        'script': ['Dancing Script', 'Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'magical-glow': 'magicalGlow 2s ease-in-out infinite alternate',
        'handwriting': 'handwriting 2s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        magicalGlow: {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        handwriting: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-20px) scale(0.8)',
            filter: 'blur(2px)'
          },
          '20%': { 
            opacity: '0.3', 
            transform: 'translateX(-10px) scale(0.9)',
            filter: 'blur(1px)'
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0px)',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
          },
        }
      }
    },
  },
  plugins: [],
}