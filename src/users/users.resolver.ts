import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UserType } from './graphql/user.type';
import { UpdateUserDto } from './dto/update-user-dto';


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
    @Args('data') createUserDTO: CreateUserDto,
  ): Promise<UserType> {
    return this.usersService.addUser(createUserDTO);
  }

  @Mutation(() => String)
  async updateUser(
    @Args('id', {type: () => Int}) id: number,
    @Args('data') updateUserDTO: UpdateUserDto,
  ): Promise<String> {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @Query(() => String)
  async deleteUser(@Args ('id', {type: () => Int}) id: number) {
    return this.usersService.deleteUser(id);
  }

}
