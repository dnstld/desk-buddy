/**
 * Logger utility for consistent logging across the application
 * Automatically disabled in production builds
 */

const isDev = __DEV__;

export const logger = {
  /**
   * Log informational messages (only in development)
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },

  /**
   * Log error messages (always logged)
   */
  error: (message: string, ...args: unknown[]) => {
    console.error(`❌ ${message}`, ...args);
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`🔍 ${message}`, ...args);
    }
  },

  /**
   * Log success messages (only in development)
   */
  success: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`✅ ${message}`, ...args);
    }
  },
};
