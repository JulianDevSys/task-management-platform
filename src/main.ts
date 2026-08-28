import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.time('nest startup');
  const app = await NestFactory.create(AppModule);

  console.timeEnd('nest startup');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API for managing users and tasks')
    .setVersion('1.0')
   // .addBearerAuth()  // Add this line to enable Bearer authentication in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();