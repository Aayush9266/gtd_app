import { MD3DarkTheme } from "react-native-paper";

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#6C63FF",
    secondary: "#FF6584",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    error: "#FF5252",
    success: "#4CAF50",
    warning: "#FFC107",
    border: "#3D3D3D",
  },
  roundness: 8,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};