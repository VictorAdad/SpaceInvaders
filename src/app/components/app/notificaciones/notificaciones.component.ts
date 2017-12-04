import { Component, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Logger } from "@services/logger.service";

@Component({
    selector:'notificaciones',
    templateUrl:'./notificaciones.component.html'
})

export class NotificacionesComponent{
	displayedColumns = ['Fecha y Hora', 'Titulo del caso', 'NIC', 'NUC', 'Asignado por'];
    data: notificaciones[];
    //dataSource: TableService | null;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit(){
        this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
        Logger.log('-> Data Source', this.dataSource);
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
