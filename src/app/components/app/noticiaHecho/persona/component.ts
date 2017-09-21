import { Component, ViewChild, OnInit } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';
import {Persona} from '@models/persona';

@Component({
    selector : 'persona',
    templateUrl:'./component.html'
})

export class PersonaComponent implements OnInit{
    columns = ['tipo', 'nombre', 'razonSocial', 'alias'];
    data=[];
    dataSource: TableService | null;
    tabla: CIndexedDB;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(){}

    ngOnInit(){
        //Nota: si marca error es por que ya existe la base de datos y no se le puede agregar una nueva tabla
        //para solucionarlo borra la base evomatik
        this.tabla=new CIndexedDB("Evomatik","PersonaDelito"); 
        this.tabla.list().then(lista=>{
            this.dataSource = new TableService(this.paginator, lista);
        });
        this.dataSource = new TableService(this.paginator, data);
    }

}

 const data = [
    {id:1,  tipo: 'Persona física', nombre: 'Marco Guzman', razonSocial:'', alias:''}
];
