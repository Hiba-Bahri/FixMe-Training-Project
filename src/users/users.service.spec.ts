import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Not, Repository } from 'typeorm';
import { User } from './entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    find: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addUser', () => {

    it('should throw ConflictException if a user with the email already exists', async () => {
      const createUserDto = {
        name: 'Hiba',
        email: 'hibabahri@gmail.com',
      };
      const userExists = {
        id: 1,
        ...createUserDto,
      };
  
      mockUserRepository.findOneBy.mockResolvedValue(userExists);
  
      await expect(service.addUser(createUserDto)).rejects.toThrow(
        new ConflictException('A user with this email already exists')
      );
  
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Hiba',
        email: 'hibabahri@gmail.com',
      };
      const createdUser = {
        id: 1,
        ...createUserDto,
      };
  
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);
  
      expect(await service.addUser(createUserDto)).toEqual(createdUser);
  
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
  
      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
  
  });
  

  describe('findUserById', () => {

    it('should throw an error if user not found', async () => {

      mockUserRepository.findOneBy.mockReturnValue(null);

      expect(service.findUserById(2)).rejects.toThrow(new NotFoundException('User not found'));

    });

    it('should return a user if found', async () => {
      const user = {
        id: 1,
        name: "Hiba",
        email: "hibabahri@gmail.com"
      }

      mockUserRepository.findOneBy.mockReturnValue(user);

      expect(await service.findUserById(user.id)).toEqual(user);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

  });

  describe('findUserByEmail', () => {

    it('should throw an error if user not found', async () => {
      
      mockUserRepository.findOneBy.mockReturnValue(null);

      expect(service.findUserByEmail("aymen@gmail.com")).rejects.toThrow(new NotFoundException('User not found'));

    });

    it('should return a user if found', async () => {
      const user = {
        id: 1,
        name: "Hiba",
        email: "hibabahri@gmail.com"
      }

      mockUserRepository.findOneBy.mockReturnValue(user);

      expect(await service.findUserByEmail(user.email)).toEqual(user);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

  });

  describe('updateUser', () => {
    
    it('should throw an error when updating if user not found', async () => {
      const updateUserDto = { name: "Hiba", email: "hibabahri@gmail.com" };
      const userId = 1;
    
      jest.spyOn(service, 'findUserById').mockRejectedValue(new NotFoundException('User not found'));
    
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      
      expect(service.findUserById).toHaveBeenCalledWith(userId);
      
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
    

    it('should throw ConflictException if email already exists for another user', async () => {
      const updateUserDto = { name: 'Hiba', email: 'hibabahri@gmail.com' };
      const existingUser = {id:2, name: 'HibaBahri', email: 'hibabahri@gmail.com' };
      const oldUser = { id: 1, name: 'Hiba', email: 'hibabahri447@gmail.com'};

      jest.spyOn(service, 'findUserById').mockResolvedValue(oldUser as User);
  
      mockUserRepository.findOne.mockResolvedValue(existingUser);
  
      await expect(service.updateUser(1, updateUserDto)).rejects.toThrow(new ConflictException('A user with this email already exists'));
  
      expect(service.findUserById).toHaveBeenCalledWith(oldUser.id);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: updateUserDto.email, id: Not(oldUser.id) },
      });
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should update a user if no conflicts exist', async () => {
      const updateUserDto = { name: 'Hiba', email: 'hibabahri@gmail.com' };
      const oldUser = { id: 1, name: 'Hiba', email: 'hibabahri447@gmail.com'};
  
      jest.spyOn(service, 'findUserById').mockResolvedValue(oldUser as User);
  
      mockUserRepository.findOne.mockResolvedValue(null);
  
      mockUserRepository.update.mockResolvedValue(null);
    
      const result = await service.updateUser(oldUser.id, updateUserDto);

      expect(result).toEqual("User updated successfully");

      expect(service.findUserById).toHaveBeenCalledWith(oldUser.id); 
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: updateUserDto.email, id: Not(oldUser.id) },
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateUserDto);
    });

  });

  describe("deleteUser", () => {
    it('should throw an error when deleting if user not found', async () => {
      const userId = 1;
    
      jest.spyOn(service, 'findUserById').mockRejectedValue(new NotFoundException('User not found'));
    
      await expect(service.deleteUser(userId)).rejects.toThrow(NotFoundException);
      
      expect(service.findUserById).toHaveBeenCalledWith(userId);
      
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete user succesfully', async () => {
      const user = { id: 1, name: 'Hiba', email: 'hibabahri447@gmail.com'};

      jest.spyOn(service, 'findUserById').mockResolvedValue(user as User);
    
      mockUserRepository.delete.mockResolvedValue(null);
    
      const result = await service.deleteUser(user.id);

      expect(result).toEqual("User deleted successfully");

      expect(service.findUserById).toHaveBeenCalledWith(user.id); 
      expect(mockUserRepository.delete).toHaveBeenCalledWith(user.id);
    });

  });
});