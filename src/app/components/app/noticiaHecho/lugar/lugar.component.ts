import { Component, ViewChild } from '@angular/core';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector:'lugar',
    templateUrl:'./lugar.component.html'
})

export class LugarComponent{
	displayedColumns = ['tipo', 'calle', 'colonia', 'localidad', 'acciones'];
    data: Lugar[];
    //dataSource: TableService | null;
    dataSource = new ExampleDataSource();
    @ViewChild(MdPaginator) paginator: MdPaginator;
    
    ngOnInit(){
        this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
        console.log('-> Data Source', this.dataSource);
    }

}

export interface Lugar {
    tipo: string;
    calle: string;
    colonia: string;
    localidad: string;
  }
  
  const data: Lugar[] = [
      {tipo: 'Lugar de hallazgo', calle: 'Roberto Sanchez', colonia: 'centro', localidad:'Roberto Sanchez'}
  ];

    /**
   * Data source to provide what data should be rendered in the table. The observable provided
   * in connect should emit exactly the data that should be rendered by the table. If the data is
   * altered, the observable should emit that new set of data on the stream. In our case here,
   * we return a stream that contains only one set of data that doesn't change.
   */
  export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Lugar[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }