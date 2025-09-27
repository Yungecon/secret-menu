/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined premium palette inspired by luxury brands
        premium: {
          black: '#0f0f0f',         // Warmer black
          dark: '#1c1c1c',          // Rich dark
          charcoal: '#2a2a2a',      // Sophisticated charcoal  
          silver: '#a8a8a8',        // Muted silver
          gold: '#d4a574',          // Warm gold (less yellow)
          platinum: '#e8e6e0',      // Warm platinum
        },
        studio: {
          // Sophisticated neutrals inspired by high-end design studios
          obsidian: '#0f0f0f',      // Deep black with warmth
          charcoal: '#1c1c1c',      // Rich charcoal
          graphite: '#2a2a2a',      // Warm graphite
          slate: '#404040',         // Medium gray
          stone: '#6b6b6b',         // Light gray
          pearl: '#f8f8f8',         // Warm white
          // Refined accent colors
          amber: '#d4a574',         // Warm amber (like aged whiskey)
          copper: '#b87333',        // Rich copper
          brass: '#cd7f32',         // Antique brass
          cream: '#f5f2e8',         // Warm cream
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
        'handwriting': 'handwriting 2.5s ease-in-out forwards',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'float-medium': 'floatMedium 3s ease-in-out infinite',
        'float-fast': 'floatFast 2s ease-in-out infinite',
        'shimmer': 'shimmer 4s ease-in-out infinite',
        'button-press': 'buttonPress 0.15s ease-out',
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
            transform: 'translateX(-30px) scale(0.7) rotate(-2deg)',
            filter: 'blur(3px)'
          },
          '15%': { 
            opacity: '0.2', 
            transform: 'translateX(-20px) scale(0.8) rotate(-1deg)',
            filter: 'blur(2px)'
          },
          '40%': { 
            opacity: '0.6', 
            transform: 'translateX(-5px) scale(0.95) rotate(0deg)',
            filter: 'blur(1px)'
          },
          '70%': { 
            opacity: '0.9', 
            transform: 'translateX(0) scale(1.02) rotate(0deg)',
            filter: 'blur(0px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) scale(1) rotate(0deg)',
            filter: 'blur(0px)',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3)'
          },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-15px) translateX(10px)' },
          '66%': { transform: 'translateY(-5px) translateX(-10px)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        buttonPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1.05)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}