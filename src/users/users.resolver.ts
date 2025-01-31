import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './graphql/user.type';
import { UpdateUserInput } from './dto/update-user.input';


@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserType])
  async users() {
    return this.usersService.getUsers();
  }

  @Query(() => UserType)
  async userById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findUserById(id);
  }

  @Query(() => UserType)
  async userByEmail(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('data') createUserINPUT: CreateUserInput,
  ): Promise<UserType> {
    return this.usersService.addUser(createUserINPUT);
  }

  @Mutation(() => String)
  async updateUser(
    @Args('id', {type: () => Int}) id: number,
    @Args('data') updateUserINPUT: UpdateUserInput,
  ): Promise<String> {
    return this.usersService.updateUser(id, updateUserINPUT);
  }

  @Query(() => String)
  async deleteUser(@Args ('id', {type: () => Int}) id: number) {
    return this.usersService.deleteUser(id);
  }

}
