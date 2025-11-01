// LILO Project Color Palette
// Based on professional laboratory and IoT automation aesthetics

// Primary Colors
export const primary = {
  blue: '#2563eb',      // Primary blue (used for main actions)
  darkBlue: '#1d4ed8',  // Darker blue for emphasis
  lightBlue: '#3b82f6', // Lighter blue for accents
};

// Secondary Colors
export const secondary = {
  teal: '#14b8a6',      // Used for secondary actions
  darkTeal: '#0f766e',  // Darker teal for emphasis
  lightTeal: '#2dd4bf', // Lighter teal for accents
};

// Neutral Colors
export const neutral = {
  white: '#ffffff',     // Pure white
  lightGray: '#f8fafc', // Light gray background
  mediumGray: '#e2e8f0', // Medium gray for dividers
  darkGray: '#64748b',  // Dark gray for text
  black: '#0f172a',     // Pure black for primary text
};

// Safety & Status Colors
export const status = {
  success: '#10b981',   // Green for success/completed
  warning: '#f59e0b',   // Amber for warnings/caution
  error: '#ef4444',     // Red for errors/dangers
  info: '#3b82f6',     // Blue for information
};

// Brand Colors
export const brand = {
  logoBlue: '#1e40af',  // Deep blue for logo
  accent: '#8b5cf6',    // Purple for special accents
  background: '#f1f5f9', // Light background
};

// Laboratory-inspired Colors
export const lab = {
  equipment: '#94a3b8', // Gray for equipment
  safety: '#dc2626',    // Red for safety elements
  chemical: '#8b5cf6',  // Purple for chemical elements
  sensor: '#0284c7',    // Blue for sensor data
};

// Combined theme object
export const theme = {
  ...primary,
  ...secondary,
  ...neutral,
  ...status,
  ...brand,
  ...lab,
};

// Type definition for theme colors
export type ThemeColors = typeof theme;