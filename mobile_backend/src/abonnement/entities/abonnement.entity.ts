import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from '../../user/entities/user.entity';
  import { Paiement } from 'src/paiement/entities/paiement.entity';
  
  export enum TypeAbonnement {
    MENSUEL = 'mensuel',
    ANNUEL = 'annuel',
    SEANCE = 'séance',
  }
  
  @Entity()
  export class Abonnement {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'enum', enum: TypeAbonnement })
    type: TypeAbonnement;
  
    @Column('date')
    dateDebut: Date;
  
    @Column('date')
    dateFin: Date;
  
    @Column('decimal')
    prix: number;
  
    @ManyToOne(() => User, (user) => user.abonnements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'utilisateurId' })
    user: User;

    @OneToMany(() => Paiement, (paiement) => paiement.abonnement)
    paiements: Paiement[];
    

  }
  