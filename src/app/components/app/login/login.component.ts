import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/auth/authentication.service';
import { Logger } from "@services/logger.service";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./styles.css']
})
export class LoginComponent implements OnInit{
    usuario : string;
    pass    : string;
    loading : boolean = false;
    form    : FormGroup; 

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { 

        if(authenticationService.isLoggedIn)
            this.router.navigate(['/']);
    }

    ngOnInit(){
        this.form =  new FormGroup({
            'user': new FormControl('', [Validators.required]),
            'pass': new FormControl('', [Validators.required]),
        })
    }

    login(_valid: boolean, _form: any){
        if(_valid){
            this.loading = true;
            //pidiendo al servicio de autenticación la validez de las credenciales
            this.authenticationService.login(_form.user, _form.pass)
                // .subscribe(result => {
                    // if (result === true) {
                        // Si es valido redirigir al home
                        this.router.navigate(['/']);
                    // } else {
                      // Mostrar mensaje de error
                        this.loading = false;
                    // }
                // });
        }else{
            // Logger.log('Elm formulario no pasó la validación D:');
        }      
    }
}
