import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '@services/auth/authentication.service';
import { GlobalService } from '@services/global.service';

import { OnLineService } from "@services/onLine.service";
import { SelectsService } from "@services/selects.service";
import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	public isAuthenticated : boolean;
    public _SIDEBAR        : boolean;

	constructor(
		public authService: AuthenticationService,
		private router : Router,
		private titleService: Title,
    	public globalService : GlobalService,
    	private servicio: OnLineService,
    	private activeRoute: ActivatedRoute,
        private mdIconRegistry: MdIconRegistry, 
        private sanitizer: DomSanitizer,
        private selects: SelectsService
	) {
        mdIconRegistry.addSvgIcon('arma',sanitizer.bypassSecurityTrustResourceUrl('./assets/images/iconos/arma.svg'));
        this._SIDEBAR = false;
        this.selects.getData();
    }

	ngOnInit(){
		this.titleService.setTitle(this.createTitle());
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
}
