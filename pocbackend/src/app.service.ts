import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// Cette page est le service principal de votre application NestJS.
// Il est responsable de la gestion des fonctionnalités principales de l'application.
// Voici ses principales fonctions :
// 1. Importation des modules nécessaires :
// Le service importe le module Injectable de NestJS pour être injectable dans d'autres parties de l'application.
// 2. Définition du service :
// Le service est défini comme injectable, ce qui signifie qu'il peut être utilisé dans d'autres parties de l'application.
// 3. Définition de la méthode principale :
// Le service définit une méthode principale (getHello) qui renvoie une chaîne de caractères "Hello World!".
// 4. Configuration du service :
// Le service est configuré pour être injectable dans d'autres parties de l'application.
// 5. Utilisation du service :
// Le service peut être utilisé dans d'autres parties de l'application, comme les contrôleurs ou d'autres services.
// En résumé, ce service est essentiel pour gérer les fonctionnalités principales de votre application NestJS.