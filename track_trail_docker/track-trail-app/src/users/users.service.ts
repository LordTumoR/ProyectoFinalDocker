import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './users.entity';
@Injectable()
export class UsersService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getAllUser(xml?: string): Promise<User[] | string> {
    const users = await this.usersRepository.find();
    if (xml === 'true') {
      const jsonformatted = JSON.stringify({
        users,
      });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    } else {
      return users;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const usuario = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(usuario);
  }
  async getUser(id_user: number, xml?: string): Promise<User | string | null> {
    const user = await this.usersRepository.findOneBy({ id_user });

    if (user != null) {
      if (xml == 'true') {
        const jsonformatted = JSON.stringify(user);
        return this.utilsService.convertJSONtoXML(jsonformatted);
      } else {
        return user;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id_user: updateUserDto.id_user },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }


    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async deleteUser(id_user: number): Promise<void> {
    await this.usersRepository.delete(id_user);
  }
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return null;
  }
  
}
