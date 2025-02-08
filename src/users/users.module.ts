import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { UsersResolver } from './users.resolver';
import { TodoService } from 'src/todo/todo.service';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports : [TypeOrmModule.forFeature([User]), TodoModule],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
