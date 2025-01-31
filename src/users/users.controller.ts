import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { debug } from 'console';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Post()
    addUser(@Body(ValidationPipe) createUserInput: CreateUserInput) {
        return this.userService.addUser(createUserInput);
    }

    @Get(':id')
    findUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    }

    @Get(':email')
    findUserByEmail(@Param('email') email: string) {
        return this.userService.findUserByEmail(email);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateUserInput: UpdateUserInput) {
        return this.userService.updateUser(id, updateUserInput);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }
}
