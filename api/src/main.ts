import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'

import cookieParser from 'cookie-parser'

import { AppModule } from '@/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.enableCors({
    origin:
      process.env.ALLOWED_ORIGINS?.split(',') ?? [
        'http://localhost:5002',
      ],

    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SITREP API')
    .setDescription(
      'Dynamic form and submission API',
    )
    .setVersion('1.0')
    .build()

  const swaggerDocument =
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    )

  app.use(
    '/docs',
    apiReference({
      content: swaggerDocument,
      theme: 'deepSpace',
      documentDownloadType: 'none',
    }),
  )

  const port =
    Number(process.env.PORT) || 5000

  await app.listen(port, '0.0.0.0')

  const logger = new Logger('Bootstrap')

  logger.log('SITREP API Server started')
  logger.log(
    `Running on: http://localhost:${port}`,
  )
  logger.log(
    `API Reference: http://localhost:${port}/docs`,
  )
}

bootstrap()