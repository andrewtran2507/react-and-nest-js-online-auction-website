import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { configServiceNew } from '../../common/config/config.service';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import TokenPayload from './tokenPayload.interface';

console.log("configServiceNew.get('JWT_ACCESS_TOKEN_SECRET')", configServiceNew.get('JWT_ACCESS_TOKEN_SECRET'));

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request: Request) => {
      //     return request?.cookies?.Authentication;
      //   },
      // ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServiceNew.get('JWT_ACCESS_TOKEN_SECRET').toString(),
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne(payload.userId);
  }
}
