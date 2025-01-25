import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("./entities/User").User[]>;
    addUser(createUserDto: CreateUserDto): Promise<import("./entities/User").User>;
    findUser(id: number): Promise<import("./entities/User").User>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<String>;
    deleteUser(id: number): Promise<string>;
}
