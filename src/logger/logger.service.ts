import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logLevel: LogLevel;
  private appLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'verbose';
  private logFilePath = './logs/app_log.log';
  private errFilePath = './logs/app_err.log';
  private fileSize: number = parseInt(process.env.FILE_SIZE) || 1024;

  private colors = {
    log: '\x1b[0m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    debug: '\x1b[36m',
    verbose: '\x1b[35m',
    time: '\x1b[2m',
  };

  log(message: string) {
    if (this.isLogLevelEnabled('log')) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `${this.colors.time}${timestamp}${this.colors.log} LOG ${message}${this.colors.log}`;
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  error(message: string) {
    if (this.isLogLevelEnabled('error')) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `${this.colors.time}${timestamp}${this.colors.error} ERROR ${message}${this.colors.log}`;
      console.error(formattedMessage);
      this.writeToFile(formattedMessage, true);
    }
  }

  warn(message: string) {
    if (this.isLogLevelEnabled('warn')) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `${this.colors.time}${timestamp}${this.colors.warn} WARNING ${message}${this.colors.log}`;
      console.warn(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  debug(message: string) {
    if (this.isLogLevelEnabled('debug')) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `${this.colors.time}${timestamp}${this.colors.debug} DEBUG ${message}${this.colors.log}`;
      console.debug(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  verbose(message: string) {
    if (this.isLogLevelEnabled('verbose')) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `${this.colors.time}${timestamp}${this.colors.verbose} VERBOSE ${message}${this.colors.log}`;
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  private writeToFile(logMessage: string, isError: boolean = false) {
    const logFilePath = isError ? this.errFilePath : this.logFilePath;

    fs.appendFile(logFilePath, `${logMessage}\n`, (err) => {
      if (err) {
        console.error('Error writing log to file:', err);
      } else {
        this.rotateLogFileIfNeeded(logFilePath);
      }
    });
  }

  private rotateLogFileIfNeeded(logFilePath: string) {
    fs.stat(logFilePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      if (stats.size >= 1024 * this.fileSize) {
        const rotatedFilePath = logFilePath.replace(
          '.log',
          `_old_${Date.now()}.log`,
        );
        fs.rename(logFilePath, rotatedFilePath, (renameErr) => {
          if (renameErr) {
            console.error('Error rotating log file:', renameErr);
          }
        });
      }
    });
  }
  private isLogLevelEnabled(level: LogLevel): boolean {
    const logLevelHierarchy = [
      'log',
      'error',
      'warn',
      'debug',
      'verbose',
    ] as LogLevel[];

    return (
      logLevelHierarchy.indexOf(level) <=
      logLevelHierarchy.indexOf(this.appLogLevel)
    );
  }
}
