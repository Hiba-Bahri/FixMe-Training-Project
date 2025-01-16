import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {

    users = [];

    @Get()
    getUsers(@Query('role') role?: 'ADMIN' | 'STAFF') {
        if (role === 'ADMIN') {
            return this.users;
        }
        return 'You are not authorized to view users';
    }

    @Post()
    addUser(@Body() user: {id :String}) {
        this.users.push(user.id);
        return 'User is added';
    }

    @Get(':id')
    findUser(@Param('id') id: String) {
        return this.users.find(user => user === id) || 'User not found';
    }

    @Patch(':id')
    updateUser(@Param('id') id: String, @Body() user: {id: String}) {
        this.users.fill(user.id, this.users.indexOf(id));
        return this.users;
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string ) {
        return this.users.splice(this.users.indexOf(id), 1);
    }
}
