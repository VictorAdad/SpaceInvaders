import { Component, ViewChild, OnInit } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
	selector : 'persona',
    templateUrl:'./component.html'
})

export class PersonaComponent implements OnInit{
	columns = ['tipo', 'nombre', 'razonSocial', 'alias'];
	data: Persona[];
	dataSource: TableService | null;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(){}

    ngOnInit(){
    	this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
    }

}

export class Persona {
	id          : number;
    tipo        : string;
    nombre      : string;
    razonSocial : string;
    alias       : string;
 }

 const data: Persona[] = [
	{id:1,	tipo: 'Persona física', nombre: 'Marco Guzman', razonSocial:'', alias:''}
];
