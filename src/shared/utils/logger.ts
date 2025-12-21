/**
 * Custom logger utility for the application
 * 
 * Provides different log levels and automatically excludes logs from production builds.
 * In the future, this can be extended to send logs to error tracking services like Sentry.
 * 
 * @example
 * import { logger } from '@/src/shared/utils/logger';
 * 
 * logger.debug('User data:', userData);
 * logger.info('Room created successfully');
 * logger.warn('Rate limit approaching');
 * logger.error('Failed to fetch data', error);
 */

const isDevelopment = __DEV__;

/**
 * Log levels for different types of messages
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Formats a log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Logger class with different log levels
 */
class Logger {
  /**
   * Debug level - Only shown in development
   * Use for detailed debugging information
   */
  debug(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.log(formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }

  /**
   * Info level - Only shown in development
   * Use for general informational messages
   */
  info(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.info(formatMessage(LogLevel.INFO, message), ...args);
    }
  }

  /**
   * Warning level - Shown in all environments
   * Use for warning messages that don't prevent functionality
   */
  warn(message: string, ...args: any[]): void {
    console.warn(formatMessage(LogLevel.WARN, message), ...args);
  }

  /**
   * Error level - Shown in all environments
   * Use for error messages
   * 
   * TODO: In production, send errors to error tracking service (Sentry, Bugsnag, etc.)
   */
  error(message: string, error?: Error | unknown, ...args: any[]): void {
    console.error(formatMessage(LogLevel.ERROR, message), error, ...args);

    // TODO: Send to error tracking service in production
    // if (!isDevelopment && error) {
    //   Sentry.captureException(error, {
    //     extra: { message, ...args },
    //   });
    // }
  }

  /**
   * Group logs together (only in development)
   * Useful for logging complex operations with multiple steps
   */
  group(label: string): void {
    if (isDevelopment) {
      console.group(formatMessage(LogLevel.INFO, label));
    }
  }

  /**
   * End a log group
   */
  groupEnd(): void {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Log a table (only in development)
   * Useful for visualizing arrays of objects
   */
  table(data: any): void {
    if (isDevelopment) {
      console.table(data);
    }
  }

  /**
   * Start a timer (only in development)
   * Useful for performance monitoring
   */
  time(label: string): void {
    if (isDevelopment) {
      console.time(label);
    }
  }

  /**
   * End a timer and log the elapsed time (only in development)
   */
  timeEnd(label: string): void {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;
