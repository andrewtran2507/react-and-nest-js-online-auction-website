import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';;
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, { cors: false });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors()

  const configSW = new DocumentBuilder()
  .setTitle('Auction API Swagger')
  .setDescription('The Auction API description')
  .setVersion('1.0')
  .addTag('Auction')
  .build();
  const document = SwaggerModule.createDocument(app, configSW);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log('[WEB]', `${config.get<string>('BASE_URL')}:${config.get<string>('PORT')}`);
  });
}

bootstrap();
