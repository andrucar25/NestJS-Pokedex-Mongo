import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')  //setear api como prefijo a todas las rutas: localhost/api/ruta
  
  app.useGlobalPipes( //habilitar las validaciones globales
    new ValidationPipe({
      whitelist: true,  //Elimina cualquier propiedad de los datos entrantes que no esté definida en el DTO
      forbidNonWhitelisted: true, //Si se envía una propiedad que no está definida en el DTO, en lugar de simplemente ignorarla, lanza un error y rechaza la solicitud
      transform: true,    //Transforma automáticamente los datos entrantes a los tipos definidos en el DTO
      transformOptions: {
        enableImplicitConversion: true, //Habilita la conversión implícita de tipos durante la transformación. NestJS intentará convertir automáticamente los datos a los tipos correctos sin necesidad de decoradores adicionales
      } 
    })
  );
  app.useGlobalFilters(new MongoExceptionFilter());
  
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  await app.listen(PORT || 3000);
}
bootstrap();
