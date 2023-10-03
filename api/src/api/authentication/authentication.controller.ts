import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { ApiBody } from '@nestjs/swagger';
import LogInDto from './dto/logIn.dto';
import RequestWithUser from './requestWithUser.interface';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() registrationData: RegisterDto) {
    return await this.authenticationService.signUp(registrationData);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('sign-in')
  @ApiBody({ type: LogInDto })
  async signIn(@Req() request: RequestWithUser) {
    return await this.authenticationService.signIn(request);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('sign-out')
  async signOut(@Req() request: RequestWithUser) {
    return await this.authenticationService.signOut(request);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    return this.authenticationService.refresh(request);
  }
}
