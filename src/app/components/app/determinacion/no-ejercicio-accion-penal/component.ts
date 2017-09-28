import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class NoEjercicioAccionPenalComponent {

	public casoId: number = null;

	columns = ['ambito', 'calidadEntrevistado', 'creadoPor', 'fechaCreacion'];
	dataSource: TableService | null;
	data: NoEjercicioAccionPenal[] = [
		{ ambito: 'Competencia', calidadEntrevistado: 'Víctima', creadoPor: 'MP Enrique Pedroza', fechaCreacion: '01/09/2017 16:03:34' }
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
export interface NoEjercicioAccionPenal {
	ambito: string;
	calidadEntrevistado: string;
	creadoPor: string;
	fechaCreacion: string;
}