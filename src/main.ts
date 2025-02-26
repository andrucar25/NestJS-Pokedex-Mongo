import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')  //setear api como prefijo a todas las rutas: localhost/api/ruta
  
  app.useGlobalPipes( //habilitar las validaciones globales
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
    })
  );
  app.useGlobalFilters(new MongoExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
