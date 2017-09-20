import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
	selector : 'delito',
    templateUrl:'./component.html'
})

export class DelitoComponent{
	_columns = ['nombre', 'redaccion', 'principal'];
	data: Delito[];
	dataSource: TableService | null;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(){}

    ngOnInit(){
    	this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
    }

}

export class Delito {
    nombre    : string;
    redaccion : string;
    principal : string;
 }

 const data: Delito[] = [
	{nombre: 'Marco Guzman', redaccion: 'lorem', principal:'x'}
];


