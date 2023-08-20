import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class MyLogger implements LoggerService {
  log(message: string) {
    console.log(`[Log]: ${message}`);
    this.writeToFile(`[Log]: ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`[Error]: ${message}, Trace: ${trace}`);
  }

  warn(message: string) {
    console.warn(`[Warning]: ${message}`);
  }

  debug(message: string) {
    console.debug(`[Debug]: ${message}`);
  }

  verbose(message: string) {
    console.log(`[Verbose]: ${message}`);
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
