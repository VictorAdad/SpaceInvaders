import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class PoliciaCreateComponent {

}

@Component({
	selector: 'solicitud-policia',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudPoliciaComponent {
	
}

@Component({
	selector: 'documento-policia',
    templateUrl:'./documento.component.html',
})
export class DocumentoPoliciaComponent {
	columns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoPolicia[] = [
		{id : 1, nombre: 'Entrevista.pdf',  	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 2, nombre: 'Nota.pdf',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 3, nombre: 'Fase.png',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id : 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}

export interface DocumentoPolicia {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}