/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.jsx",
  ],
  darkMode: 'class', // Habilita o modo escuro com a classe 'dark'
  theme: {
    extend: {
      fontFamily: {
        sans: ['poppins', 'sans-serif'], // Fonte personalizada
      },
      colors: {
        primary: {
          light: '#FF6B35',  // Cor primária clara
          dark: '#FF8C5A',   // Cor primária escura
        },
        secondary: {
          light: '#6E44FF',  // Cor secundária clara
          dark: '#8B6AFF',   // Cor secundária escura
        },
        dark: {
          900: '#0F0F0F',   // Cor escura 900
          800: '#1A1A1A',   // Cor escura 800
          700: '#252525',   // Cor escura 700
          600: '#303030',   // Cor escura 600
        },
        light: {
          900: '#f2f0f5',   // Cor escura 900
          800: '#fff',   // Cor escura 800
        }
      },
      boxShadow: {
        neumorphic: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff', // Sombra neumórfica
        'neumorphic-dark': '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a', // Sombra neumórfica escura
        card: '0 4px 20px rgba(0, 0, 0, 0.08)', // Sombra de cartão
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.2)', // Sombra de cartão escuro
      }
    }
  },
  plugins: [],
}
