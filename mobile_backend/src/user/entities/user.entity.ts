import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Abonnement } from 'src/abonnement/entities/abonnement.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // UUID comme clé primaire
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true }) // L'email doit être unique
  email: string;

  @Column()
  motDePasse: string;

  @Column('date') // Type date pour la date de naissance
  dateNaissance: Date;

  @Column()
  sexe: string;

  @Column('float') // Type float pour le poids
  poids: number;

  @Column('float') // Type float pour la taille
  taille: number;


  @OneToMany(() => Abonnement, (abonnement) => abonnement.user)
  abonnements: Abonnement[];

  // @OneToMany(() => Seance, (seance) => seance.user)
  // seances: Seance[];
}

// La page user.entity.ts définit l'entité utilisateur pour votre application NestJS en utilisant TypeORM.
// Une entité représente une table dans la base de données, et chaque instance de cette classe correspond à une ligne dans cette table.
// Voici les principales fonctions de cette page :

// 1. Importation des modules nécessaires :
// La page importe les décorateurs Entity, Column et PrimaryGeneratedColumn de TypeORM pour définir l'entité utilisateur.

// 2. Définition de l'entité :
// La classe User est définie avec le décorateur @Entity(), ce qui indique à TypeORM qu'il s'agit d'une entité.

// 3. Définition des colonnes :
// La classe User contient plusieurs propriétés qui correspondent aux colonnes de la table utilisateur dans la base de données :
// - id : une colonne de type UUID qui est la clé primaire de l'entité. Elle est générée automatiquement.
// - nom : une colonne de type chaîne qui stocke le nom de l'utilisateur.
// - prenom : une colonne de type chaîne qui stocke le prénom de l'utilisateur.
// - email : une colonne de type chaîne qui stocke l'email de l'utilisateur. Cette colonne est unique.
// - motDePasse : une colonne de type chaîne qui stocke le mot de passe de l'utilisateur.
// - dateNaissance : une colonne de type date qui stocke la date de naissance de l'utilisateur.
// - sexe : une colonne de type chaîne qui stocke le sexe de l'utilisateur.
// - poids : une colonne de type float qui stocke le poids de l'utilisateur.
// - taille : une colonne de type float qui stocke la taille de l'utilisateur.

// 4. Gestion des relations :
// Les relations avec d'autres entités (comme abonnements, séances, messages, réservations) peuvent être définies
// en utilisant les décorateurs @OneToMany, @ManyToOne, etc. Ces relations permettent de lier les utilisateurs à d'autres entités.

// 5. Synchronisation avec la base de données :
// Lorsque l'application est démarrée, TypeORM synchronise automatiquement les entités avec la base de données,
// créant ou mettant à jour les tables en fonction des entités définies.

// En résumé, cette page définit l'entité utilisateur pour votre application NestJS en utilisant TypeORM.
// Elle permet de représenter les utilisateurs dans la base de données et de gérer leurs relations avec d'autres entités.
