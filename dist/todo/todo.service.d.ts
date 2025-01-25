import { Todo } from './entities/Todo';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo-dto';
export declare class TodoService {
    private todoRepository;
    constructor(todoRepository: Repository<Todo>);
    getTodos(userId: number): Promise<Todo[]>;
    addTodo(createTodoDto: CreateTodoDto): Promise<Todo>;
    findTodoById(id: number): Promise<Todo>;
    checkTodo(id: number): Promise<string>;
    deleteTodo(id: number): Promise<string>;
}
