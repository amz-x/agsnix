import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const api = await NestFactory.create(AppModule);
  api.enableCors();
  api.useGlobalPipes(new ValidationPipe());

  // Run API
  await api.listen(3000);
  console.log(`API is running on: ${await api.getUrl()}`);
}
bootstrap();
