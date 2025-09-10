import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Configure Express options for larger headers
    rawBody: true,
  });
  
  // Configure Express to handle larger headers
  const express = app.getHttpAdapter().getInstance();
  express.set('trust proxy', true);
  
  // Configure body parsing with larger limits
  express.use(require('express').json({ limit: '50mb' }));
  express.use(require('express').urlencoded({ limit: '50mb', extended: true }));
  
  // Increase header size limits
  express.use((req, res, next) => {
    // Set larger limits for headers
    req.setMaxListeners(0);
    // Increase header size limit
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      // Allow service-to-service calls from any origin
      // In production, you should specify the exact origins
      ...(process.env.NODE_ENV === 'development' ? ['*'] : []),
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Serve static files from uploads directory (before setting global prefix)
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Transactions Service API')
    .setDescription('API for managing real estate transactions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3003;
  
  // Configure the HTTP server for larger headers
  const server = await app.listen(port);
  server.maxHeadersCount = 2000;
  server.headersTimeout = 60000;
  server.requestTimeout = 60000;
  
  console.log(`🚀 Transactions Service running on port ${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
