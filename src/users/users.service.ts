import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { users } from 'src/moks';
import { isString, isUUID } from 'class-validator';
import { User } from './entities/user.entity';
// import { DatabaseService } from 'src/database/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // private users: User[] = [];
  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!isString(createUserDto.login) || !isString(createUserDto.password)) {
      throw new HttpException(
        'Login and password must be strings',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser: User = {
      ...createUserDto,
      id: uuid4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    // DatabaseService.users.push(newUser);
    // return newUser;
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    // return DatabaseService.users;
    return await this.userRepository.find();
  }

  isValidUserId(id: string): boolean {
    return isUUID(id, 'all');
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository
      .findOne({ where: { id: id } })
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      })
      .catch((error) => {
        console.error('Error while fetching user:', error.message);
        throw error;
      });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isString(updateUserDto.newPassword)) {
      throw new BadRequestException('Invalid dto');
    }
    // const user = DatabaseService.users.find((user) => user.id === id);

    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.password === updateUserDto.oldPassword) {
        user.password = updateUserDto.newPassword;
        user.version++;
        user.updatedAt = Date.now();
        return await this.userRepository.save(user);
      } else {
        throw new ForbiddenException('Old password is wrong');
      }
    } catch (error) {
      console.error('Error while updating user:', error.message);
      throw error;
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);

    return user;
  }
}
