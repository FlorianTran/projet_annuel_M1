import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module'; // Correction : Import du module utilisateur

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Vérifiez que vous utilisez le bon type de base de données
      host: 'localhost', // Vérifiez que l'hôte est correct
      port: 5432, // Assurez-vous que le port est correct (par défaut pour PostgreSQL : 5432)
      username: 'root', // Vérifiez le nom d'utilisateur
      password: 'root',
      database: 'postgres', // Vérifiez le nom de la base de données
      entities: [User], // Assurez-vous que l'entité User est bien importée
      synchronize: true, // Peut être activé en développement
    }),
    UserModule, // Correction : Nom du module utilisateur
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

//Cette page,est le module racine de votre application NestJS. 
// Elle sert à configurer et organiser les différents modules, services, et contrôleurs de votre application. 
// Voici ses principales fonctions :
//Définir les modules importés :
// Le module utilise TypeOrmModule pour se connecter à une base de données PostgreSQL.
// Le module UserModule est importé pour gérer les utilisateurs.
//Configurer le contrôleur principal :
// Le contrôleur principal de l'application est défini ici (AppController).
//Configurer les services :
// Le service principal de l'application est défini ici (AppService).
//Configurer la connexion à la base de données :
// La connexion à la base de données est configurée avec les informations nécessaires (type, hôte, port, etc.).
//Configurer les entités :
// Les entités utilisées par TypeORM sont définies ici (dans ce cas, l'entité User).
//Configurer la synchronisation de la base de données :
// La synchronisation de la base de données est activée, ce qui signifie que les modifications apportées aux entités seront automatiquement appliquées à la base de données.
//Attention : cela peut être dangereux en production, car cela peut entraîner la perte de données.
//Configurer le constructeur :
// Le constructeur de la classe AppModule utilise le DataSource pour gérer la connexion à la base de données.
//En résumé, ce module est essentiel pour configurer et organiser les différents aspects de votre application NestJS,
// y compris la connexion à la base de données, les modules, les contrôleurs et les services.
// Il est important de noter que ce module est généralement le point d'entrée de votre application NestJS,
// et il est chargé en premier lors du démarrage de l'application.
