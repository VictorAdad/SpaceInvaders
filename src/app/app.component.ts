import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '@services/auth/authentication.service';
import { GlobalService } from '@services/global.service';

import { OnLineService } from "@services/onLine.service";

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
    private servicio: OnLineService
	) {
        this._SIDEBAR = false;
    }

	ngOnInit(){
	}

    private titlesToString(titles) {
        return titles.reduce((prev, curr) => {
            return `${curr.displayName} - ${prev}`;
        }, "");
    }
	isLoggedIn()
	{
		return this.authService.isLoggedIn();
	}

	logout(){
		this.authService.logout();
	}
}
