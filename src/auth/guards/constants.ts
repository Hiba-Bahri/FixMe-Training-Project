import { ConfigService } from '@nestjs/config';

export const jwtConstants = (configService: ConfigService) => ({
  accessTokenSecret: configService.get<string>('JWT_SECRET'),
  accessTokenExpiration: configService.get<string>('JWT_EXPIRATION'),

  refreshTokenSecret: configService.get<string>('JWT_REFRESH_SECRET'),
  refreshTokenExpiration: configService.get<string>('JWT_REFRESH_EXPIRATION'),
});
