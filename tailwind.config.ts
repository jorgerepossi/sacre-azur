import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        background_white: "var(--background-white)",
        primary_text_dark: "var(--primary_text_dark)",
        secondary_text_dark: "hsl(var(--secondary-text-dark))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          border: "hsl(var(--primary))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        display: [
          '2.25rem', // 36px
          {
            lineHeight: '2.75rem', // 44px
            fontWeight: '700',
            letterSpacing: '0px',
          },
        ],
        'display-medium': [
          '2rem', // 16px
          {
            lineHeight: '2.5rem', // 40px
            fontWeight: '600',
            letterSpacing: '0px',
          },
        ],
        'title-large': [
          '1.375rem', // 22px
          {
            lineHeight: '1.75rem', // 28px
            fontWeight: '500',
            letterSpacing: '0px',
          },
        ],
        'title-small': [
          '1rem',
          {
            lineHeight: '1.5rem', // 24px
            fontWeight: '500',
            letterSpacing: '0.15px',
          },
        ],
        headline: '1.75rem', // 28px
        'headline-small': [
          '1.5rem', // 24px
          {
            lineHeight: '2rem', // 32px
            fontWeight: '500',
          },
        ],
        'headline-subtitle': [
          '1rem',
          {
            lineHeight: '1.5rem', // 24px
            fontWeight: '500',
            letterSpacing: '0.15px',
          },
        ],
        'body-small': [
          '12px',
          {
            lineHeight: '1rem',
            letterSpacing: '0.5px',
            fontWeight: 'normal',
          },
        ],
        'body-medium': [
          '14px',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0.25px',
            fontWeight: 'normal',
          },
        ],
        'body-large': [
          '1rem',
          {
            lineHeight: '1.5rem', // 24px
            fontWeight: '400',
            letterSpacing: '0.5px',
          },
        ],
        'body-xsmall': [
          '11px',
          {
            lineHeight: '1.25rem',
            fontWeight: '500',
            letterSpacing: '0.5px',
          },
        ],
        'label-large': [
          '14px',
          {
            lineHeight: '1.25rem',
            fontWeight: '500',
            letterSpacing: '0.1px',
          },
        ],
      },
    },
  },
  plugins: [],
}

export default config

