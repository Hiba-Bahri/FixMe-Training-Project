import { CreateTodoDto } from './dto/create-todo-dto';
import { TodoService } from './todo.service';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    getTodos(userId: number): Promise<import("./entities/Todo").Todo[]>;
    addTodo(createTodoDto: CreateTodoDto): Promise<import("./entities/Todo").Todo>;
    checkTodo(id: number): Promise<string>;
    deleteTodo(id: number): Promise<string>;
}
