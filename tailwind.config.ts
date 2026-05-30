import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        navy: {
          50: "var(--fr2p-navy-50)",
          100: "var(--fr2p-navy-100)",
          200: "var(--fr2p-navy-200)",
          300: "var(--fr2p-navy-300)",
          400: "var(--fr2p-navy-400)",
          500: "var(--fr2p-navy-500)",
          600: "var(--fr2p-navy-600)",
          700: "var(--fr2p-navy-700)",
          800: "var(--fr2p-navy-800)",
          900: "var(--fr2p-navy-900)",
          950: "hsl(210, 100%, 4%)",
        },
        burgundy: {
          50: "var(--fr2p-burgundy-50)",
          100: "var(--fr2p-burgundy-100)",
          200: "var(--fr2p-burgundy-200)",
          300: "var(--fr2p-burgundy-300)",
          400: "var(--fr2p-burgundy-400)",
          500: "var(--fr2p-burgundy-500)",
          600: "var(--fr2p-burgundy-600)",
          700: "var(--fr2p-burgundy-700)",
          800: "var(--fr2p-burgundy-800)",
          900: "var(--fr2p-burgundy-900)",
        },
        gold: {
          50: "var(--fr2p-gold-50)",
          100: "var(--fr2p-gold-100)",
          200: "var(--fr2p-gold-200)",
          300: "var(--fr2p-gold-300)",
          400: "var(--fr2p-gold-400)",
          500: "var(--fr2p-gold-500)",
          600: "var(--fr2p-gold-600)",
          700: "var(--fr2p-gold-700)",
          800: "var(--fr2p-gold-800)",
          900: "var(--fr2p-gold-900)",
        },
        cream: {
          50: "var(--fr2p-cream-50)",
          100: "var(--fr2p-cream-100)",
          200: "var(--fr2p-cream-200)",
          300: "var(--fr2p-cream-300)",
          400: "var(--fr2p-cream-400)",
          500: "var(--fr2p-cream-500)",
          600: "var(--fr2p-cream-600)",
          700: "var(--fr2p-cream-700)",
          800: "var(--fr2p-cream-800)",
          900: "var(--fr2p-cream-900)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
