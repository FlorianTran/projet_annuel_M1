import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

//La page app.controller.ts est le contrôleur principal de votre application NestJS. 
// Elle sert à gérer les requêtes HTTP entrantes et à y répondre en utilisant les services associés. 
// Voici ses principales fonctions :
// 1. Importation des modules nécessaires :
// Le contrôleur importe le décorateur Controller et le décorateur Get de NestJS pour définir les routes HTTP.
// 2. Définition du contrôleur :
// Le contrôleur est défini avec le décorateur @Controller(), ce qui indique à NestJS qu'il s'agit d'un contrôleur.
// 3. Injection du service :
// Le contrôleur utilise le service AppService pour gérer la logique métier.
// 4. Définition des routes :
// Le contrôleur définit une route GET à la racine (/) de l'application, qui appelle la méthode getHello() du service AppService.
// 5. Gestion des requêtes :
// La méthode getHello() renvoie une chaîne de caractères "Hello World!" en réponse à la requête GET.
// 6. Injection de dépendances :
// Le contrôleur utilise l'injection de dépendances pour obtenir une instance du service AppService.