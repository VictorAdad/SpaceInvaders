import { Component, ViewChild } from '@angular/core';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

@Component({
    templateUrl:'./relacion.component.html',
    selector:'relacion'
})

export class RelacionComponent{
	displayedColumns = ['Tipo', 'Elementos'];
	data:Relacion[];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(private servicio: MiservicioService){}

	ngOnInit() {
      this.data=data;
    	this.dataSource = new TableService(this.paginator, this.data);
    	console.log('-> Data Source', this.dataSource);
  	}
}

export interface Relacion {
    id:number;
    tipo: string;
    elementos: string;
  }

  const data: Relacion[] = [
      {id:1,tipo: "Defensor del imputado", elementos: ''},
      {id:2,tipo: "Imputado víctima delito", elementos: ''},
      {id:3,tipo: "Asesor jurídico de la victima", elementos: ''},
      {id:4,tipo: "Imputado víctima delito", elementos: ''},
      {id:5,tipo: "Defensor del imputado", elementos: ''},
      {id:6,tipo: "Representante  víctima", elementos: ''},
      {id:7,tipo: "Asesor jurídico de la victima", elementos: ''},

  ];
