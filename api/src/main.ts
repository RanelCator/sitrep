import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from '@/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
  .setTitle('SITREP API')
  .setDescription('Dynamic form and submission API')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument(app, config)
  
  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'deepSpace',
      documentDownloadType: 'none',
    }),
  )

  const logger = new Logger('Bootstrap');

  const port = Number(process.env.PORT) || 5000;
  await app.listen(port, '0.0.0.0');

  logger.log(` PGAS-GIS API Server started`);
  logger.log(` Running on: http://localhost:${port}`);
  logger.log(` API Reference: http://localhost:${port}/docs`);
}
bootstrap();
