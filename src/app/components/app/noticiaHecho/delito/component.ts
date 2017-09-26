import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';

import {Caso} from '@models/caso' 


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

    activeRoute:ActivatedRoute;
    id:number;

    caso:Caso;

    constructor(private _tabla: CIndexedDB, _activeRoute: ActivatedRoute){

        this.db=_tabla;
        this.activeRoute = _activeRoute;
    }

    ngOnInit(){
        var superDatos=[];
        this.activeRoute.params.subscribe(params => {
            this.id = parseInt(params['id']);
            if (!isNaN(this.id)){
                this.db.get("casos",this.id).then(
                    casoR=>{
                        this.caso=casoR as Caso;
                        this.dataSource = new TableService(this.paginator, casoR["delitos"]);
                        console.log("->caso", casoR);
                    });
            }    
            
                
            
        });
        // this.db.list("delitos").then(
        //     lista=>{
        //         let delitos:Delito[];
        //         delitos=lista as Delito[];
        //         for (let delito of delitos) {
        //             this.db.get("catalogoDelitos_delitos",delito.id,"indiceCatalogoDelitos_delitos").then(
        //                 tt=>{
        //                     this.db.relationship(tt as any[], "catalogoDelitosId","catalogoDelitos","id")
        //                         .then(datos=>{
        //                             if ((datos as any[]).length){
        //                                 delito["delitos"]=datos;
        //                                 this.dataSource = new TableService(this.paginator, delitos);
        //                             }
        //                         });
        //             });
        //         }
        // });

    	this.data = data;

    }

    swap(e){
        e.principal=!e.principal;
        this.db.update("casos",this.caso);
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


