import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as YAML from 'yamljs';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const apiSpecPath = path.join(__dirname, 'doc', 'api.yaml');
  // const apiSpec = YAML.load(apiSpecPath);
  const config = new DocumentBuilder()
  .setTitle('Home Library Service')
  .setDescription('Home music library service')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(port);
}
bootstrap();
