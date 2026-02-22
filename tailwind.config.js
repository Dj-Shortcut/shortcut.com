/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: 'var(--bg)',
          panel: 'var(--panel)',
          txt: 'var(--txt)',
          muted: 'var(--muted)',
          acc: 'var(--acc)',
          acc2: 'var(--acc2)',
          border: 'var(--border)'
        }
      },
      borderRadius: {
        terminal: '16px',
        card: '12px'
      },
      spacing: {
        'terminal-card': '22px',
        'terminal-gap': '14px'
      },
      boxShadow: {
        'terminal-panel': '0 0 0 1px rgba(15,174,75,0.10) inset, 0 0 24px rgba(33,255,106,0.08)',
        'terminal-glow': '0 0 18px rgba(33,255,106,0.12)'
      },
      backgroundImage: {
        'terminal-panel': 'linear-gradient(180deg, rgba(7,18,11,0.95), rgba(5,8,5,0.85))',
        scanlines: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)'
      }
    }
  }
};
