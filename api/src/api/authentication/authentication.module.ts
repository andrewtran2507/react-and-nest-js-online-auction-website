import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { configServiceNew } from '../../common/config/config.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: configServiceNew.get('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: { expiresIn: '2000s' },
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [
    AuthenticationController,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
