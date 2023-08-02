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
import { DatabaseService } from 'src/database/database';

@Injectable()
export class UsersService {
  // private users: User[] = [];
  create(createUserDto: CreateUserDto): User {
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
    DatabaseService.users.push(newUser);
    return newUser;
  }

  findAll() {
    return DatabaseService.users;
  }

  isValidUserId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string): User | undefined {
    return DatabaseService.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    if (!isString(updateUserDto.newPassword)) {
      throw new BadRequestException('Invalid dto');
    }
    const user = DatabaseService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password === updateUserDto.oldPassword) {
      user.password = updateUserDto.newPassword;
      user.version++;
      user.updatedAt = Date.now();
      return user;
    } else {
      throw new ForbiddenException('Old password is wrong');
    }
  }

  remove(id: string) {
    const user = DatabaseService.users.find((user) => user.id === id);
    const userIndex = DatabaseService.users.findIndex((user) => user.id === id);
    if (user) {
      DatabaseService.users.splice(userIndex, 1);
    }
  }
}
