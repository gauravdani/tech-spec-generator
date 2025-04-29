import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../../logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export const logToFile = (message: string, filename: string = 'app.log'): void => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  const logPath = path.join(LOG_DIR, filename);

  fs.appendFileSync(logPath, logMessage);
};

export const logError = (error: Error | string, filename: string = 'error.log'): void => {
  const errorMessage = error instanceof Error ? error.stack || error.message : error;
  logToFile(`ERROR: ${errorMessage}`, filename);
};

export const logInfo = (message: string, filename: string = 'info.log'): void => {
  logToFile(`INFO: ${message}`, filename);
};

export const logDebug = (message: string, filename: string = 'debug.log'): void => {
  logToFile(`DEBUG: ${message}`, filename);
}; 