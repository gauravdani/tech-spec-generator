/**
 * Client-side logging utility
 * 
 * This utility provides functions for logging messages to the console and localStorage.
 * It's designed to be used in the browser environment.
 */

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

// Maximum number of logs to keep in localStorage
const MAX_LOGS = 100;

/**
 * Log a message to the console and localStorage
 * 
 * @param level Log level (DEBUG, INFO, WARN, ERROR)
 * @param category Category of the log (e.g., 'API', 'UI', 'FORM')
 * @param message Log message
 * @param data Optional data to log
 */
export function log(
  level: LogLevel,
  category: string,
  message: string,
  data?: any
): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] [${category}] ${message}`;
  
  // Log to console with appropriate method
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(logMessage);
      break;
    case LogLevel.INFO:
      console.info(logMessage);
      break;
    case LogLevel.WARN:
      console.warn(logMessage);
      break;
    case LogLevel.ERROR:
      console.error(logMessage);
      break;
  }
  
  if (data) {
    console.log(data);
  }
  
  // Store in localStorage
  try {
    const logs = getLogs();
    logs.push({
      timestamp,
      level,
      category,
      message,
      data: data ? JSON.stringify(data) : undefined
    });
    
    // Keep only the last MAX_LOGS logs
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }
    
    localStorage.setItem('app_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving log to localStorage:', error);
  }
}

/**
 * Get all logs from localStorage
 * 
 * @returns Array of log entries
 */
export function getLogs(): LogEntry[] {
  try {
    return JSON.parse(localStorage.getItem('app_logs') || '[]');
  } catch (error) {
    console.error('Error reading logs from localStorage:', error);
    return [];
  }
}

/**
 * Clear all logs from localStorage
 */
export function clearLogs(): void {
  localStorage.removeItem('app_logs');
}

/**
 * Convenience methods for different log levels
 */
export const logger = {
  debug: (category: string, message: string, data?: any) => 
    log(LogLevel.DEBUG, category, message, data),
  
  info: (category: string, message: string, data?: any) => 
    log(LogLevel.INFO, category, message, data),
  
  warn: (category: string, message: string, data?: any) => 
    log(LogLevel.WARN, category, message, data),
  
  error: (category: string, message: string, data?: any) => 
    log(LogLevel.ERROR, category, message, data),
  
  getLogs,
  clearLogs
};

export default logger; 