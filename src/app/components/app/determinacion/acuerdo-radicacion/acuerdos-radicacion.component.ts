import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';
import { AcuerdoRadicacion } from '@models/acuerdoRadicacion';

@Component({
    templateUrl:'./acuerdos-radicacion.component.html',
    selector:'acuerdos-radicacion'
})

export class AcuerdosRadicacionComponent{

  public casoId: number = null;

	displayedColumns = ['Titulo', 'Fecha'];
	data:AcuerdoRadicacion[];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(private route: ActivatedRoute){}

	ngOnInit() {
      this.data=data;
    	this.dataSource = new TableService(this.paginator, this.data);
    	console.log('-> Data Source', this.dataSource);

      this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
  	}
}

const data: AcuerdoRadicacion[] = [
      {id:1,titulo: "Acuerdo 1", creadoPor: 'Usuario1',fechaCreacion:"12/5/2017",observaciones:''},
      {id:2,titulo: "Acuerdo 2", creadoPor: 'Usuario1',fechaCreacion:"13/5/2017",observaciones:''},


  ];
