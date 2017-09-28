import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'component.html',
    styleUrls: ['./../catalogos.component.css']
})

export class CatalogoArmasComponent {
    columns = ['nombre', 'modificacion'];
	dataSource: ExampleDataSource;
    hidePaginator: boolean = false;
    selectedRow: Number;

	@ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(private router: Router) {}
    
    setClickedRow(row) {
        this.selectedRow = row.id;
        switch(row.id){
            case 1:{
                this.router.navigate(['/tipo-arma']);
                break;
            }
            case 2:{
                this.router.navigate(['/calibre-arma']);
                break;
            }
            case 3:{
                this.router.navigate(['/mecanismo-accion']);
                break;
            }
        }
    }

	ngOnInit() {
    	this.dataSource = new ExampleDataSource();
  	}
}

const data: Arma[] = [
    {id : 1, nombre: 'Tipos de arma',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, nombre: 'Calibre de armas',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 3, nombre: 'Mecanismo de acción',  modificacion: 'dd/mm/aaa hh:mm'},
];

export interface Arma {
	id:number
	nombre: string;
	modificacion: string;
}

export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Arma[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }