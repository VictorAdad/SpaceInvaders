import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class InspeccionComponent {

	public casoId: number = null;

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

	constructor(private route: ActivatedRoute){}

	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);

    	this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
  	}
}
export interface Inspeccion {
	id:number
	fecha: string;
	adscripcion: string;
}