import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { AcuerdoRadicacion } from '@models/acuerdoRadicacion';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl:'./create.component.html',
})
export class AcuerdoRadicacionCreateComponent {
	public casoId: number = null;
	constructor(private route: ActivatedRoute){}
	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
  	}

}

@Component({
	selector: 'acuerdo-radicacion',
    templateUrl:'./acuerdo-radicacion.component.html',
})
export class AcuerdoRadicacionComponent {
	public form  : FormGroup;
    public model : AcuerdoRadicacion;
    public casoId: number = null;

    constructor(private _fbuilder: FormBuilder, private route: ActivatedRoute) { }
    ngOnInit(){
        this.model = new AcuerdoRadicacion();
        this.form  = new FormGroup({
            'observaciones':  new FormControl(this.model.observaciones),
          });
        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
    }

    public save(valid : any, model : any):void{
        console.log('AcuerdoRadicacion@save()');
    }


	
}

@Component({
	selector: 'documento-acuerdo-radicacion',
    templateUrl:'./documento-acuerdo-radicacion.component.html',
})

export class DocumentoAcuerdoRadicacionComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoAcuerdoRadicación[] = [
		{id: 1, nombre: 'Entrevista.pdf',    	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 2, nombre: 'Nota.pdf',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 3, nombre: 'Fase.png',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id: 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}

export class DocumentoAcuerdoRadicación {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
