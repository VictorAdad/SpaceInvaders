import { Injectable } from '@angular/core';


import {Observable} from 'rxjs/Rx';

import {MatSnackBar} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import {SincronizaCatalogos} from "@services/onLine/sincronizaCatalogos";
import { SimpleNotificationsComponent } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { Notification } from 'angular2-notifications';
import { MatDialog } from '@angular/material';
import { DialogSincrinizarService} from "@services/onLine/dialogSincronizar.service";
import { Logger } from "@services/logger.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import {SincronizaCambios} from '@services/onLine/sincronizarCambios';
import { _config} from '@app/app.config';


@Injectable()
export class OnLineService {
    onLine: boolean = true;
    timer = Observable.timer(2000,_config.offLine.tiempoChekeoConexion);
    //este timer se executa cada hora, la primera se sera a los 14s de iniciar la app
    timerSincronizarMatrices = Observable.timer(_config.offLine.sincronizarCatalogos.tiempoStartSincronizarCatalogos,_config.offLine.sincronizarCatalogos.tiempoSincronizarCatalogos);
    anterior: boolean= true;

    

    sincronizarCatalogos:SincronizaCatalogos;
    sincronizarCambios:SincronizaCambios;
    private casoService=null;


    constructor(
        public snackBar: MatSnackBar,
        private db:CIndexedDB,
        private http:HttpService,
        private notificationService: NotificationsService,
        public dialog: MatDialog,
        public dialogoSincronizar:  DialogSincrinizarService,
        public logger:Logger,
        private route: Router,
        private _confirmation: ConfirmationService
    ) {
        this.sincronizarCatalogos=new SincronizaCatalogos(db,http,dialogoSincronizar);
        this.sincronizarCambios= new SincronizaCambios(db,http,notificationService,route,_confirmation,this);
        // timer = Observable.timer(2000,1000);
        this.timer.subscribe(t=>{
            this.anterior=this.onLine;
            this.onLine=navigator.onLine;
            let message="Se perdió la conexión";
            if(this.onLine){
                message="Se estableció la conexión";
                this.sincronizarCambios.startSincronizacion();
            }

            if (this.anterior!=this.onLine){
                var url=this.route["url"];
                if (url=="/")
                    url=this.onLine?url+"enlinea":url+"sinconexion";
                else if (url=="/enlinea" || url=="/sinconexion")
                    url="/";
                this.route.navigateByUrl(url);
                
                this.snackBar.open(message, "", {
                  duration: 10000,
                });
            }
        });
        // if(localStorage.getItem('sincronizacion') !== 'true')
            this.timerSincronizarMatrices.subscribe(t=>{
                if (this.onLine)
                    this.sincronizarCatalogos.searchChange();
            });
        // else
        //     Logger.log('Ya existen catalogos sincroinzados');
    }

    setCaso(casoService){
        this.casoService=casoService;
        this.sincronizarCambios.setCaso(casoService);
    }


}
