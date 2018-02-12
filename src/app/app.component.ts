import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthenticationService } from '@services/auth/authentication.service';
import { GlobalService } from '@services/global.service';
import { NotificationsService } from 'angular2-notifications';
import { NotifyService} from '@services/notify/notify.service';
import { OnLineService } from "@services/onLine.service";
import { SelectsService } from "@services/selects.service";
import { FormatosService } from '@services/formatos/formatos.service';
import { HttpService} from '@services/http.service';
import { DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry} from '@angular/material';
import { _config} from '@app/app.config';
import { Logger } from '@services/logger.service';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { TablaSincronizarService } from './services/onLine/tablaSincronizarService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    public isAuthenticated: boolean;

    public _SIDEBAR: boolean;

    public _CONFIG: any = _config;

    public env = environment;

    public socket: any;

    public pageNotification = 0;

    public loadNotification = false;

    public inIdleTimeout = false;

    constructor(
        public authService: AuthenticationService,
        private router: Router,
        private titleService: Title,
        public globalService: GlobalService,
        public servicio: OnLineService,
        private activeRoute: ActivatedRoute,
        private mdIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private selects: SelectsService,
        private formatos: FormatosService,
        private notification: NotificationsService,
        private notify:  NotifyService,
        private http: HttpService,
        private idle: Idle,
        private keepalive: Keepalive,
        public sincronizar: TablaSincronizarService
    ) {
        mdIconRegistry.addSvgIcon('arma', sanitizer.bypassSecurityTrustResourceUrl('./assets/images/iconos/arma.svg'));
        this._SIDEBAR = false;
        this.selects.getData();
        this.formatos.getFormatos();

        // Se coloca el tiempo de inactividad de la aplicación.
        idle.setIdle(environment.oam.idle);

        // Se coloca el timeout de inactidad de la aplicación
        idle.setTimeout(environment.oam.idleTimeout);

        // Se colocan los interruotires de inactividad
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleStart.subscribe(() => Logger.log('-> Comienza la inactividad'));

        idle.onInterrupt.subscribe(() => {
            if (this.inIdleTimeout) {
                Logger.log('-> Interrupt inIdleTimeout');
                this.authService.refreshToken();
            }
            this.inIdleTimeout = false;
        });

        idle.onTimeout.subscribe(() => {
            Logger.log('-> Sessión Timeout!');
            this.authService.isLoggedin = false;
        });

        // idle.onIdleEnd.subscribe(() => { });

        idle.onTimeoutWarning.subscribe((countdown) => {
            // Logger.log('-> La sesión expirará en ' + countdown);
            this.inIdleTimeout = true;
        });

        // sets the ping interval to 15 seconds
        // keepalive.interval(15);
        // keepalive.onPing.subscribe(() => );
        // this.reset();
    }

    ngOnInit() {
        this.titleService.setTitle(this.createTitle());
        this.notify.getMessages().subscribe(
            message => {
                if (message['notify'] && message['notify']['username'] === this.authService.user.username) {
                    this.notification.create(message['notify']['titulo'], message['notify']['contenido'], 'info', {
                        timeOut: 10000,
                        showProgressBar: false,
                        pauseOnHover: false,
                        clickToClose: false,
                        maxLength: 100
                    });
                    this.authService.user.notificacionesChange.next(message['notify']);
                    this.loadNotifications();
                }
            }
        );
        this.loadNotifications();
    }


    private createTitle() {
        const title = 'SIGI';
        let routeTitle = '';
        this.activeRoute.data.subscribe(data => {
            if (data.breadcrumb)
                routeTitle = data.breadcrumb;
	    });
        return `${routeTitle} ${title}`;
    }

	isLoggedIn()
	{
		return this.authService.isLoggedIn();
	}

	logout(){
		this.authService.logout();
	}

    redireccionSigi(){
        location.href ="http://pgjemsigi.edomex.gob.mx:3002/#/login";
    }

    cleanDB(){
        Logger.log('cleanDB()');
        this.router.navigate(['/']);
        localStorage.setItem("initDB","false");
        window.indexedDB.deleteDatabase("SIGI");
        location.reload(true);
        // window.location.assign("../")
    }

    public loadNotifications() {
        this.loadNotification = true;
        this.http.get(`/v1/base/notificaciones/usuario/${this.authService.user.username}/page?p=${this.pageNotification}`).subscribe(
            response => {
                if (response.data.length > 0) {
                    this.loadNotification = false;
                    this.pageNotification ++;
                    if (this.authService.user.notificaciones.length === 0) {
                        this.authService.user.notificaciones = response.data;
                    } else {
                        this.authService.user.notificaciones = this.authService.user.notificaciones.concat(response.data);
                    }
                }
            }
        );
    }

    public onScrollNotification(_event: any) {
        if ((_event.target.scrollTop + 430) === _event.target.scrollHeight) {
            this.loadNotifications();
        }
    }

    public reset() {
        this.idle.watch();

    }

    public readNotification(_data){
        Logger.log(' -> notificaciones',_data);
        return new Promise( (resolve, reject) => {
            this.http.post(`/v1/base/notificaciones/usuario/${_data.id}/leido`, _data).subscribe(
                response => {
                    Logger.log(' -> notificaciones',this.authService.user.notificaciones);
                    this.authService.user.notificaciones = this.authService.user.notificaciones.filter(obj => obj !== _data);
                    this.authService.user.sinLeer -= 1;
                    Logger.log(' -> notificaciones after',this.authService.user.notificaciones);
                    this.router.navigate(['/caso/'+_data.caso.id+'/noticia-hecho/datos-generales']);
                },
                error => {
                    Logger.error('Error', error);
                    reject('Ocurrió un error al leer la notificación');
                }
            );
        });
    }

}
