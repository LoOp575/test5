import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], display: ['Poppins','sans-serif'] },
      colors: {
        pvc: { gold: '#D4A017', crimson: '#8B1A1A', lotus: '#F472B6', rice: '#E8F5B8', tech: '#2563EB', research: '#7C3AED', anim: '#DB2777', biz: '#059669', hq: '#B45309' }
      },
      boxShadow: { soft: '0 8px 30px rgba(0,0,0,0.12)', card: '0 4px 20px rgba(0,0,0,0.08)' }
    }
  },
  plugins: []
};
export default config;
