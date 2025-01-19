import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/User';
import { debug } from 'console';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getUsers():Promise<User[]> {
        return await this.userRepository.find();
    }

    async addUser(createUserDto: CreateUserDto): Promise<User> {

        if (!createUserDto.name || !createUserDto.email) {
            throw new BadRequestException('Fill all the fields');
        }

        const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });

        if (userExists) {
            throw new ConflictException('A user with this email already exists');
        }

        const createdUser = this.userRepository.create(createUserDto);

        return await this.userRepository.save(createdUser);
    }

    async findUserById(id: number): Promise<User> | null {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findUserByEmail(email: string): Promise<User> | null {
        const user =  await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {

        await this.findUserById(id);


        if (updateUserDto.email) {    
            const emailExists = await this.userRepository.findOne({
                where: { email: updateUserDto.email, id: Not(id) },
            });     

            if (emailExists) {
                throw new ConflictException('A user with this email already exists');
            }
        }

        await this.userRepository.update(id, updateUserDto);

        return this.findUserById(id);
    }

    async deleteUser(id: number): Promise<string>{

        await this.findUserById(id);

        await this.userRepository.delete(id);

        return "User deleted successfully";
    }

}
