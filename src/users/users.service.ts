import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {

    users = [
        {id: 1, name: 'John', email: 'jhon@gmail.com'}, 
        {id: 2, name: 'Doe', email: 'doe@gmail.com'},
    ];

    getUsers() {
        return this.users;
    }

    addUser(createUserDto: CreateUserDto) {

        if (!createUserDto.name || !createUserDto.email) {
            throw new BadRequestException('Fill all the fields');
        }

        const userExists = this.users.some(user => user.email === createUserDto.email);

        if (userExists) {
            throw new ConflictException('A user with this email already exists');
        }

        const orderedList = [...this.users].sort((a, b) => +b.id - +a.id);
        let id = orderedList[0].id+1;
        const newUser = {id, ...createUserDto};
        this.users.push(newUser);
        return 'User is added';
    }

    findUser(id: number) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    updateUser(id: number, updateUserDto: UpdateUserDto) {

        this.findUser(id);


        if (updateUserDto.email) {    
            const emailExists = this.users.some(user => user.email === updateUserDto.email && user.id !== id);
        
            if (emailExists) {
                throw new ConflictException('A user with this email already exists');
            }
        }

        this.users = this.users.map(user => 
            user.id === id ? {...user, ...updateUserDto} : user
        );

        return this.findUser(id);
    }

    deleteUser(id: number) {

        this.findUser(id);

        this.users = this.users.filter(user => user.id !== id);
        return 'User deleted';
    }

}
