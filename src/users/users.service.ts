import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { users } from 'src/moks';
import { isString } from 'class-validator';
import { User } from './entities/user.entity';
import { version } from 'os';

@Injectable()
export class UsersService {
  private users: CreateUserDto[] = [];
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
