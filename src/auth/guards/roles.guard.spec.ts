import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  const mockContext = () => {
    return {
      getHandler: () => null,
    } as unknown as ExecutionContext;
  };

  const mockGqlContext = (userRole?: string) => {
    return {
      getContext: () => ({
        req: { user: userRole ? { role: userRole } : null },
      }),
    };
  };

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext('admin') as any);

    expect(rolesGuard.canActivate(mockContext())).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext('user') as any);

    expect(rolesGuard.canActivate(mockContext())).toBe(false);
  });

  it('should deny access if no user is present', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext() as any);

    expect(rolesGuard.canActivate(mockContext())).toBe(false);
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(rolesGuard.canActivate(mockContext())).toBe(true);
  });
});
