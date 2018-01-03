import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '@services/auth/authentication.service';
import { GlobalService } from '@services/global.service';
import { NotifyService} from '@services/notify/notify.service';
import { OnLineService } from "@services/onLine.service";
import { SelectsService } from "@services/selects.service";
import { FormatosService } from '@services/formatos/formatos.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { _config} from '@app/app.config';
import { Logger } from '@services/logger.service';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

	public isAuthenticated : boolean;

    public _SIDEBAR        : boolean;

    public _CONFIG: any = _config;

    public env = environment;

    public socket: any;

	constructor(
		public authService: AuthenticationService,
		private router : Router,
		private titleService: Title,
    	public globalService : GlobalService,
    	public servicio: OnLineService,
    	private activeRoute: ActivatedRoute,
        private mdIconRegistry: MatIconRegistry, 
        private sanitizer: DomSanitizer,
        private selects: SelectsService,
        private formatos: FormatosService,
        private notify:  NotifyService
	) {
        mdIconRegistry.addSvgIcon('arma',sanitizer.bypassSecurityTrustResourceUrl('./assets/images/iconos/arma.svg'));
        this._SIDEBAR = false;
        this.selects.getData();
        this.formatos.getFormatos();
    }

	ngOnInit(){
		this.titleService.setTitle(this.createTitle());

        this.notify.getMessages().subscribe(
            message => {
                console.log('getMessage', message);
            }
        );

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

}
