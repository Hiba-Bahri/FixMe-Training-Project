import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.input';
import { UserType } from './../users/graphql/user.type'; 
import { CreateUserInput } from 'src/users/dto/create-user.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            validateUser: jest.fn(),
            signup: jest.fn()
        }
        }
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe("login", () => {

    it('should return a JWT and the user when login is successful', async () => {

      const mockToken = 'mocked-jwt-token';
  
      const user: UserType = {
        id: 1,
        name: "Hiba",
        email: "hibabahri@gmail.com",
        password: "password123",
        role: "user",
        todos: []
      }
  
      const response : AuthResponse = {user: user, access_token: mockToken};
  
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);
  
      const result = await resolver.login('hibabahri@gmail.com', 'password123');
      expect(result).toStrictEqual(response);
    });
  
    it('should throw an error when the valdiation fails', async () => {
  
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
  
      await expect(resolver.login('hibabahri@gmail.com', 'wrong' ))
        .rejects
        .toThrow(new Error('Invalid credentials'));
    });
  })

  describe("signup", () => {

    const mockToken = 'mocked-jwt-token';
  
    const userInput: CreateUserInput = {
      name: "Hiba",
      email: "hibabahri@gmail.com",
      password: "password123",
      role: "user",
    }

    const createdUser: UserType = {
      id: 1,
      name: "Hiba",
      email: "hibabahri@gmail.com",
      password: "password123",
      role: "user",
      todos: []
      
    }

    const response : AuthResponse = {user: createdUser, access_token: mockToken};

    it('should return the user and JWT when registering is successful', async () => {
  
      jest.spyOn(authService, 'signup').mockResolvedValue(createdUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);
  
      const result = await resolver.signup(userInput);
      expect(result).toStrictEqual(response);
    });
  
    it('should throw an error when signup service fails', async () => {
  
      jest.spyOn(authService, 'signup').mockRejectedValue(new Error("Service Error"));
  
      await expect(resolver.signup(userInput))
        .rejects
        .toThrow("Service Error");
        expect(authService.login).not.toHaveBeenCalled();
    });

  })

});
