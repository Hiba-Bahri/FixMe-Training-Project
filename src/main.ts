import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to the type defined in DTOs
    whitelist: true, // Strips properties that do not have decorators
    forbidNonWhitelisted: true, // Reject requests with properties not in DTOs
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
