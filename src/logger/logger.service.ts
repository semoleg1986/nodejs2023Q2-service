import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import { LogLevel } from './logger.level';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logLevel: LogLevel;
  private logStream: fs.WriteStream;

  log(message: string) {
    console.log(`${new Date().toISOString()} LOG ${message}`);
    this.writeToFile(`${new Date().toISOString()} LOG ${message}`);
  }

  error(message: string, trace: string) {
    console.error(
      `${new Date().toISOString()} ERROR ${message}, Trace: ${trace}`,
    );
    this.writeToFile(
      `${new Date().toISOString()} ERROR ${message}, Trace: ${trace}`,
    );
  }

  warn(message: string) {
    console.warn(`${new Date().toISOString()} WARNING ${message}`);
  }

  debug(message: string) {
    console.debug(`${new Date().toISOString()} DEBUG ${message}`);
  }

  verbose(message: string) {
    console.log(`${new Date().toISOString()} VERBOSE ${message}`);
  }
  private writeToFile(logMessage: string) {
    const logFilePath = './file.log';

    fs.appendFile(logFilePath, `${logMessage}\n`, (err) => {
      if (err) {
        console.error('Error writing log to file:', err);
      }
    });
  }
}
