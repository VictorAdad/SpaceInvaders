import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class PeritoComponent {
	columns = ['tipo', 'oficio'];
	dataSource: TableService | null;
	data: Perito[] = [
		{id : 1, tipo: 'Fundamento A',  oficio: 'Plazo A'},
		{id : 2, tipo: 'Fundamento B',  oficio: 'Plazo B'},
		{id : 3, tipo: 'Fundamento C',  oficio: 'Plazo C'},
	];
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}
export interface Perito {
	id:number
	tipo: string;
	oficio: string;
}