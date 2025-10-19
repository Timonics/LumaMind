import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller(`users`)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findOne(+id);
  }

  @Get('me')
  async profile(@CurrentUser() user: User) {
    return await this.userService.findOne(user.id!);
  }

  @Roles('ADMIN')
  @Delete('user/:id')
  async delete(@Param() id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.userService.delete(id);
    return `User ${user.name} with id of ${user.id} has been deleted`;
  }
}
