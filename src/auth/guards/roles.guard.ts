import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("RolesGuard Triggered!");

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user = req.user;

    if (!user) {
      console.log("No User Found in Request!");
      return false;
    }

    console.log(`User Role: ${user.role}, Required Roles: ${requiredRoles}`);

    return requiredRoles.includes(user.role);
  }
}
