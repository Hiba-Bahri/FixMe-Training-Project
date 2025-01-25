import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Repository } from 'typeorm';
import { User } from './entities/User';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUsers(): Promise<User[]>;
    addUser(createUserDto: CreateUserDto): Promise<User>;
    findUserById(id: number): Promise<User> | null;
    findUserByEmail(email: string): Promise<User> | null;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<String>;
    deleteUser(id: number): Promise<string>;
}
