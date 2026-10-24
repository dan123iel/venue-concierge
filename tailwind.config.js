/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        magenta: "hsl(var(--magenta))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--magenta)) 100%)",
      },
      fontFamily: {
        display: ["'Archivo'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        frame: "0 0 0 1px rgba(0,0,0,.06), 0 8px 40px rgba(0,0,0,.12)",
      },
    },
  },
  plugins: [],
};
