# Component-Based Architecture Guide

This document outlines the component-based architecture implemented in the LILO platform.

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx       # Standard button component
│   ├── Card.tsx         # Card container component
│   ├── FeatureCard.tsx  # Feature display component
│   ├── Navigation.tsx   # Navigation component
│   ├── HeroSection.tsx  # Hero section component
│   ├── FeaturesSection.tsx # Features section component
│   ├── CTASection.tsx   # Call-to-action component
│   └── Footer.tsx       # Footer component
├── lib/
│   ├── types.ts         # Shared TypeScript interfaces
│   └── utils.ts         # Utility functions
└── config/
    └── components.ts    # Component configuration
```

## Component Design Principles

### 1. Single Responsibility
Each component has a single purpose and does it well.

### 2. Reusability
Components are designed to be reused across the application.

### 3. Composability
Components can be easily composed together to build complex UIs.

### 4. Type Safety
All components use TypeScript for type safety.

### 5. Maintainability
Components are self-contained with minimal dependencies.

## Component Patterns

### Base Components
- Button: Standard button with variants and sizes
- Card: Container with different styling options
- Input: Form input elements
- Modal: Overlay components

### Section Components
- Navigation: App navigation
- HeroSection: Hero section of the page
- FeaturesSection: Features display
- CTASection: Call-to-action section
- Footer: Page footer

### Data Components
- FeatureCard: Individual feature display
- StatCard: Statistics display
- TestimonialCard: Testimonial display

## Common Props

### Button Component
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `href`: For link buttons

### Card Component
- `variant`: 'default' | 'elevated' | 'outlined'

## Utilities

### cn() function
Utility for combining Tailwind CSS classes with conditional logic:

```typescript
import { cn } from '@/lib/utils';

const classes = cn(
  'base-class',
  condition && 'conditional-class',
  variantClass,
  className
);
```

## Future Enhancements

- Dynamic component loading
- Component theming
- Component testing patterns
- Accessibility improvements