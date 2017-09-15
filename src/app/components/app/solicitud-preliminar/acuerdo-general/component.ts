import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class AcuerdoGeneralComponent {

}

@Component({
	selector: 'solicitud-acuerdo-general',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudAcuerdoGeneralComponent {
	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoAcuerdoGeneral[] = [
		{id : 1, nombre: 'Entrevista.pdf',  	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 2, nombre: 'Nota.pdf',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 3, nombre: 'Fase.png',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id : 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}

@Component({
	selector: 'documento-acuerdo-general',
    templateUrl:'./documento.component.html',
})
export class DocumentoAcuerdoGeneralComponent {

}

export interface DocumentoAcuerdoGeneral {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
