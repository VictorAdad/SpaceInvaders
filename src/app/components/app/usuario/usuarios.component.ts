import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Usuario } from '@models/usuario';
import { Logger } from "@services/logger.service";


@Component({
    templateUrl:'./usuarios.component.html',
    selector:'usuarios'
})

export class UsuariosComponent{
	displayedColumns = ['Usuario', 'Nombre', 'Apellido paterno','Apellido materno','Acciones'];
	data:Usuario[];

	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(){}

	ngOnInit() {
   //    this.data = [
   //  {id:1,usuario:"Usuario",nombre: "Nombre Usuario",apellidoPaterno: "Apellido de Usuario",
   //  apellidoMaterno:"Apellido Materno de usuario",numeroContacto:"Data",sexo:"Data",distrito:"Data",
   //  fiscalia:"Data",agenciaAdscripcion:"Data",turno:"Data",email:"Data",numeroGafete:"Data",cargo:"Data",permiso:"Data",inhabilitado:false
   //  }
   // ];
    	this.dataSource = new TableService(this.paginator, this.data);

    	Logger.log('-> Data Source', this.dataSource);
  	}
 delete(id) {
    Logger.log('Usuario@delete()');
  }
}
