import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Post()
    addUser(@Body() user: {name :string}) {
            return this.userService.addUser(user);
    }

    @Get(':id')
    findUser(@Param('id') id: string) {
        return this.userService.findUser(id);
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() newUser: {name?: string}) {
        return this.userService.updateUser(id, newUser);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
