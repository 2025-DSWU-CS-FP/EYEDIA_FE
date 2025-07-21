/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f5f5f7',
        black: '#222222',

        // 회색조
        normalGray: '#d9d9d9',
        'normalGray-hover': '#c3c3c3',
        'normalGray-active': '#aeaeae',
        lightGray: '#fbfbfb',
        'lightGray-hover': '#f9f9f9',
        'lightGray-active': '#f3f3f3',
        darkGray: '#a3a3a3',
        'darkGray-hover': '#828282',
        'darkGray-active': '#626262',

        // 포인트 색상
        cherry: '#E83043',
        'cherry-hover': '#E15D6A', //d1283c
        'cherry-active': '#b42035',
        brand: {
          blue: '#769DFF',
          'blue-light': '#C0D2FF',
          mint: '#3DAF9C',
          'mint-light': '#99DDD1',
        },
        gray: {
          0: '#ffffff',
          5: '#F5F7F9',
          10: '#EBEEF1',
          20: '#DBDEE2',
          30: '#C4C8CD',
          40: '#A7ADB2',
          50: '#8E9398',
          60: '#6C7378',
          70: '#565B60',
          80: '#34383C',
          90: '#1D2023',
          100: '#000000',
        },
        statement: {
          error: '#F44336',
          warning: '#FFCA28',
          positive: '#4CAF50',
        },
        opacity: {
          light: 'rgba(0, 0, 0, 0.2)',
          medium: 'rgba(0, 0, 0, 0.5)',
          deep: 'rgba(0, 0, 0, 0.8)',
        },
      },
      boxShadow: {
        card: '2px 4px 12px 0px rgba(0, 0, 0, 0.08)',
        modal: '2px 2px 16px 0px rgba(0, 0, 0, 0.25)',
      },
      gridAutoColumns: {
        '2fr': 'minmax(0, 2fr)',
        '3fr': 'minmax(0, 3fr)',
      },
      height: {
        inherit: 'inherit',
      },
      fontSize: {
        '28': ['28px', { lineHeight: '32px' }],
        '22_sb': ['22px', { lineHeight: '24px' }],
        '22_m': ['22px', { lineHeight: '24px' }],
        '20_sb': ['20px', { lineHeight: '22px' }],
        '20_r': ['20px', { lineHeight: '22px' }],
        '14': ['28px', { lineHeight: '32px' }],
        '13': ['22px', { lineHeight: '24px' }],
        '12': ['22px', { lineHeight: '24px' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
      },
    },
    animation: {
      'slide-fade-in-dropdown': 'slide-fade-in-dropdown-animation 0.4s ease',
      'slide-fade-out-dropdown': 'slide-fade-out-dropdown-animation 0.4s ease',
      spin: 'spin 1.3s linear infinite',
      'bounce-delay-1': 'bounce-custom 1s infinite ease-in-out',
      'bounce-delay-2': 'bounce-custom 1s infinite ease-in-out 0.2s',
      'bounce-delay-3': 'bounce-custom 1s infinite ease-in-out 0.4s',
    },
    keyframes: {
      'slide-fade-in-dropdown-animation': {
        '0%': {
          transform: 'translateY(-10%)',
        },
        '100%': {
          transform: 'translateY(0)',
        },
      },
      'slide-fade-out-dropdown-animation': {
        '0%': {
          transform: 'translateY(0)',
        },
        '100%': {
          transform: 'translateY(-10%)',
        },
      },
      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      'bounce-custom': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-6px)' },
      },
    },
  },
  plugins: [],
};
