import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { ActivatedRoute } from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'component.html',
    styleUrls: ['./../../catalogos.component.css']
})

export class CalibreArmaComponent {
    columns = ['calibre', 'modificacion'];
	dataSource: ExampleDataSource;
    hidePaginator: boolean = false;
    selectedRow: Number;

	@ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private router: Router, private route: ActivatedRoute) {}
    
    setClickedRow(row) {
        this.selectedRow = row.id;
        //console.log(row.calibre);
        this.router.navigate(['/calibre-arma/'+row.id+'/edit']);
    }

	ngOnInit() {
        this.dataSource = new ExampleDataSource();
  	}
}

const data: Calibre[] = [
    {id : 1, calibre: '.22 corto',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, calibre: '.22 magnum',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 3, calibre: '.223',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 4, calibre: '.25 ó 635mm',  modificacion: 'dd/mm/aaa hh:mm'},
];

export interface Calibre {
	id:number
	calibre: string;
	modificacion: string;
}

export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Calibre[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }