import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./component.html',
})
export class ArchivoTemporalCreateComponent {
	public casoId: number = null;
	constructor(private route: ActivatedRoute){}
	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
  	}

}

@Component({
	selector: 'determinacion-archivo-temporal',
    templateUrl:'./determinacion.component.html',
})
export class DeterminacionArchivoTemporalComponent {
	public casoId: number = null;
	constructor(private route: ActivatedRoute){}
	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
  	}
	
}

@Component({
	selector: 'documento-archivo-temporal',
    templateUrl:'./documento.component.html',
})
export class DocumentoArchivoTemporalComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoArchivoTemporal[] = [
		{id : 1, nombre: 'Entrevista.pdf',  	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 2, nombre: 'Nota.pdf',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 3, nombre: 'Fase.png',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id : 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}

export interface DocumentoArchivoTemporal {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
