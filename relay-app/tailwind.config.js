/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manabi: {
          navy: '#2D4A6F',    // サイドバー / メインカラー
          sky: '#5BC0DE',     // カードヘッダー / アクセント
          teal: '#00B4B4',    // CTAボタン
          tealHover: '#009696',
          orange: '#FF6B35',  // アラート
          bg: '#F5F5F5',      // 背景
          card: '#FFFFFF',    // カード背景
        },
        // Fallbacks/Mappings for existing classes if needed, but best to replace in code
        slate: {
          50: '#F5F5F5', // Override slate-50 to match design background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}
