import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { AuthResponse } from './dto/auth-response.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse) 
  async login(@Args('email') email: string, @Args('password') password: string): Promise<AuthResponse> {
    const user = await this.authService.validateUser(email, password); 
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const access_token = await this.authService.login(user); 
    return { user, access_token }; 
  }
  

  @Mutation(() => AuthResponse)
  async signup(@Args('data') createUserInput: CreateUserInput) {

    const user = await this.authService.signup(createUserInput);
    const access_token = await this.authService.login(user);
    return {
      user,
      access_token,
      };
  }
  
  
}
