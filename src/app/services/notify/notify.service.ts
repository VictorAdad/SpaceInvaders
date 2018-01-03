import { Injectable } from '@angular/core';
import { Logger } from '@services/logger.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { environment as env } from '../../../environments/environment';
import * as io from 'socket.io-client';

/**
 * Servicio para enviar notificaciones vía sockets
 */
@Injectable()
export class NotifyService{

	public socket: any;

	public emitMessage(_message){
		Logger.log('NotifyService@emitMessage()', _message);
        this.socket.emit('notify', _message);    
    }

    public getMessages() {
        let observable = new Observable(
            observer => {
                this.socket = io(env.api.host);
                this.socket.on('notify', (data) => {
                    observer.next(data);    
                });
                return () => {
                    this.socket.disconnect();
                };  
            }
        )     
        return observable;
    }

}