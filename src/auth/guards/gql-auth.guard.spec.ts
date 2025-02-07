import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;

  beforeEach(() => {
    guard = new GqlAuthGuard();
  });

  it('should extract request from GraphQL context', () => {
    const mockRequest = { headers: { authorization: 'Bearer token' } };
    const mockContext = {
      getContext: () => ({ req: mockRequest }),
    } as unknown as GqlExecutionContext;

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockContext);

    const executionContext = {} as ExecutionContext;
    const req = guard.getRequest(executionContext);

    expect(req).toBe(mockRequest);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(executionContext);
  });
});
