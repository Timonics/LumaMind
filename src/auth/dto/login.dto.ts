import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginDataDto {
  @IsEmail()
  email: string;

  //@IsStrongPassword()
  password: string;
}
