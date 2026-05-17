import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#eef2ff",
    100: "#dbe4ff",
    200: "#c1d0ff",
    300: "#9fb7ff",
    400: "#7c97ff",
    500: "#5b7cff",
    600: "#4462e6",
    700: "#334bb4",
    800: "#243582",
    900: "#16204f",
  },
  grayBrand: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  success: {
    500: "#16a34a",
  },
  warning: {
    500: "#f59e0b",
  },
  danger: {
    500: "#dc2626",
  },
};

const theme = extendTheme({
  colors,

  semanticTokens: {
    colors: {
      "app.bg": { default: "grayBrand.100" },
      "app.surface": { default: "white" },
      "app.border": { default: "grayBrand.200" },
      "app.text": { default: "grayBrand.800" },
      "app.muted": { default: "grayBrand.500" },

      "sidebar.bg": { default: "brand.900" },
      "sidebar.border": { default: "whiteAlpha.200" },
      "sidebar.title": { default: "white" },
      "sidebar.subtitle": { default: "whiteAlpha.700" },
      "sidebar.item.text": { default: "whiteAlpha.900" },
      "sidebar.item.hoverBg": { default: "brand.800" },
      "sidebar.item.activeBg": { default: "brand.500" },
      "sidebar.item.activeText": { default: "white" },

      "page.header": { default: "grayBrand.800" },
      "page.description": { default: "grayBrand.500" },

      "card.bg": { default: "white" },
      "card.border": { default: "grayBrand.200" },
      "card.title": { default: "grayBrand.800" },
      "card.description": { default: "grayBrand.500" },

      "button.primary.bg": { default: "brand.500" },
      "button.primary.hoverBg": { default: "brand.600" },
      "button.primary.text": { default: "white" },
    },
  },

  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },

  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
  },

  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },

  shadows: {
    card: "0 4px 20px rgba(15, 23, 42, 0.06)",
    sidebar: "0 0 0 1px rgba(255,255,255,0.04)",
  },

  space: {
    4.5: "18px",
    5.5: "22px",
  },

  styles: {
    global: {
      body: {
        bg: "app.bg",
        color: "app.text",
      },
      "#root": {
        minHeight: "100vh",
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontWeight: "600",
      },
      variants: {
        solid: {
          bg: "button.primary.bg",
          color: "button.primary.text",
          _hover: {
            bg: "button.primary.hoverBg",
          },
        },
      },
      defaultProps: {
        variant: "solid",
      },
    },

    Box: {
      variants: {
        adminCard: {
          bg: "card.bg",
          border: "1px solid",
          borderColor: "card.border",
          borderRadius: "xl",
          boxShadow: "card",
        },
      },
    },

    Link: {
      variants: {
        sidebarItem: {
          display: "block",
          px: 4,
          py: 3,
          borderRadius: "lg",
          fontWeight: "600",
          color: "sidebar.item.text",
          transition: "all 0.2s ease",
          _hover: {
            textDecoration: "none",
            bg: "sidebar.item.hoverBg",
          },
          _activeLink: {
            bg: "sidebar.item.activeBg",
            color: "sidebar.item.activeText",
          },
        },
      },
    },

    Heading: {
      baseStyle: {
        color: "page.header",
      },
    },

    Text: {
      variants: {
        pageDescription: {
          color: "page.description",
          fontSize: "md",
        },
        cardDescription: {
          color: "card.description",
          fontSize: "sm",
        },
        sidebarSubtitle: {
          color: "sidebar.subtitle",
          fontSize: "sm",
        },
      },
    },

    Divider: {
      baseStyle: {
        borderColor: "app.border",
      },
    },
  },
});

export default theme;