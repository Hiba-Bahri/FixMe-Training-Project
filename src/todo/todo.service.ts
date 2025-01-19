import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/Todo';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';

@Injectable()
export class TodoService {

    constructor(
            @InjectRepository(Todo)
            private todoRepository: Repository<Todo>,
        ) {}
    
    async getTodos(userId: number):Promise<Todo[]> {
        return await this.todoRepository.findBy({ user: userId });
    }
    
    async addTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    
        if (!createTodoDto.description) {
            throw new BadRequestException('Fill all the fields');
        }
    
        const createdTodo = this.todoRepository.create(createTodoDto);
    
        return await this.todoRepository.save(createdTodo);
    }
    
    async findTodoById(id: number): Promise<Todo> | null {
        const Todo = await this.todoRepository.findOneBy({ id });
        if (!Todo) {
            throw new NotFoundException('Todo not found');
        }

        return Todo;
    }
    
    async checkTodo(id: number): Promise<Todo> {
    
        const checkedTodo = await this.findTodoById(id);

        checkedTodo.done = !checkedTodo.done; // can unckeck todo too
    
        await this.todoRepository.update(id, checkedTodo);
    
        return this.findTodoById(id);
    }
    
    async deleteTodo(id: number): Promise<string>{
    
        await this.findTodoById(id);
    
        await this.todoRepository.delete(id);

        return 'Todo task deleted';
    }

}
