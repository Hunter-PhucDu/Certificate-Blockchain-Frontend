// Color palette configuration for the entire application
// These tokens will be used throughout the application for consistent theming

// Base colors - Professional blue-based palette
export const baseColors = {
  primary: {
    main: "#1890ff", // Ant Design's default blue
    light: "#40a9ff",
    dark: "#096dd9",
  },
  secondary: {
    main: "#722ed1", // Purple for accent
    light: "#9254de",
    dark: "#531dab",
  },
  success: {
    main: "#52c41a",
    light: "#73d13d",
    dark: "#389e0d",
  },
  warning: {
    main: "#faad14",
    light: "#ffc53d",
    dark: "#d48806",
  },
  error: {
    main: "#ff4d4f",
    light: "#ff7875",
    dark: "#d9363e",
  },
  info: {
    main: "#1890ff",
    light: "#40a9ff",
    dark: "#096dd9",
  },
};

// Light theme colors - Clean and professional
export const lightThemeColors = {
  background: {
    primary: "#ffffff",
    secondary: "#f7f7f7",
    tertiary: "#f0f2f5",
  },
  text: {
    primary: "rgba(0, 0, 0, 0.85)",
    secondary: "rgba(0, 0, 0, 0.65)",
    disabled: "rgba(0, 0, 0, 0.45)",
  },
  border: {
    main: "#e0e0e0",
    light: "#f0f0f0",
    dark: "#d0d0d0",
  },
  layout: {
    // Clean white header with slight shadow for depth
    header: "#ffffff",
    // Popular indigo-shade for sidebar - widely used in admin dashboards
    sidebar: "#001529",
    sidebarCollapsed: "#001529",
    content: "#f0f2f5",
    footer: "#f7f7f7",
  },
};

// Dark theme colors - Modern dark theme (GitHub Dark inspired)
export const darkThemeColors = {
  background: {
    primary: "#1e1e1e", // Slightly lighter than pure black
    secondary: "#252525",
    tertiary: "#2d2d2d",
  },
  text: {
    primary: "rgba(255, 255, 255, 0.85)",
    secondary: "rgba(255, 255, 255, 0.65)",
    disabled: "rgba(255, 255, 255, 0.45)",
  },
  border: {
    main: "#434343",
    light: "#555555",
    dark: "#333333",
  },
  layout: {
    // Dark gray header (GitHub-like)
    header: "#24292e",
    // Rich dark blue sidebar with better contrast against header
    sidebar: "#0d1117",
    sidebarCollapsed: "#0d1117",
    content: "#1e1e1e",
    footer: "#24292e",
  },
};

// Shadow configuration for both themes
export const shadows = {
  light: {
    small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    medium:
      "0 3px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
    large:
      "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
  },
  dark: {
    small: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
    medium:
      "0 3px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.36)",
    large:
      "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.45)",
  },
};

// Other design tokens
export const tokens = {
  borderRadius: {
    sm: 2,
    md: 6,
    lg: 8,
    xl: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  transition: {
    fast: "0.1s",
    medium: "0.2s",
    slow: "0.3s",
  },
};
