import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UserType } from './../users/graphql/user.type';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            addUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        name: "Hiba Bahri",
        email: 'hibabahri@gmail.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        todos: []
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser);
      //jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('hibabahri@gmail.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should throw an UnauthorizedException when credentials are invalid', async () => {
      const mockUser = {
        id: 1,
        name: "Hiba Bahri",
        email: 'hibabahri@gmail.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        todos: []
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser);

      //jest.spyOn(bcrypt, "compare").mockResolvedValue(Promise.resolve(false));

      await expect(authService.validateUser('hibabahri@gmail.com', 'password'))
        .rejects
        .toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const mockUser = { id: 1, email: 'hibabahri@gmail.com', role: 'user' };

      const token = await authService.login(mockUser);

      expect(token).toBe('mocked-jwt-token');

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
  });

  describe('signup', () => {
    it('should hash the password and call addUser and be added successfully', async () => {

      const createUserInput: CreateUserInput = {
        name: 'Hiba Bahri',
        email: 'hibabahri@gmail.com',
        password: 'password123',
        role: "user"
      };

      const createdUser: UserType = { id: 1, ...createUserInput, todos:[] }

      const hashedPassword = await bcrypt.hash('password123', 10);

      //jest.spyOn(bcrypt, 'hash').mockResolvedValue(Promise.resolve(hashedPassword));
      jest.spyOn(usersService, 'addUser').mockResolvedValue(createdUser);

      const result = await authService.signup(createUserInput);

      expect(result).toEqual(createUserInput);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersService.addUser).toHaveBeenCalledWith({
        email: 'hibabahri@gmail.com',
        password: hashedPassword,
      });
    });

    it('should fail to add the user due to userService.addUser failure', async () => {

      const createUserInput: CreateUserInput = {
        name: 'Hiba Bahri',
        email: 'hibabahri@gmail.com',
        password: 'password123',
        role: "user"
      };

      const hashedPassword = await bcrypt.hash('password123', 10);

      //jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(usersService, 'addUser').mockRejectedValue(new Error("Service Error"));

      const result = await authService.signup(createUserInput);

      expect(result).rejects.toThrow("Service Error");
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    });

  });
});
