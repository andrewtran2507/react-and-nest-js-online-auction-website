

import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer, WsResponse, MessageBody } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { from, map, Observable } from 'rxjs';

@WebSocketGateway({
  namespace: 'alert',
  cors: {
    origin: '*',
  },
 })
export class AlertGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private logger: Logger = new Logger('AlertGateway');
	@WebSocketServer() wss: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

	afterInit(server: any) {
		this.logger.log('Initialize AlertGateway!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	sendToAll(msg: string) {
		this.wss.emit('alertToClient', { message: msg, type: 'Alert' });
	}

  sendAddAnOrder(data: object) {
		this.wss.emit('alertAddAnOrderToClient', { message: data, type: 'Alert' });
	}
}
