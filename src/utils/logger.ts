/**
 * Logger utility for development and production environments
 * Provides different log levels and automatic environment detection
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix: string;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    this.config = {
      enabled: import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOGGING === 'true',
      level: (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'debug',
      prefix: '[Auth]',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} ${this.config.prefix} [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, data?: unknown) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), data || '');
    }
  }

  info(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), data || '');
    }
  }

  warn(message: string, data?: unknown) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), data || '');
    }
  }

  error(message: string, error?: unknown) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error || '');
      if (error && typeof error === 'object' && 'stack' in error) {
        console.error('Stack trace:', (error as { stack: string }).stack);
      }
    }
  }

  group(label: string) {
    if (this.config.enabled) {
      console.group(`${this.config.prefix} ${label}`);
    }
  }

  groupEnd() {
    if (this.config.enabled) {
      console.groupEnd();
    }
  }

  table(data: unknown) {
    if (this.config.enabled && this.shouldLog('debug')) {
      console.table(data);
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Export for testing or custom instances
export { Logger };
