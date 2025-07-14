import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class SalleDeSport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  ville: string;

  @Column()
  codePostal: string;

  @OneToMany(() => User, (user) => user.salleDeSport)
  users: User[];
}
