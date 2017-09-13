import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatosGenerales } from '@models/datosGenerales';
import { GlobalComponent } from '@components-app/global.component';
import { LoaderComponent } from '@partials/loader/component';
import { MdDialog } from '@angular/material';

@Component({
	selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent implements OnInit{
	public form       : FormGroup;
	public model      : DatosGenerales;

	public constructor(private _fbuilder: FormBuilder) { 
		
	}

	ngOnInit(){
		this.model = new DatosGenerales();
		this.form  = new FormGroup({
    		'titulo'   : new FormControl(this.model.titulo, [Validators.required]),
    		'sintesis' : new FormControl(this.model.sintesis, [Validators.required]),
    		'delito'   : new FormControl(this.model.delito, [Validators.required])
  		});
	}

	public save(valid : any, model : any):void{
		console.log('DatosGenerales@save()');
	}

}
