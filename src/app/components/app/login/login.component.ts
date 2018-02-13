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
    
    public usuario: string;

    public pass: string;

    public loginBtn: string = "Iniciar sesión";

    public loading: boolean = false;

    public invalid: boolean = false;

    public form: FormGroup; 

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

    submitForm(_event){
        if(_event.keyCode == 13) {
            this.login(this.form.valid, this.form.value)
        }
    }

    login(_valid: boolean, _form: any){
        if(_valid && !this.loading){
            this.loading  = true;
            this.loginBtn = "Autenticando..." 
            //pidiendo al servicio de autenticación la validez de las credenciales
            this.authenticationService.login(_form.user, _form.pass).then(
                response => {
                    this.loading = false;
                    this.authenticationService.isLoggedin = true;
                },
                error =>{
                    console.log(error);
                    this.loading  = false;
                    this.invalid  = true;
                    this.loginBtn = "Iniciar sesión"
                }
            )
        }else{
            // Logger.log('Elm formulario no pasó la validación D:');
        }      
    }
}
