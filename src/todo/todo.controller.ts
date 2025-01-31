import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {

    constructor(private readonly todoService: TodoService) {}
    
        @Get(":userId")
        getTodos(@Param('userId', ParseIntPipe) userId: number) {
            return this.todoService.getTodos(userId);
        }
    
        @Post()
        addTodo(@Body(ValidationPipe) createTodoDto: CreateTodoInput) {
            return this.todoService.addTodo(createTodoDto);
        }
    
        @Patch(':id')
        checkTodo(@Param('id', ParseIntPipe) id: number) {
            return this.todoService.checkTodo(id);
        }
    
        @Delete(':id')
        deleteTodo(@Param('id', ParseIntPipe) id: number) {
            return this.todoService.deleteTodo(id);
        }
}
