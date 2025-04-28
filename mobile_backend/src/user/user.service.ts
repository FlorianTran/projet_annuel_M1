import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common'; // Ajouter cette ligne en haut de ton fichier

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Vérifier si un autre utilisateur avec le même email existe
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: updateUserDto.email,
      },
    });

    // Si l'email est trouvé et que ce n'est pas le même utilisateur
    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('Email déjà utilisé.');
    }

    // Si aucune erreur, mettre à jour l'utilisateur
    await this.usersRepository.update(id, updateUserDto);
    
    // Vérifier si l'utilisateur mis à jour existe, sinon lever une exception
    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new Error('Utilisateur non trouvé après la mise à jour.');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}

