import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active CORS pour permettre les requêtes cross-origin
  app.enableCors({
    origin: ['http://localhost:8081'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Utilisateurs')
    .setDescription("Documentation de l'API pour la gestion des utilisateurs")
    .setVersion('1.0')
    .addTag('utilisateurs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Démarrage de l'application
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
