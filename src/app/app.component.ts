import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '@services/auth/authentication.service';
import { GlobalService } from '@services/global.service';
import { Breadcrumb, BreadcrumbService } from 'angular2-crumbs';

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
		private breadcrumbService: BreadcrumbService,
        public globalService : GlobalService
	) {
        this._SIDEBAR = false;
    }

	ngOnInit(){
        this.breadcrumbService.onBreadcrumbChange.subscribe((crumbs) => {
            this.titleService.setTitle(this.createTitle(crumbs));
        });
	}
    private createTitle(routesCollection: Breadcrumb[]) {
        const title = 'SIGI';
        const titles = routesCollection.filter((route) => route.displayName);
 
        if (!titles.length) return title;
        
        const routeTitle = this.titlesToString(titles);
        return `${routeTitle} ${title}`;
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
