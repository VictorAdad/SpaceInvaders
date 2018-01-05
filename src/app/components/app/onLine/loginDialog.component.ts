import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Logger } from "@services/logger.service";
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { AuthenticationService } from '@services/auth/authentication.service';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'loginDialog.component.html',
  styles: [
    'h1 {font-size: 50px;}',
    '#content {position: relative; top: 50px;}',
    '#button {position: relative; top: 110px;}',
    '#buttonRed {background: #9b1e13; color: #ffffffde;}'
    ]
})
export class LoginDialog {

	color = 'primary';
	mode = 'indeterminate';
	value = 0;
    bufferValue = 75;
    form:FormGroup=null;
    invalid:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authenticationService: AuthenticationService) { 
    Logger.log("Data",data);    
  }

  ngOnInit(){
    Logger.logColor("Usuario:", "pink",this.authenticationService.user.username);
    this.form =  new FormGroup({
        'user': new FormControl('', [Validators.required]),
        'pass': new FormControl('', [Validators.required]),
    });
    var timer = Observable.timer(1);
    timer.subscribe((tik)=>{
        this.form.controls.user.patchValue(this.authenticationService.user.username);
        Logger.logColor("Form","orange",this.form.value);
    });
    
  }

  submitForm(_event){
    if(_event.keyCode == 13) {
        this.login(this.form.valid, this.form.value)
    }
}

  onNoClick(): void {
    Logger.logColor("ENTRO","cyan");
    this.dialogRef.close();
  }

  login(valid, _form): void{
    if(valid){
        //pidiendo al servicio de autenticación la validez de las credenciales
        this.authenticationService.login(_form.user, _form.pass).then(
            response => {
                this.authenticationService.isLoggedin = true;
                this.onNoClick();
            },
            error =>{
                console.log(error);
                this.invalid=true;
            }
        )
    }else{
        // Logger.log('Elm formulario no pasó la validación D:');
    }      
  }

}