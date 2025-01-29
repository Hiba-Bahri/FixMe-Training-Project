import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoType } from './graphql/todo.type';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo-dto';

@Resolver(() => TodoType)
export class TodoResolver {

    constructor(private readonly todoService: TodoService) {}

    @Query(() => [TodoType])
    async todos(@Args('user', { type: () => Int }) user: number) {
      return this.todoService.getTodos(user);
    }

    @Query(() => TodoType)
    async todoById(@Args('id', { type: () => Int }) id: number) {
        return this.todoService.findTodoById(id);
    }

    @Mutation(() => TodoType)
    async createTodo(@Args('data') createTodoDTO: CreateTodoDto,
    ): Promise<TodoType> {
        return this.todoService.addTodo(createTodoDTO);
    }

    @Mutation(() => String)
    async updateTodo(@Args('id', {type: () => Int}) id: number,
    ): Promise<String> {
        return this.todoService.checkTodo(id);
    }

    @Query(() => String)
    async deleteTodo(@Args ('id', {type: () => Int}) id: number) {
        return this.todoService.deleteTodo(id);
    }

}
