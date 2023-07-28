import { isString } from 'class-validator';

export class CreateUserDto {
  login: string;
  password: string;
}
