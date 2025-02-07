import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NonEmptyUpdatePipe } from './pipes/non-empty-update.pipe';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getUsers: jest.fn(),
    addUser: jest.fn(),
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {

    it('should throw an exception when UserService.getUsers fails', async () => {

      jest.spyOn(usersService, 'getUsers').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.getUsers()).rejects.toThrow('Service error');

      expect(usersService.getUsers).toHaveBeenCalled();

    });

    it('should call UsersService.getUsers and return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: "Hiba",
          email: "hibabahri@gmail.com",
          password: "random password",
          role: "user",
          todos: []
        },
        {
          id: 2,
          name: "Hiba",
          email: "hibabahri123@gmail.com",
          password: "random password",
          role: "user",
          todos: []
        }
      ];
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(mockUsers);

      const result = await controller.getUsers();

      expect(usersService.getUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('addUser', () => {

        it('should throw a BadRequestException for invalid CreateUserInput', async () => {
          const invalidCreateUserInput = {};
          const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    
          await expect(
            validationPipe.transform(invalidCreateUserInput, {
              type: 'body',
              metatype: CreateUserInput,
            }),
          ).rejects.toThrow(BadRequestException);
        });
    
        it('should pass validation for valid CreateUserInput', async () => {
          const validCreateUserInput : CreateUserInput = {         
            name: 'Hiba Bahri', 
            email: "hibabahri@gmail.com", 
            password: "random password",
            role: "user",
          };
    
          const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    
          const result = await validationPipe.transform(validCreateUserInput, {
            type: 'body',
            metatype: CreateUserInput,
          });
    
          expect(result).toEqual(validCreateUserInput);
        });

        it('should throw an exception when UsersService.addUser fails', async () => {
          const createUserInput: CreateUserInput = { name: 'Hiba Bahri', email: "hibabahri@gmail.com", password: "random password", role: "user", };

  
          jest.spyOn(usersService, 'addUser').mockRejectedValue(new Error('Service error'));
      
          await expect(controller.addUser(createUserInput)).rejects.toThrow('Service error');
          expect(usersService.addUser).toHaveBeenCalledWith(createUserInput);
        });  

    it('should call UsersService.addUser with the correct body and return the created user', async () => {
      const createUserInput: CreateUserInput = { name: 'Hiba Bahri', email: "hibabahri@gmail.com", password: "random password", role: "user", };
      const mockUser = { id: 1, ...createUserInput, todos: [] };
      jest.spyOn(usersService, 'addUser').mockResolvedValue(mockUser);

      const result = await controller.addUser(createUserInput);

      expect(usersService.addUser).toHaveBeenCalledWith(createUserInput);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUser', () => {

    it('should throw an exception when UsersService.findUserById fails', async () => {

      jest.spyOn(usersService, 'findUserById').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.findUserById(1)).rejects.toThrow('Service error');

      expect(usersService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should call UsersService.findUserById with the user id and return the matching user', async () => {
      const mockUser = { id: 1, name: 'Hiba Bahri', email: "hibabahri@gmail.com", todos: [], password: "random password", role: "user", };
      jest.spyOn(usersService, 'findUserById').mockResolvedValue(mockUser);

      const result = await controller.findUserById(1);

      expect(usersService.findUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw an exception when UsersService.findUserByEmail fails', async () => {

      const useremail = "hibabahri@gmail.com"

      jest.spyOn(usersService, 'findUserByEmail').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.findUserByEmail(useremail)).rejects.toThrow('Service error');

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(useremail);
    });

    it('should call UsersService.findUserByEmail with the user id and return the matching user', async () => {

      const mockUser = { id: 1, name: 'Hiba Bahri', email: "hibabahri@gmail.com", todos: [], password: "random password", role: "user", };
      const useremail = "hibabahri@gmail.com"

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser);

      const result = await controller.findUserByEmail(useremail);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(useremail);
      expect(result).toEqual(mockUser);
    });

  });

  describe('updateUser', () => {

    

    it('should throw BadRequestException if updateUserInput is empty', () => {
      const pipe = new NonEmptyUpdatePipe();
      const invalidUpdateUserInput = {};
    
      expect(() => pipe.transform(invalidUpdateUserInput, { type: 'body', metatype: UpdateUserInput }))
        .toThrow(new BadRequestException('At least one field must be updated'));
    });
    

    it('should throw a BadRequestException for invalid UpdateUserInput', async () => {
      const invalidUpdateUserInput = { email: 'invalid-email' };
      const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    
      await expect(
        validationPipe.transform(invalidUpdateUserInput, {
          type: 'body',
          metatype: UpdateUserInput,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an exception when UsersService.updateUser fails', async () => {

      const updateUserInput : UpdateUserInput = { name: "Hiba", email: "hibabahri@gmail.com" };
      const userId = 1;

      jest.spyOn(usersService, 'updateUser').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.updateUser(userId, updateUserInput)).rejects.toThrow('Service error');
      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserInput);
    });


    it('should call UsersService.updateUser with the correct parameters and return the result', async () => {
      const updateUserInput: UpdateUserInput = { name: 'Hiba Bahri', email: "hibabahri@gmail.com" };
      const userId = 1;

      jest.spyOn(usersService, 'updateUser').mockResolvedValue("User updated successfully");

      const result = await controller.updateUser(userId, updateUserInput);

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserInput);
      expect(result).toEqual("User updated successfully");
    });
  });

  describe('deleteUser', () => {

  it('should throw an exception when UsersService.deleteUser fails', async () => {

      const userId = 1;

      jest.spyOn(usersService, 'deleteUser').mockRejectedValue(new Error('Service error'));
  
      await expect(controller.deleteUser(userId)).rejects.toThrow('Service error');
      expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should call UsersService.deleteUser with the correct parameter and return the result', async () => {
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue("User deleted successfully");

      const result = await controller.deleteUser(1);

      expect(usersService.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual("User deleted successfully");
    });
  });

});
