import { Component, ViewChild } from '@angular/core';
import { FacultadNoInvestigar } from '@models/facultadNoInvestigar';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'./facultades-no-investigar.component.html',
    selector:'facultades-no-investigar'
})

export class FacultadesNoInvestigarComponent{
	displayedColumns = ['Remitente','Motivos','Creado por', 'Fecha'];
	data:FacultadNoInvestigar[];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(){}

	ngOnInit() {
      this.data=data;
    	this.dataSource = new TableService(this.paginator, this.data);
    	console.log('-> Data Source', this.dataSource);
  	}
}

const data: FacultadNoInvestigar[] = [
      {id:1,sintesisHechos: "Acuerdo 1",superiorJerarquico:"",remitente:"", medioAlternativo:"",motivos:"Motivos",datosPrueba:"Datos de prueba",creadoPor: 'Usuario1',fechaCreacion:"12/5/2017",observaciones:''},


  ];
