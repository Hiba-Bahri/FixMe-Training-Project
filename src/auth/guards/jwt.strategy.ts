import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log("JWT_SECRET:", secret);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
  
    if (!payload) {
      console.log("No payload found in JWT!");
      throw new UnauthorizedException();
    }
  
    const user = await this.usersService.findUserById(payload.sub);
    
    if (!user) {
      console.log("User not found in database!");
      throw new UnauthorizedException();
    }
  
    console.log("User authenticated:");
    return user;
  }
  
}
