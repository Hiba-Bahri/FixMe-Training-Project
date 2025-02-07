import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from './../../users/graphql/user.type'; 

@ObjectType()
export class AuthResponse {
  @Field(() => UserType)
  user: UserType;

  @Field(() => String)
  access_token: string;
}
