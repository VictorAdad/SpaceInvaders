import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class RegistroGeneralComponent {
	columns = ['fundamento', 'plazo'];
	dataSource: TableService | null;
	data: RegistroGeneral[] = [
		{id : 1, fundamento: 'Fundamento A',  	plazo: 'Plazo A'},
		{id : 2, fundamento: 'Fundamento B',    plazo: 'Plazo B'},
		{id : 3, fundamento: 'Fundamento C',    plazo: 'Plazo C'},
		{id : 4, fundamento: 'Fundamento D',  	plazo: 'Plazo D'},
		{id : 5, fundamento: 'Fundamento F',    plazo: 'Plazo F'},
	];
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}
export interface RegistroGeneral {
	id:number
	fundamento: string;
	plazo: string;
}