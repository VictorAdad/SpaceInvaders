import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'component.html',
    styleUrls: ['./../../catalogos.component.css']
})

export class MecanismoAccionComponent {
    columns = ['nombre', 'modificacion'];
	dataSource: ExampleDataSource;
    hidePaginator: boolean = false;
    selectedRow: Number;

	@ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private router: Router) {}
    
    setClickedRow(row) {
        this.selectedRow = row.id;
        //console.log(row.nombre);
        this.router.navigate(['/mecanismo-accion/'+row.id+'/edit']);
    }

	ngOnInit() {
    	this.dataSource = new ExampleDataSource();
  	}
}

const data: MecanismoAccion[] = [
    {id : 1, nombre: 'Automática',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, nombre: 'De acción simple',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 3, nombre: 'De bomba y corredera',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 4, nombre: 'De cerrojo',  modificacion: 'dd/mm/aaa hh:mm'},
];

export interface MecanismoAccion {
	id:number
	nombre: string;
	modificacion: string;
}

export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<MecanismoAccion[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }