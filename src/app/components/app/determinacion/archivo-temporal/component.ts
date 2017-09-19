import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class ArchivoTemporalComponent {
	columns = ['creadoPor', 'fechaCreacion'];
	dataSource: TableService | null;
	data: ArchivoTemporal[] = [
		{ creadoPor: 'MP Enrique Pedroza', fechaCreacion: '01/09/2017 16:03:34' }
	];
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}
export interface ArchivoTemporal {
	creadoPor: string;
	fechaCreacion: string;
}