import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { load } from 'js-yaml';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const apiSpec = load(
    readFileSync(path.join(__dirname, '../doc/api.yaml'), 'utf8'),
  );
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();
  const document2 = SwaggerModule.createDocument(app, apiSpec);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  SwaggerModule.setup('api-docs-old', app, document2, {
    swaggerOptions: { basePath: '/' },
  });

  await app.listen(port);
}
bootstrap();
