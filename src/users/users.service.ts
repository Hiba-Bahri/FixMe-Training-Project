import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    users = [
        {id: 1, name: 'John'}, 
        {id: 2, name: 'Doe'},
        {id: 3, name: 'Doe'}
    ];

    getUsers() {
        return this.users;
    }

    addUser(user: {name: string}) {
        const orderedList = [...this.users].sort((a, b) => +b.id - +a.id);
        let id = orderedList[0].id+1;
        const newUser = {id, ...user};
        this.users.push(newUser);
        return 'User is added';
    }

    findUser(id: string) {
        return this.users.find(user => user.id === +id) || 'User not found';
    }

    updateUser(id: string, newUser: {name?: string}) {
        this.users = this.users.map(user => {
            if(user.id === +id)
                return {...user, ...newUser};
            return user;
        });
        return this.findUser(id);
    }

    deleteUser(id: string ) {
        const user = this.findUser(id);
        if (user === 'User not found') {
            return "User not found";
        }

        return this.users = this.users.filter(user => user.id !== +id);
    }

}
