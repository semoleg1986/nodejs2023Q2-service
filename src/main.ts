import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './logger/logger.service';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });
  const loggingService = app.get(MyLogger);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
  // logger.log(`App listening on port ${port}`);
  process.on('uncaughtException', (error) => {
    const errorData = {
      message: 'Uncaught Exception',
      trace: error.stack,
      statusCode: 500,
    };
    loggingService.error(JSON.stringify(errorData));
  });

  process.on('unhandledRejection', (reason) => {
    const errorData = {
      message: 'Unhandled Rejection',
      reason: reason instanceof Error ? reason.stack : reason,
      statusCode: 500,
    };

    loggingService.error(JSON.stringify(errorData));
  });
}
bootstrap();
