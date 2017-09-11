import { Component } from '@angular/core';


@Component({
  	templateUrl : './persona-fisica-imputado.component.html'
})
export class PersonaFisicaImputadoComponent{
	tipoPersona: string = "tp";
	tipoInterviniente: string="";

	muestraDatos(){
		return true;
	}
}