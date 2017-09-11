import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	public isAuthenticated: boolean;

	constructor(
	public authService: AuthenticationService,
	private router : Router
	) {}

	ngOnInit(){

	}

	isLoggedIn()
	{
		return this.authService.isLoggedIn();
	}

	logout(){
		this.authService.logout();
	}
}
