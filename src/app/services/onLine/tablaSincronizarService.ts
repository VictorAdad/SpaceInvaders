import { Injectable } from '@angular/core';
import { Logger } from "@services/logger.service";
import { CIndexedDB } from '../indexedDB';
import { AuthenticationService } from "@services/auth/authentication.service";
import {Observable} from 'rxjs/Rx';


@Injectable()
export class TablaSincronizarService{
    numPendientes: number = 0;
    constructor(public db:CIndexedDB, public auth: AuthenticationService) {
        const timer = Observable.timer(2000, 1000);
        let obj = this;
        timer.subscribe(tick => {
            if (auth.isLoggedin){
                this.db.list('sincronizar').then( listaPendientes => {
                    let lista = listaPendientes as any[];
                    // Logger.logColor('LISTA','red',lista);
                    const pendientesDelUsuario = lista.filter( e => {
                        return (e.pendiente) && (e.username == auth.user.username); 
                    });
                    obj.numPendientes = pendientesDelUsuario.length;
                });
            }else {
                obj.numPendientes = 0;
            }
        });
    }

}