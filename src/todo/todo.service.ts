import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/Todo';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { CreateTodoInput} from './dto/create-todo.input';

@Injectable()
export class TodoService {

    constructor(
            @InjectRepository(Todo)
            private todoRepository: Repository<Todo>,
        ) {}
    
    async getTodos(userId: number):Promise<Todo[]> {
        return await this.todoRepository.findBy({ user: userId });
    }
    
    async addTodo(createTodoInput: CreateTodoInput): Promise<Todo> {
    
        const createdTodo = this.todoRepository.create(createTodoInput);
    
        return await this.todoRepository.save(createdTodo);
    }
    
    async findTodoById(id: number): Promise<Todo>{
        const Todo = await this.todoRepository.findOneBy({ id });
        if (!Todo) {
            throw new NotFoundException('Todo not found');
        }

        return Todo;
    }
    
    async checkTodo(id: number): Promise<string> {
    
        const checkedTodo = await this.findTodoById(id);

        checkedTodo.done = !checkedTodo.done; // can unckeck todo too
    
        await this.todoRepository.update(id, checkedTodo);
    
        return "Todo task updated successfully";
    }
    
    async deleteTodo(id: number): Promise<string>{
    
        await this.findTodoById(id);
    
        await this.todoRepository.delete(id);

        return 'Todo task deleted';
    }

}
