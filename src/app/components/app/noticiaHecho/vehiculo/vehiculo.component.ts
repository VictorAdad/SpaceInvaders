import { Component, ViewChild } from '@angular/core';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector: 'vehiculo',
    templateUrl:'./vehiculo.component.html'
})

export class VehiculoComponent{
	displayedColumns = ['tipo', 'marca', 'color', 'modelo', 'placa'];
	data: Vehiculo[];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	ngOnInit() {
		this.data = data;
    	this.dataSource = new TableService(this.paginator, this.data);

    	console.log('-> Data Source', this.dataSource);
  	}
}

export interface Vehiculo {
    tipo: string;
    marca: string;
    color: string;
    modelo: string;
    placa: string;
  }

  const data: Vehiculo[] = [
      { tipo:'Automovil/Camioneta', marca: 'BMW', color: 'Negro', modelo: '1234123', placa: 'XY-1234' }
  ];

      /**
   * Data source to provide what data should be rendered in the table. The observable provided
   * in connect should emit exactly the data that should be rendered by the table. If the data is
   * altered, the observable should emit that new set of data on the stream. In our case here,
   * we return a stream that contains only one set of data that doesn't change.
   */
  export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Vehiculo[]> {
      return Observable.of(data);
    }

    disconnect() {}
  }
