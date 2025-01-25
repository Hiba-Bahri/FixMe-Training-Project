import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo-dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {

    constructor(private readonly todoService: TodoService) {}
    
        @Get(":userId")
        getTodos(@Param('userId', ParseIntPipe) userId: number) {
            return this.todoService.getTodos(userId);
        }
    
        @Post()
        addTodo(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
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
