import { Component,OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Lugar } from '@models/lugar';
import { MOption } from '@partials/form/select2/select2.component';

@Component({
    selector: 'lugar-create',
    templateUrl: './create.component.html'
})

export class LugarCreateComponent implements OnInit{
    public form: FormGroup;
    public model: Lugar;

    constructor(private _fbuilder: FormBuilder) { }

    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
        ];

    ngOnInit() {
        this.model = new Lugar();
        this.form = new FormGroup({
            'tipo': new FormControl(this.model.tipo, [Validators.required,]),
            'tipo_zona': new FormControl(this.model.tipo_zona, [Validators.required,]),
            'calle': new FormControl(this.model.calle, [Validators.required,]),
            'referencias': new FormControl(this.model.referencias, [Validators.required,]),
            'pais': new FormControl(this.model.pais, [Validators.required,]),
            'estado': new FormControl(this.model.estado, [Validators.required,]),
            'municipio_delegacion': new FormControl(this.model.municipio_delegacion, [Validators.required,]),
            'colonia_asentamiento': new FormControl(this.model.colonia_asentamiento, [Validators.required,]),
            //'fecha': new FormControl(this.model.fecha, [Validators.required,]),
            'hora': new FormControl(this.model.hora, [Validators.required,])
        });
    }

    save(valid : any, model : any):void{
		console.log('-> Submit', valid, model);
	}
}