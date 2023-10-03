import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertGateway } from './alert.gateway';

@Module({
  imports: [],
  controllers: [AlertController],
  providers: [AlertGateway],
  exports: [AlertGateway],
})
export class AlertModule {}
