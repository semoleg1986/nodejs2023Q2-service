import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { users } from 'src/moks';
import { isString } from 'class-validator';

@Injectable()
export class UsersService {
  private users: CreateUserDto[] = [];
  create(createUserDto: CreateUserDto) {
    if (!isString(createUserDto.login) || !isString(createUserDto.password)) {
      throw new HttpException(
        'Login and password must be strings',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.users.push(createUserDto);
    return createUserDto;
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
