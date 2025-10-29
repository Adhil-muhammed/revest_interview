import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  // Enable validation with automatic type transformation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
    skipNullProperties: false,
    skipUndefinedProperties: false,
  }));
  
  await app.listen(3002);
  console.log('Order Service is running on http://localhost:3002');
}

bootstrap();
