import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class InspeccionComponent {
	columns = ['fecha', 'adscripcion'];
	dataSource: TableService | null;
	data: Inspeccion[] = [
		{id : 1, fecha: 'Fundamento A',  adscripcion: 'Plazo A'},
		{id : 2, fecha: 'Fundamento B',  adscripcion: 'Plazo B'},
		{id : 3, fecha: 'Fundamento C',  adscripcion: 'Plazo C'},
		{id : 4, fecha: 'Fundamento D',  adscripcion: 'Plazo D'},
		{id : 5, fecha: 'Fundamento F',  adscripcion: 'Plazo F'},
	];
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}
export interface Inspeccion {
	id:number
	fecha: string;
	adscripcion: string;
}