import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    console.log("GqlAuthGuard Triggered!");

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (!req.headers.authorization) {
      console.log("No Authorization header found!");
    }

    return req;
  }
}
