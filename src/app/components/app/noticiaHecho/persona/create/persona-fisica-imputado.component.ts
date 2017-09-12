import { Component } from '@angular/core';


@Component({
  	templateUrl : './persona-fisica-imputado.component.html'
})
export class PersonaFisicaImputadoComponent{
	tipoPersona: string = "tp";
	tipoInterviniente: string="";
	detenido: boolean = false;


	muestraDatos(){
		return true;
	}

	changeDetenido(e){
		this.detenido=e.checked;
		console.log(this.detenido);
	}
}