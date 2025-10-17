/**
 * Color constants for the application
 * These colors align with Tailwind theme and can be used in React Native components
 */

export const colors = {
  // Primary brand colors (blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main primary color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Gray scale (from Tailwind's default gray)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Semantic colors for common use cases
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Helper to access nested colors easily
export const getColor = (path: string): string => {
  const parts = path.split('.');
  let value: any = colors;
  
  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`);
      return colors.primary[500];
    }
  }
  
  return value as string;
};

// Commonly used colors for quick access
export const themeColors = {
  primary: colors.primary[500],
  primaryLight: colors.primary[50],
  primaryDark: colors.primary[600],

  gray: colors.gray[500],
  grayLight: colors.gray[100],
  grayDark: colors.gray[700],
  
  textPrimary: colors.gray[900],
  textSecondary: colors.gray[500],
  textTertiary: colors.gray[400],
  
  bgPrimary: colors.white,
  bgSecondary: colors.gray[50],
  bgTertiary: colors.gray[100],
  
  border: colors.gray[200],
  borderLight: colors.gray[100],
  borderDark: colors.gray[300],
  
  // Switch component colors
  switchTrackInactive: colors.gray[200],
  switchTrackActive: colors.primary[300],
  switchThumbActive: colors.primary[500],
  switchThumbInactive: colors.gray[100],
} as const;
