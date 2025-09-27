/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette inspired by precious metals and gemstones
        luxury: {
          // Gold Tones
          gold: '#FFD700',           // Pure gold
          champagne: '#F7E7CE',      // Light champagne gold
          antique: '#CD7F32',        // Antique gold/brass
          
          // Rose Gold Tones  
          rose: '#E8B4B8',           // Soft rose gold
          roseDark: '#D4A574',       // Deep rose gold
          blush: '#F4C2C2',          // Light rose blush
          
          // Brass Tones
          brass: '#B5651D',          // Rich brass
          brassLight: '#DAA520',     // Light brass
          bronze: '#CD7F32',         // Bronze accent
          
          // Emerald Tones
          emerald: '#50C878',        // Vibrant emerald
          jade: '#00A86B',           // Deep jade green
          mint: '#98FB98',           // Light mint accent
          
          // Supporting Neutrals
          obsidian: '#0B0B0B',       // Deep black with warmth
          charcoal: '#1A1A1A',       // Rich charcoal
          pearl: '#F8F6F0',          // Warm pearl white
          platinum: '#E5E4E2',       // Platinum silver
        },
        // Keep studio colors for backward compatibility during transition
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
        'script': ['Cormorant Garamond', 'Playfair Display', 'serif'],
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
        // Luxury-specific animations
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'emerald-glow': 'emeraldGlow 2s ease-in-out infinite alternate',
        'rose-sparkle': 'roseSparkle 4s ease-in-out infinite',
        'brass-reflection': 'brassReflection 5s ease-in-out infinite',
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
        },
        // Luxury animation keyframes
        goldShimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
          },
          '100%': { 
            backgroundPosition: '200% 0',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
          },
        },
        emeraldGlow: {
          '0%': { boxShadow: '0 0 15px rgba(80, 200, 120, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(80, 200, 120, 0.8)' },
        },
        roseSparkle: {
          '0%, 100%': { 
            filter: 'brightness(1) saturate(1)',
            transform: 'scale(1)'
          },
          '25%': { 
            filter: 'brightness(1.2) saturate(1.3)',
            transform: 'scale(1.02)'
          },
          '50%': { 
            filter: 'brightness(1.1) saturate(1.1)',
            transform: 'scale(1)'
          },
          '75%': { 
            filter: 'brightness(1.3) saturate(1.4)',
            transform: 'scale(1.01)'
          },
        },
        brassReflection: {
          '0%': { 
            backgroundPosition: '0% 50%',
            filter: 'brightness(1)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'brightness(1.2)'
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            filter: 'brightness(1)'
          },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Luxury gradient combinations
        'luxury-gold': 'linear-gradient(135deg, #FFD700, #F7E7CE)',
        'luxury-rose': 'linear-gradient(135deg, #E8B4B8, #D4A574)',
        'luxury-brass': 'linear-gradient(135deg, #B5651D, #CD7F32)',
        'luxury-emerald': 'linear-gradient(135deg, #50C878, #00A86B)',
        'luxury-mixed': 'linear-gradient(135deg, #FFD700, #E8B4B8, #50C878)',
        'luxury-warm': 'linear-gradient(135deg, #FFD700, #D4A574)',
        'luxury-cool': 'linear-gradient(135deg, #50C878, #E5E4E2)',
        'luxury-royal': 'linear-gradient(135deg, #CD7F32, #00A86B)',
      }
    },
  },
  plugins: [],
}