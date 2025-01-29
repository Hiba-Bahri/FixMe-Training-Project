import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TodoType {
  @Field(() => Int)
  id: number;

  @Field()
  description: string;

  @Field()
  done: boolean;

  @Field()
  timestamp: Date;

  @Field(() => Int)
  user: number;
}
