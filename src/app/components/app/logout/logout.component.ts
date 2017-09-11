import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/auth/authentication.service';

@Component({
	template : ''
})
export class LogoutComponent{

    constructor(private _authService: AuthenticationService, private router: Router) {}

    ngOnInit() {
        this._authService.logout();
        this.router.navigate(['login']);
    }
}
