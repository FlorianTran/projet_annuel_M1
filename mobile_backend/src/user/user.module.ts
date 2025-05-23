import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Abonnement } from 'src/abonnement/entities/abonnement.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Abonnement])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}


//Cette page est le module utilisateur de votre application NestJS.
// Il est responsable de la gestion des utilisateurs, y compris la création, la mise à jour, la suppression et la récupération des utilisateurs.
// Voici ses principales fonctions :
// 1. Importation des modules nécessaires :
// Le module importe TypeOrmModule pour interagir avec la base de données et les entités utilisateur.
// 2. Définition des contrôleurs :
// Le module définit le contrôleur utilisateur (UserController) qui gère les requêtes HTTP liées aux utilisateurs.
// 3. Définition des services :
// Le module définit le service utilisateur (UserService) qui contient la logique métier pour gérer les utilisateurs.
// 4. Définition des entités :
// Le module utilise l'entité utilisateur (User) pour représenter les utilisateurs dans la base de données.
// 5. Configuration du module :
// Le module est configuré avec les contrôleurs, les services et les entités nécessaires pour gérer les utilisateurs.
// En résumé, ce module est essentiel pour gérer les utilisateurs dans votre application NestJS.
// Il encapsule la logique métier, les contrôleurs et les entités nécessaires pour interagir avec les utilisateurs.
// Il est généralement utilisé en conjonction avec d'autres modules pour créer une application complète.
// Il est important de noter que ce module est généralement importé dans le module principal de l'application (AppModule),
// ce qui permet de l'utiliser dans toute l'application.
// En résumé, ce module est essentiel pour gérer les utilisateurs dans votre application NestJS.