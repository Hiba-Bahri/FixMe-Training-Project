import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoType } from './graphql/todo.type';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { User } from 'src/users/entities/User';

@Resolver(() => TodoType)
export class TodoResolver {

    constructor(private readonly todoService: TodoService) {}

    @Query(() => [TodoType])
    @Roles('user')
    @UseGuards(GqlAuthGuard, RolesGuard)
    async todos(@CurrentUser() user: User) {
      
      if (!user) {
        throw new UnauthorizedException("User not found in request!");
      }
    
      return this.todoService.getTodos(user.id); 
    }
    

    @Query(() => TodoType)
    @Roles('user')
    @UseGuards(GqlAuthGuard, RolesGuard)
    async todoById(@Args('id', { type: () => Int }) id: number) {
        return this.todoService.findTodoById(id);
    }

    @Mutation(() => TodoType)
    @Roles('user')
    @UseGuards(GqlAuthGuard, RolesGuard)
    async createTodo(@Args('data') createTodoInput: CreateTodoInput,
    ): Promise<TodoType>{
        return this.todoService.addTodo(createTodoInput);
    }

    @Mutation(() => String)
     @Roles('user')
    @UseGuards(GqlAuthGuard, RolesGuard)
    async updateTodo(@Args('id', {type: () => Int}) id: number,
    ): Promise<String> {
        return this.todoService.checkTodo(id);
    }

    @Query(() => String)
    @Roles('user')
    @UseGuards(GqlAuthGuard, RolesGuard)
    async deleteTodo(@Args ('id', {type: () => Int}) id: number) {
        return this.todoService.deleteTodo(id);
    }

}
