// Component configuration for the LILO platform

// Default styling options
export const componentDefaults = {
  button: {
    variant: 'primary',
    size: 'md',
  },
  card: {
    variant: 'elevated',
  }
};

// Component registration for dynamic imports (future use)
export const componentRegistry = {
  // Add component mappings here for dynamic loading
};

// Theme configuration
export const themeConfig = {
  colors: {
    primary: '#2563eb', // blue-600
    secondary: '#0d9488', // teal-600
    background: {
      light: '#f8fafc', // slate-50
      gradient: 'from-slate-50 to-blue-50',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  }
};