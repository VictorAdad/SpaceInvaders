import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { FacultadNoInvestigar } from '@models/facultadNoInvestigar';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl:'./create.component.html',
})
export class FacultadNoInvestigarCreateComponent {

}

@Component({
	selector: 'facultad-no-investigar',
    templateUrl:'./facultad-no-investigar.component.html',
})
export class FacultadNoInvestigarComponent {
	public form  : FormGroup;
    public model : FacultadNoInvestigar;

    constructor(private _fbuilder: FormBuilder) { }
    ngOnInit(){
        this.model = new FacultadNoInvestigar();
        this.form  = new FormGroup({
            'sintesisHechos':  new FormControl(this.model.sintesisHechos),
            'datosPrueba'	:  new FormControl(this.model.datosPrueba),
            'motivos':  new FormControl(this.model.motivos),
            'remitente':  new FormControl(this.model.motivos),
            'medioAlternativo':  new FormControl(this.model.medioAlternativo),
            'superiorJerarquico':  new FormControl(this.model.superiorJerarquico),
            'observaciones':  new FormControl(this.model.observaciones),

          });
    }

    public save(valid : any, model : any):void{
        console.log('FacultadNoInvestigar@save()');
    }


	
}

@Component({
	selector: 'documento-facultad-no-investigar',
    templateUrl:'./documento-facultad-no-investigar.component.html',
})

export class DocumentoFacultadNoInvestigarComponent {
	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoFacultadNoInvestigar[] = [
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

export class DocumentoFacultadNoInvestigar {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
