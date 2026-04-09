import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0c11',
        s1: '#13161f',
        s2: '#1a1e2e',
        s3: '#222840',
        border: '#2a3050',
        border2: '#3a4570',
        gold: {
          DEFAULT: '#e8a020',
          2: '#f5c050',
          dim: 'rgba(232,160,32,0.12)',
        },
        teal: {
          DEFAULT: '#0ea5a0',
          2: '#14d4ce',
          dim: 'rgba(14,165,160,0.12)',
        },
        success: '#10b981',
        danger: '#f43f5e',
        info: '#3b8df5',
        warn: '#facc15',
        text: {
          DEFAULT: '#dde4f5',
          2: '#8fa0c0',
          3: '#55688a',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        sm: '10px',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}

export default config
