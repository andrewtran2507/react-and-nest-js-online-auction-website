import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from '../../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { configServiceNew } from '../../common/config/config.service';
import TokenPayload from './tokenPayload.interface';
import RequestWithUser from './requestWithUser.interface';

@Injectable()
export class AuthenticationService {
  public configService = configServiceNew;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      console.log({error});
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async signIn(request: RequestWithUser) {
    const { user } = request;
    let userData = await this.getUserFromAuthenticationToken(user?.token);

    if (!userData) {
      const { token, cookie: accessTokenCookie } = this.getCookieWithJwtAccessToken(user.id,);
      const { refreshToken, refreshCookie: refreshTokenCookie } = this.getCookieWithJwtRefreshToken(user.id);

      await this.userService.setCurrentRefreshToken(token, refreshToken, user.id);

      request.res.setHeader('Set-Cookie', [
        accessTokenCookie,
        refreshTokenCookie,
      ]);
      userData = await this.userService.findOne(user.id);
    }

    return {...userData};
  }

  public async signOut(request: RequestWithUser) {
    await this.userService.removeRefreshToken(request?.user?.id);
    request.res.setHeader(
      'Set-Cookie',
      this.getCookiesForLogOut(),
    );
    return {
      isSignOut: true
    };
  }

  public refresh(request: RequestWithUser) {
    const {cookie: accessTokenCookie} = this.getCookieWithJwtAccessToken(
      request?.user?.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request?.user;
  }

  public getCookieWithJwtAccessToken(
    userId: string,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return {
      token,
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`};
  }

  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return {
      refreshCookie: cookie,
      refreshToken: token,
    };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    if (!token) return null;
    try {
      const payload: TokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });

      if (payload?.userId) {
        return this.userService.findOne(payload.userId);
      }
    } catch (e) {
      console.log(' getUserFromAuthenticationToken error ', e);
      return null;
    }
  }
}
