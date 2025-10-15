/**
 * Application-wide constants
 */

/**
 * Seats configuration
 */
export const SEATS_CONFIG = {
  PER_PAGE: {
    MEETING: 8,
    WORKSPACE: 12,
  },
  MIN: 1,
  MAX: 120,
} as const;

/**
 * Timeout configurations (in milliseconds)
 */
export const TIMEOUTS = {
  AUTH_LOADING: 10000, // 10 seconds
  TOAST_DURATION: 3000, // 3 seconds
  AUTH_ERROR_DELAY: 2000, // 2 seconds
  SUCCESS_CALLBACK_DELAY: 1500, // 1.5 seconds
} as const;

/**
 * Floor configurations
 */
export const FLOOR_CONFIG = {
  MIN: -5, // B5
  MAX: 50,
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION = {
  SCROLL_THROTTLE: 16,
} as const;

/**
 * Form validation limits
 */
export const VALIDATION = {
  ROOM_NAME: {
    MIN: 1,
    MAX: 50,
  },
  ROOM_DESCRIPTION: {
    MAX: 150,
  },
  MIN_MEETING_SEATS: 2,
} as const;
