import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class EntrevistaComponent {

	public casoId: number = null;

	columns = [ 'entrevistado', 'calidadEntrevistado','creadoPor', 'fechaCreacion'];
	dataSource: TableService | null;
	data: Entrevista[] = [
		{ entrevistado: 'Wendy Sánchez Soto', calidadEntrevistado: 'Víctima', creadoPor: 'Call Center 1', fechaCreacion: '01/09/2017 16:03:34' }
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
export interface Entrevista {
	entrevistado: string;
	calidadEntrevistado: string;
	creadoPor: string;
	fechaCreacion: string;
}