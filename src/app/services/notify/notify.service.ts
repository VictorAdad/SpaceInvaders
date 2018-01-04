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

	public notify: Notify;

	public getNotify(_to:string, _message:string){
		this.notify = new Notify(_to, _message);

		return this.notify;
	}

	public emitMessage(_message){
        this.socket.emit('notify', JSON.stringify(_message));    
    }

    public getMessages() {
        let observable = new Observable(
            observer => {
                this.socket = io(env.api.host);
                this.socket.on('notify', (data) => {
                    observer.next(JSON.parse(data));    
                });
                return () => {
                    this.socket.disconnect();
                };  
            }
        )     
        return observable;
    }

}

class Notify {

	public to: string;

	public message: string;


	constructor(_to: string, _message: string){
		this.to      = _to;
		this.message = _message;
	}
}