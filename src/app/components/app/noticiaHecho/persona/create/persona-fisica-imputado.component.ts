import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  	templateUrl : './persona-fisica-imputado.component.html',
  	styles: ['']
})
export class PersonaFisicaImputadoComponent{

	public form  : FormGroup;

	tipoPersona: string="";
	tipoInterviniente: string;
	detenido: boolean = false;


	muestraDatos(){
		return true;
	}



	changeDetenido(e){
		this.detenido=e.checked;
		console.log(this.detenido);
	}

	constructor(private _fbuilder: FormBuilder) { }

	ngOnInit(){
		this.form  = new FormGroup({
    		'tipoPersona'   : new FormControl("", [Validators.required,]),
    		'tipoInterviniente': new FormControl("", [Validators.required,]),
    		'razonSocial': new FormControl("",[Validators.required,Validators.minLength(4)]),
  		});
  		this.form.controls.razonSocial.disable();
	}

	activaRazonSocial(value){
		if (value=="Moral")
			this.form.controls.razonSocial.enable();
		else
			this.form.controls.razonSocial.disable();
	}

	save(valid : any, model : any):void{
		console.log('-> Submit', valid, model);
	}
}