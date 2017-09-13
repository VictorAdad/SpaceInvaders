import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatosGenerales } from '@models/datosGenerales';

@Component({
	selector : 'datos-generales',
    templateUrl:'./component.html'
})

export class DatosGeneralesComponent implements OnInit{
	public form  : FormGroup;
	public model : DatosGenerales;

	constructor(private _fbuilder: FormBuilder) { }

	ngOnInit(){
		this.model = new DatosGenerales();
		this.form  = new FormGroup({
    		'titulo'   : new FormControl(this.model.titulo, [Validators.required,]),
    		'sintesis' : new FormControl(this.model.titulo, [Validators.required,]),
    		'delito'   : new FormControl(this.model.titulo, [Validators.required,])
  		});
	}

	save(valid : any, model : any):void{
		console.log('-> Submit', valid, model);
	}

}
