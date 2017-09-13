import { Component, ViewChild } from '@angular/core';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

@Component({
    templateUrl:'./arma.component.html',
    selector:'arma'
})

export class ArmaComponent{
	displayedColumns = ['Arma', 'Tipo', 'Marca', 'Acciones'];
	data:Arma[];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
      this.data=data;
    	this.dataSource = new TableService(this.paginator, this.data);

    	console.log('-> Data Source', this.dataSource);
  	}
  }

  export interface Arma {
      id:number
      arma: string;
      tipo: string;
      marca: string;
    }
  

  const data: Arma[] = [
      {id:1,arma: 'Arma de Juguete', tipo: '', marca:''},
      {id:2,arma: 'Arma blanca', tipo: 'ballesta', marca:''},
      {id:3,arma: 'Arma blanca', tipo: 'cuchillo', marca:''},
      {id:4,arma: 'Arma de Fuego', tipo: 'Fisil de asalto', marca:'AKM'},
      {id:5,arma: 'Arma de Fuego', tipo: 'Fisil de asalto', marca:'M-16'},
      {id:6,arma: 'Arma de Fuego', tipo: 'Pistola', marca:'Karabina'},     
  ];
