import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Vehiculo } from '@models/vehiculo';

@Component({
    selector: 'vehiculo-create',
    templateUrl: './create.component.html'
})

export class VehiculoCreateComponent implements OnInit {
    public form: FormGroup;
    public model: Vehiculo;

    constructor(private _fbuilder: FormBuilder) { }

    ngOnInit() {
        this.model = new Vehiculo();
        this.form = new FormGroup({
            //'motivo': new FormControl(this.model.motivo, [Validators.required,]),
            'vehiculo': new FormControl(this.model.vehiculo, [Validators.required,]),
            //'n_tarjeta': new FormControl(this.model.n_tarjeta, [Validators.required,]),
            //'n_economico': new FormControl(this.model.n_economico, [Validators.required,]),
            //'clase': new FormControl(this.model.clase, [Validators.required,]),
            'marca': new FormControl(this.model.marca, [Validators.required,]),
            //'submarca': new FormControl(this.model.submarca, [Validators.required,]),
            'color': new FormControl(this.model.color, [Validators.required,]),
            'modelo': new FormControl(this.model.modelo, [Validators.required,]),
            //'estado_origen_placas': new FormControl(this.model.estado_origen_placas, [Validators.required,]),
            'placas': new FormControl(this.model.placas, [Validators.required,]),
            //'placas_adicionales': new FormControl(this.model.placas_adicionales, [Validators.required,]),
            //'rfv': new FormControl(this.model.rfv, [Validators.required,]),
            'n_serie': new FormControl(this.model.n_serie, [Validators.required,]),
            'n_motor': new FormControl(this.model.n_motor, [Validators.required,]),
            //'aseguradora': new FormControl(this.model.aseguradora, [Validators.required,]),
            //'factura': new FormControl(this.model.factura, [Validators.required,]),
            //'datos_tomados_de': new FormControl(this.model.datos_tomados_de, [Validators.required,]),
            //'n_poliza': new FormControl(this.model.n_poliza, [Validators.required,]),
            //'valor_estimado': new FormControl(this.model.valor_estimado, [Validators.required,]),
            //'tipo_uso': new FormControl(this.model.tipo_uso, [Validators.required,]),
            //'procedencia': new FormControl(this.model.procedencia, [Validators.required,]),
            //'pedimento_de_importacion': new FormControl(this.model.pedimento_de_importacion, [Validators.required,]),
            //'lleva_carga': new FormControl(this.model.lleva_carga, [Validators.required,]),
            //'alterado': new FormControl(this.model.alterado, [Validators.required,]),
            //'señas_particulares': new FormControl(this.model.señas_particulares, [Validators.required,])
        });
    }

    save(valid : any, model : any):void{
		console.log('-> Submit', valid, model);
	}
}