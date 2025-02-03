import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoType } from './graphql/todo.type';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => TodoType)
export class TodoResolver {

    constructor(private readonly todoService: TodoService) {}

    @Query(() => [TodoType])
    @UseGuards(GqlAuthGuard)
    async todos(@Context() context) {
      const user = context.req.user;
      
      if (!user) {
        throw new UnauthorizedException("User not found in request!");
      }
    
      return this.todoService.getTodos(user.userId); 
    }
    

    @Query(() => TodoType)
    @UseGuards(GqlAuthGuard)
    async todoById(@Args('id', { type: () => Int }) id: number) {
        return this.todoService.findTodoById(id);
    }

    @Mutation(() => TodoType)
    @UseGuards(GqlAuthGuard)
    async createTodo(@Args('data') createTodoInput: CreateTodoInput,
    ): Promise<TodoType>{
        return this.todoService.addTodo(createTodoInput);
    }

    @Mutation(() => String)
    @UseGuards(GqlAuthGuard)
    async updateTodo(@Args('id', {type: () => Int}) id: number,
    ): Promise<String> {
        return this.todoService.checkTodo(id);
    }

    @Query(() => String)
    @UseGuards(GqlAuthGuard)
    async deleteTodo(@Args ('id', {type: () => Int}) id: number) {
        return this.todoService.deleteTodo(id);
    }

}
