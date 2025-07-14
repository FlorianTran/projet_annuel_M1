import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ChatRoom } from './chatroom/entities/chatroom.entity';
import { DebugController } from './debug.controller';
import { Entrainement } from './entrainement/entities/entrainement.entity';
import { EntrainementModule } from './entrainement/entrainement.module';
import { Exercise } from './exercise/entities/exercise.entity';
import { ExerciseModule } from './exercise/exercise.module';
import { Message } from './message/entities/message.entity';
import { MessageModule } from './message/message.module';
import { Seance } from './seance/entities/seance.entity';
import { SeanceModule } from './seance/seance.module';
import { SocketGateway } from './socket/socket.gateway';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Workout } from './workout/entities/workout.entity';
import { WorkoutModule } from './workout/workout.module';
import { SalleDeSport } from './salle-de-sport/entities/salle-de-sport.entity';
import { SalleDeSportModule } from './salle-de-sport/salle-de-sport.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // on utilise docker-compose, pas de .env
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_NAME ?? 'dbpostgres',
      entities: [User, Entrainement, Seance, ChatRoom, Message, Exercise, Workout, SalleDeSport],          
      synchronize: true, // Enable auto schema sync for dev
    }),
    UserModule,
    EntrainementModule,
    SeanceModule,
    ChatroomModule,
    MessageModule,
    ChatModule,
    ExerciseModule,
    WorkoutModule,
    SalleDeSportModule
  ],
  controllers: [AppController, DebugController],
  providers: [AppService, SocketGateway]
  
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
