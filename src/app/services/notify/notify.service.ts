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

	public getNotify(_notify: any){
		this.notify = new Notify(_notify);

		return this.notify;
	}

	public emitMessage(_message){
        this.socket.onopen =  (event) => {
            this.socket.send(JSON.stringify(_message));
        }
    }

    public getMessages() {
        let observable = new Observable(
            observer => {
                this.socket = new WebSocket(env.api.ws+'/notification/transferir');
                this.socket.onmessage =  (event) => {
                    observer.next(JSON.parse(event.data));
                }
            }
        )
        return observable;
    }

}

class Notify {

	public username: string;

    public titulo: string;

	public contenido: string;

    public tipo: string;


	constructor(_notify: any){
		this.username  = _notify['username'];
		this.titulo    = _notify['titulo'];
        this.contenido = _notify['contenido'];
        this.tipo      = _notify['tipo'];
	}
}