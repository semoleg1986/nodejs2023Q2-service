import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as YAML from 'yamljs';
import * as fs from 'fs';
import * as path from 'path';
import { SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const apiSpecPath = path.join('doc', 'api.yaml');
  const apiSpec = YAML.load(apiSpecPath);
  const document = SwaggerModule.createDocument(app, apiSpec);
  SwaggerModule.setup('doc', app, document);
  await app.listen(port);
}
bootstrap();
