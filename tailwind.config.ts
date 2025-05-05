import type { Config } from "tailwindcss";
// Import the plugin using ES module syntax
import tailwindcssAnimate from "tailwindcss-animate";
// Or if you prefer: const tailwindcssAnimate = eval('require')("tailwindcss-animate")

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
        // Brand colors
        // primary: {
        //   DEFAULT: siteConfig.theme.colors.primary,
        //   light: siteConfig.theme.colors.primaryLight,
        //   dark: siteConfig.theme.colors.primaryDark,
        // },
        // secondary: {
        //   DEFAULT: siteConfig.theme.colors.secondary,
        //   light: siteConfig.theme.colors.secondaryLight,
        //   dark: siteConfig.theme.colors.secondaryDark,
        // },
        // accent: {
        //   DEFAULT: siteConfig.theme.colors.accent,
        //   light: siteConfig.theme.colors.accentLight,
        //   dark: siteConfig.theme.colors.accentDark,
        // },

        // // Text colors
        // text: {
        //   primary: siteConfig.theme.colors.text.primary,
        //   secondary: siteConfig.theme.colors.text.secondary,
        //   disabled: siteConfig.theme.colors.text.disabled,
        // },

        // // Status colors
        // success: siteConfig.theme.colors.status.success,
        // warning: siteConfig.theme.colors.status.warning,
        // error: siteConfig.theme.colors.status.error,
        // info: siteConfig.theme.colors.status.info,

        // // Background colors
        // background: siteConfig.theme.colors.background,
        // "light-background": siteConfig.theme.colors.lightBackground,

        // // shadcn/ui required colors
        // border: siteConfig.theme.colors.border,
        // input: siteConfig.theme.colors.border,
        // ring: siteConfig.theme.colors.primary,
        // foreground: siteConfig.theme.colors.text.primary,

        // // Additional shadcn/ui colors
        // muted: {
        //   DEFAULT: siteConfig.theme.colors.secondaryLight,
        //   foreground: siteConfig.theme.colors.text.secondary,
        // },
        // destructive: {
        //   DEFAULT: siteConfig.theme.colors.status.error,
        //   foreground: "#FFFFFF",
        // },
        // card: {
        //   DEFAULT: siteConfig.theme.colors.lightBackground,
        //   foreground: siteConfig.theme.colors.text.primary,
        // },
        // popover: {
        //   DEFAULT: siteConfig.theme.colors.lightBackground,
        //   foreground: siteConfig.theme.colors.text.primary,
        // },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      // Add standard spacing values
      spacing: {
        xs: "0.25rem", // 4px
        sm: "0.5rem", // 8px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        xxl: "3rem" // 48px
      },
      // Add standard max-width values
      maxWidth: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px"
      },
      // Add standard box-shadow values
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
