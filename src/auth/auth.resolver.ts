import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from './../users/dto/create-user.input';
import { AuthResponse } from './dto/auth-response.input';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './guards/constants';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, 
    private readonly userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    
  }


  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx
  ) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.authService.login(user);

    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { accessToken, user };
  }


    @Mutation(() => AuthResponse)
    async refreshToken(@Context() ctx) {
      const constants = jwtConstants(this.configService);
      const refreshToken = ctx.req.cookies.refreshToken;
      if (!refreshToken) throw new Error("No refresh token provided");
  
      try {
        const payload: any = this.jwtService.verify(refreshToken, { secret: constants.refreshTokenSecret });
        const user = await this.userService.getUserIfRefreshTokenMatches(payload.sub, refreshToken);
  
        if (!user) throw new Error("Invalid refresh token");
  
        const newAccessToken = this.jwtService.sign({ sub: user.id }, { secret: constants.accessTokenSecret, expiresIn: constants.accessTokenExpiration });
        console.log("-------new------",newAccessToken)
        return { accessToken: newAccessToken, user };
      } catch (err) {
        throw new Error("Refresh token expired or invalid");
      }
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Mutation(() => Boolean)
    async logout(@Context() ctx) {
      const constants = jwtConstants(this.configService);
      const refreshToken = ctx.req.cookies.refreshToken;
      if (!refreshToken) return true;
  
      try {
        const payload: any = this.jwtService.verify(refreshToken, { secret: constants.refreshTokenSecret});
        await this.userService.removeRefreshToken(payload.sub);
      } catch (err) {
        console.log("Invalid refresh token");
      }
  
      ctx.res.clearCookie('refreshToken');
      return true;
    }
  

  @Mutation(() => AuthResponse)
  async signup(@Args('data') createUserInput: CreateUserInput, @Context() ctx) {

    const user = await this.authService.signup(createUserInput);
    const { accessToken, refreshToken } = await this.authService.login(user);


    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { accessToken, user };
  }
  
  
}
