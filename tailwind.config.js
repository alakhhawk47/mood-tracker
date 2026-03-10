/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'soft-purple': '#A78BFA',
        'lavender': '#E9D5FF',
        'pastel-blue': '#BFDBFE',
        'soft-pink': '#FBCFE8',
        'warm-beige': '#F5F5F4',
        'deep-purple': '#7C3AED',
        'muted-purple': '#DDD6FE',
        // Dark mode colors
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-card-hover': '#334155',
        'dark-border': '#334155',
        'dark-text': '#F8FAFC',
        'dark-muted': '#94A3B8',
        'dark-accent': '#C084FC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'wellness-gradient': 'linear-gradient(135deg, #E9D5FF 0%, #BFDBFE 50%, #FBCFE8 100%)',
        'dark-wellness-gradient': 'linear-gradient(135deg, #0F172A 0%, #17112E 50%, #1E1B4B 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
        'dark-card-gradient': 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.4) 100%)',
        'purple-gradient': 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
        'blue-gradient': 'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)',
        'pink-gradient': 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)',
        'green-gradient': 'linear-gradient(135deg, #BBF7D0 0%, #6EE7B7 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(167, 139, 250, 0.15)',
        'glass-lg': '0 16px 48px rgba(167, 139, 250, 0.2)',
        'mood': '0 0 20px rgba(167, 139, 250, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 40px rgba(167, 139, 250, 0.25)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'blob-slow': 'blob 12s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
