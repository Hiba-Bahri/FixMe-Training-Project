import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/Todo';
import { TodoResolver } from './todo.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],  
  providers: [TodoService, TodoResolver],
  controllers: [TodoController],
  exports: [TodoService]
})
export class TodoModule {}
