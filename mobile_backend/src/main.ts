import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active CORS pour permettre les requêtes cross-origin
  app.enableCors({
    origin: 'http://localhost:8081', // Remplacez par l'URL de votre frontend
    credentials: true, // Autoriser les cookies et les en-têtes d'autorisation
    exposedHeaders: ['Content-Type', 'Authorization'], // Exposer les en-têtes nécessaires
    methods: 'GET, POST, PUT, DELETE', // Définir les méthodes autorisées
    allowedHeaders: 'Content-Type, Authorization', // Définir les en-têtes autorisés
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
  
  app.enableCors({
    origin: 'http://localhost:3000', // URL de votre frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Démarrage de l'application
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
