import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'component.html',
    styleUrls: ['./../../catalogos.component.css']
})

export class TipoArmaComponent {
    columns = ['nombre', 'modificacion'];
	dataSource: ExampleDataSource;
    hidePaginator: boolean = false;
    selectedRow: Number;

	@ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(private router: Router) {}
    
    setClickedRow(row) {
        this.selectedRow = row.id;
        console.log(row.nombre);
        this.router.navigate(['/tipo-arma/edit', row.nombre]);
    }

	ngOnInit() {
    	this.dataSource = new ExampleDataSource();
  	}
}

const data: TipoArma[] = [
    {id : 1, nombre: 'Arma blanca',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, nombre: 'Arma de fuego',  modificacion: 'dd/mm/aaa hh:mm'},
];

export interface TipoArma {
	id:number
	nombre: string;
	modificacion: string;
}

export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<TipoArma[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }