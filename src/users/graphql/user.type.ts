import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TodoType } from '../../todo/graphql/todo.type';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
  
  @Field(() => [TodoType], { nullable: true })
  todos: TodoType[];
}
