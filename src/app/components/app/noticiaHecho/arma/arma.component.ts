import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./arma.component.html',
    selector:'arma'
})

export class ArmaComponent{

  public casoId: number = null;

	displayedColumns = ['Arma', 'Tipo', 'Marca', 'Calibre'];
	data:Arma[];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(private route: ActivatedRoute){}

	ngOnInit() {
      this.data = data;
    	this.dataSource = new TableService(this.paginator, this.data);

      this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
      });

    	console.log('-> Data Source', this.dataSource);
  	}
  }

  export interface Arma {
      id:number
      arma: string;
      tipo: string;
      marca: string;
      calibre: string;
    }


  const data: Arma[] = [
      {id:1,arma: 'Arma de Juguete', tipo: '', marca:'', calibre:'24'},
      {id:2,arma: 'Arma blanca', tipo: 'ballesta', marca:'', calibre:'32'},
      {id:3,arma: 'Arma blanca', tipo: 'cuchillo', marca:'', calibre:'32'},
      {id:4,arma: 'Arma de Fuego', tipo: 'Fisil de asalto', marca:'AKM', calibre:'17'},
      {id:5,arma: 'Arma de Fuego', tipo: 'Fisil de asalto', marca:'M-16', calibre:'32'},
      {id:6,arma: 'Arma de Fuego', tipo: 'Pistola', marca:'Karabina', calibre:'24'},
  ];
