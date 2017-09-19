import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class PoliciaComponent {
	columns = ['oficio', 'comisario'];
	dataSource: TableService | null;
	data: Policia[] = [
		{id : 1, oficio: 'Fundamento A',  comisario: 'Plazo A'},
		{id : 2, oficio: 'Fundamento B',  comisario: 'Plazo B'},
		{id : 3, oficio: 'Fundamento C',  comisario: 'Plazo C'},
		{id : 4, oficio: 'Fundamento D',  comisario: 'Plazo D'},
		{id : 5, oficio: 'Fundamento F',  comisario: 'Plazo F'},
	];
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}
export interface Policia {
	id:number
	oficio: string;
	comisario: string;
}