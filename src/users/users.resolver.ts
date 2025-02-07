import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './graphql/user.type';
import { UpdateUserInput } from './dto/update-user.input';
import { NonEmptyUpdatePipe } from './pipes/non-empty-update.pipe';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { User } from './entities/User';


@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserType])
  @Roles('admin')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async users() {
    return this.usersService.getUsers();
  }

  @Query(() => UserType)
  @Roles('admin')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async userById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findUserById(id);
  }

  @Query(() => UserType)
  @Roles('admin')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async userByEmail(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('data') createUserInput: CreateUserInput,
  ): Promise<UserType> {
    return this.usersService.addUser(createUserInput);
  }

  @Mutation(() => String)
  @Roles('user')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('data', new NonEmptyUpdatePipe()) updateUserInput: UpdateUserInput,
  ): Promise<String> {

          if (!user) {
            throw new UnauthorizedException("User not found in request!");
          }

    return this.usersService.updateUser(user.id, updateUserInput);
  }

  @Query(() => String)
  @Roles('user')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deleteUser(@CurrentUser() user: User) {

    if (!user) {
      throw new UnauthorizedException("User not found in request!");
    }

    return this.usersService.deleteUser(user.id);
  }

}
