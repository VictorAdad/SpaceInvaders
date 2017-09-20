import { Component, ViewChild } from '@angular/core';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector:'notificaciones',
    templateUrl:'./notificaciones.component.html'
})

export class NotificacionesComponent{
	displayedColumns = ['Fecha y Hora', 'Titulo del caso', 'NIC', 'NUC', 'Asignado por'];
    data: notificaciones[];
    //dataSource: TableService | null;
    dataSource = new ExampleDataSource();
    @ViewChild(MdPaginator) paginator: MdPaginator;

    ngOnInit(){
        this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
        console.log('-> Data Source', this.dataSource);
    }

}

export interface notificaciones {
    fecha: string;
    titulo: string;
    nic: string;
    nuc: string;
    asignado: string;
  }

  const data: notificaciones[] = [
      {fecha: '12/02/1993', titulo: 'Robo a casa habitación', nic: 'CAI/AIN/00/UAI/268/00126/17/08', nuc:'CAI/AIN/00/UAI/268/00126/17/08', asignado: 'Sergio Alejandro Hernández'}
  ];

    /**
   * Data source to provide what data should be rendered in the table. The observable provided
   * in connect should emit exactly the data that should be rendered by the table. If the data is
   * altered, the observable should emit that new set of data on the stream. In our case here,
   * we return a stream that contains only one set of data that doesn't change.
   */
  export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<notificaciones[]> {
      return Observable.of(data);
    }

    disconnect() {}
  }
