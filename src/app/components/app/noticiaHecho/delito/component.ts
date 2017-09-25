import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';


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
    db:CIndexedDB;
    @ViewChild(MdPaginator) paginator: MdPaginator;
    

    constructor(private _tabla: CIndexedDB){
        this.db=_tabla;
    }

    ngOnInit(){
        var superDatos=[];
        this.db.list("delitos").then(
            lista=>{
                let delitos:Delito[];
                delitos=lista as Delito[];
                for (let delito of delitos) {
                    this.db.get("catalogoDelitos_delitos",delito.id,"indiceCatalogoDelitos_delitos").then(
                        tt=>{
                            this.db.relationship(tt as any[], "catalogoDelitosId","catalogoDelitos","id")
                                .then(datos=>{
                                    if ((datos as any[]).length){
                                        delito["delitos"]=datos;
                                        this.dataSource = new TableService(this.paginator, delitos);
                                    }
                                });
                    });
                }
        });
    	this.data = data;

        this.db.manyToManyAll(
            "delitos","id",
            "catalogoDelitos_delitos","delitosId","catalogoDelitosId",
            "catalogoDelitos","id"
            ).then(lista=>{
                console.log("manyTomany",lista);
            });
        
    }

    swap(e){
        e.principal=!e.principal;
        var dato={
            id:e.id,
            principal:e.principal
        };
        this.db.update("delitos",dato);
    }

}

export class CatalagoDelitoDelito{
    catalogoDelitosId:number;
    delitoId:number;
    id:number;
}



 const data = [
	{nombre: 'Marco Guzman', redaccion: 'lorem', principal:true},
    {nombre: 'Marco Guzman', redaccion: 'lorem', principal:false}
];


