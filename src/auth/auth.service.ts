import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { User } from 'src/users/interfaces/user.interface';
import { Prisma } from 'generated/prisma';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User does not exist');
    }
    if (user && compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>): Promise<{ access_token: string }> {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: Prisma.UserCreateInput): Promise<{ access_token: string }> {
    const { email, password } = user;
    const userExists = await this.userRepo.findByEmail(email);
    if (userExists) {
      throw new Error('User already Exists');
    }
    const hashedPassword = hashSync(password, 10);
    const newUser = {
      ...user,
      password: hashedPassword,
    };
    await this.userRepo.create(newUser);
    return this.login(newUser);
  }
}
