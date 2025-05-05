export const siteConfig = {
  name: "MotoStix",
  description: "Your one-stop destination for all things Moto!",
  theme: {
    colors: {
      primary: "#FFCE00", // Yellow
      primaryLight: "#FFE066",
      primaryDark: "#E6B800",
      secondary: "#4A4A4A", // Dark Gray
      secondaryLight: "#6D6D6D",
      secondaryDark: "#333333",
      background: "#1E1E1E", // Dark Background
      lightBackground: "#2A2A2A", // Light Background
      accent: "#A3FF67", // Pale Green
      accentLight: "#C5FF9E",
      accentDark: "#7FCC33",
      border: "#4B4B4B", // Border color
      text: {
        primary: "#FFFFFF",
        secondary: "#B3B3B3",
        disabled: "#666666"
      },
      status: {
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
        info: "#2196F3"
      }
    },
    fonts: {
      primary: "Inter", // Primary font
      secondary: "Space Grotesk" // Secondary font
    },
    spacing: {
      xs: "0.25rem", // 4px
      sm: "0.5rem", // 8px
      md: "1rem", // 16px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      xxl: "3rem" // 48px
    },
    borderRadius: {
      none: "0",
      sm: "0.25rem", // 4px
      DEFAULT: "0.5rem", // 8px
      md: "9999px", // Fully rounded (for buttons)
      lg: "1rem", // 16px
      full: "9999px" // Fully rounded
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    layout: {
      maxWidth: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px"
      }
    }
  }
} as const;

export type SiteConfig = typeof siteConfig;
