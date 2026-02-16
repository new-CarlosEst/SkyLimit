import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
//importo el filtro de excepciones
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Permito cors para no tener problema con peticiones
  app.enableCors();
  
  //Configuracion de validacion global para los dtos entities y demas
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  //Creo que la ruta por defecto sea /api
  app.setGlobalPrefix('api');
  
  //Creo un serializer para que coja el @Exclude()
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //Cojo los filtros
  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
