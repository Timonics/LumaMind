import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany();
  }
  async findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByEmailAndId(email: string, id: number) {
    return await this.prismaService.user.findFirst({
      where: {
        id,
        email,
      },
    });
  }

  async create(userData: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data: {
        ...userData,
        role: userData.role ?? 'USER',
      },
    });
  }

  async delete(id: number) {
    return await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
