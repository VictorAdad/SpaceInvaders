import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';


import {Delito} from '@models/delito';

@Component({
	selector : 'delito',
    templateUrl:'./component.html'
})

export class DelitoComponent{
	_columns = ['nombre', 
        // 'redaccion', 
        'principal'];
	data=[];
	dataSource: TableService | null;
    @ViewChild(MdPaginator) paginator: MdPaginator;
    

    constructor(){}

    ngOnInit(){
    	this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
    }

    swap(e){
        e.principal=!e.principal;
        console.log(e);
    }

}



 const data = [
	{nombre: 'Marco Guzman', redaccion: 'lorem', principal:true},
    {nombre: 'Marco Guzman', redaccion: 'lorem', principal:false}
];


