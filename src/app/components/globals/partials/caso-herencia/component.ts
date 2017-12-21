import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Caso, CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";

@Component({
	selector    : 'caso-herencia',
  	templateUrl : './component.html'
})
export class CasoHerenciaComponent implements OnInit{

	@Input()
	public casoId: number;

	@Input()
	public form: FormGroup;

	public caso: Caso


	
	constructor(
		public casoServ: CasoService
		){
	}

	ngOnInit(){
		this.casoServ.find(this.casoId).then(
			response => this.caso = this.casoServ.caso
		)

	}
}



