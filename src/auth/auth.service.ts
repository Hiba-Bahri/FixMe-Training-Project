import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './guards/constants';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      console.log("--------------",await bcrypt.compare(password, user.password));

      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const constants = jwtConstants(this.configService);

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: constants.refreshTokenSecret,
      expiresIn: constants.refreshTokenExpiration,
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signup(createUserInput: CreateUserInput) {
     createUserInput.password = await bcrypt.hash(createUserInput.password, 10);
    return this.usersService.addUser(createUserInput);
  }
}
