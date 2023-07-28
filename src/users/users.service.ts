import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { users } from 'src/moks';
import { isString, isUUID } from 'class-validator';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
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
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  isValidUserId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.users.find((user) => user.id === id);
    if (!isString(updateUserDto.newPassword)) {
      throw new BadRequestException('Invalid dto');
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
