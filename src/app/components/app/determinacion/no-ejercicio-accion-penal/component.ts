import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class NoEjercicioAccionPenalComponent {
	columns = ['ambito', 'calidadEntrevistado', 'creadoPor', 'fechaCreacion'];
	dataSource: TableService | null;
	data: NoEjercicioAccionPenal[] = [
		{ ambito: 'Competencia', calidadEntrevistado: 'Víctima', creadoPor: 'MP Enrique Pedroza', fechaCreacion: '01/09/2017 16:03:34' }
	];
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}
export interface NoEjercicioAccionPenal {
	ambito: string;
	calidadEntrevistado: string;
	creadoPor: string;
	fechaCreacion: string;
}