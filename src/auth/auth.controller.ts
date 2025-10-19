import {
  Body,
  Controller,
  NotAcceptableException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/login.dto';
import { RegisterDataDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';

@Controller(`${process.env.api}auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: LoginDataDto) {
    const { email, password } = loginData;
    const validatedUser = await this.authService.validateUser(email, password);
    if (!validatedUser) {
      throw new NotAcceptableException('Invalid credentials');
    }
    return this.authService.login(validatedUser);
  }

  @Post('register')
  async register(@Body() registerData: RegisterDataDto) {
    return await this.authService.register(registerData);
  }
}
