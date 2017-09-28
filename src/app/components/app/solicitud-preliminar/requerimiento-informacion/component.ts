import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class RequerimientoInformacionComponent {

	public casoId: number = null;

	columns = ['numeroOficio', 'fechaRequerimiento', 'nombreAutoridad'];
	dataSource: TableService | null;
	data: RequerimientoInformacion[] = [
		{ numeroOficio: '001/2017', fechaRequerimiento: '15/09/2017', nombreAutoridad: 'Pedro Morales Morales' },
		{ numeroOficio: '002/2017', fechaRequerimiento: '15/09/2017', nombreAutoridad: 'Omar García García' },
		{ numeroOficio: '003/2017', fechaRequerimiento: '15/09/2017', nombreAutoridad: 'Carlos Marín Marín' },
		{ numeroOficio: '004/2017', fechaRequerimiento: '15/09/2017', nombreAutoridad: 'Enrique Sánchez Díaz' }
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
export interface RequerimientoInformacion {
	numeroOficio: string;
	fechaRequerimiento: string;
	nombreAutoridad: string;
}