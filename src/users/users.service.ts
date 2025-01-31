import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
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

    async addUser(createUserInput: CreateUserInput): Promise<User> {

        const userExists = await this.userRepository.findOneBy({ email: createUserInput.email });

        if (userExists) {
            throw new ConflictException('A user with this email already exists');
        }

        const createdUser = this.userRepository.create(createUserInput);

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

    async updateUser(id: number, updateUserInput: UpdateUserInput): Promise<String> {

        await this.findUserById(id);


        if (updateUserInput.email) {    
            const emailExists = await this.userRepository.findOne({
                where: { email: updateUserInput.email, id: Not(id) },
            });     

            if (emailExists) {
                throw new ConflictException('A user with this email already exists');
            }
        }

        await this.userRepository.update(id, updateUserInput);

        return "User updated successfully";
    }

    async deleteUser(id: number): Promise<string>{

        await this.findUserById(id);

        await this.userRepository.delete(id);

        return "User deleted successfully";
    }

}
