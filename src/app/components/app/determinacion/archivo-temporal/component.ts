import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class ArchivoTemporalComponent {

	public casoId: number = null;

	columns = ['creadoPor', 'fechaCreacion'];
	dataSource: TableService | null;
	data: ArchivoTemporal[] = [
		{ creadoPor: 'MP Enrique Pedroza', fechaCreacion: '01/09/2017 16:03:34' }
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
export interface ArchivoTemporal {
	creadoPor: string;
	fechaCreacion: string;
}