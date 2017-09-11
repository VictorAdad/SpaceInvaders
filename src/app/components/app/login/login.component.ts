import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/auth/authentication.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent{
    usuario : string;
    pass    : string;
    loading : boolean = false;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { 

        if(authenticationService.isLoggedIn)
            this.router.navigate(['/']);
    }

    login(){
        this.loading = true;
        //pidiendo al servicio de autenticación la validez de las credenciales
        this.authenticationService.login(this.usuario, this.pass)
            // .subscribe(result => {
                // if (result === true) {
                    // Si es valido redirigir al home
                    this.router.navigate(['/']);
                // } else {
                  // Mostrar mensaje de error
                    this.loading = false;
                // }
            // });       
    }
}
