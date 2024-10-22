import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from 'src/common/exceptions/exception.filters';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptor for transforming responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  // Enabling CORS (Cross-Origin Resource Sharing)
  app.enableCors();

  // Adding a global prefix to all routes
  app.setGlobalPrefix('api');

  // Swagger setup for API documentation
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Graceful shutdown
  app.enableShutdownHooks();

  // Listening on port 3000
  await app.listen(3000);
}

bootstrap();
