import { Injectable, NestMiddleware } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    this.logger.log(`Incoming request: ${method} ${originalUrl}`);
    this.logger.log(`Query parameters: ${JSON.stringify(query)}`);
    this.logger.log(`Request body: ${JSON.stringify(body)}`);

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`Outgoing response: ${statusCode}`);
    });

    next();
  }
}
