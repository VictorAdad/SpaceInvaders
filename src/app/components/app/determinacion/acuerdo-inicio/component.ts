import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class AcuerdoInicioComponent {

}

@Component({
	selector: 'acuerdo-acuerdo-inicio',
    templateUrl:'./acuerdo.component.html',
})
export class AcuerdoAcuerdoInicioComponent {
	
}

@Component({
	selector: 'documento-acuerdo-inicio',
    templateUrl:'./documento.component.html',
})
export class DocumentoAcuerdoInicioComponent {
	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoAcuerdoInicio[] = [
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

export class DocumentoAcuerdoInicio {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
