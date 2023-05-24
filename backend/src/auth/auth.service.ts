import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = user.password === password;

    if (!isValidPassword) throw new UnauthorizedException('Password not valid');

    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
        email: user.email,
      }),
    };
  }

  async signup(email: string, password: string) {
    const userExists = Boolean(
      await this.prisma.user.findUnique({ where: { email } }),
    );
    if (userExists) throw new NotFoundException('User already exists found');

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return {
      accessToken: this.jwtService.sign({
        userId: newUser.id,
        email: newUser.email,
      }),
    };
  }
}
