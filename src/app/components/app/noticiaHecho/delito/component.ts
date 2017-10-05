import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import {Caso} from '@models/caso' 
import { HttpService} from '@services/http.service';

@Component({
	selector : 'delito',
    templateUrl:'./component.html'
})
export class DelitoComponent{
    public pag: number = 0;

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
    private onLine : OnLineService;
    constructor(private _tabla: CIndexedDB, _activeRoute: ActivatedRoute, _onLine: OnLineService,private http:HttpService){

        this.db=_tabla;
        this.activeRoute = _activeRoute;
        this.onLine= _onLine;
    }

    ngOnInit(){
        var superDatos=[];
        this.activeRoute.params.subscribe(params => {
            this.id = parseInt(params['id']);
            if (!isNaN(this.id) && !this.onLine.onLine ){
                this.db.get("casos",this.id).then(
                    casoR=>{
                        if (casoR){
                            this.caso=casoR as Caso;
                            if(casoR["delitos"])
                                this.dataSource = new TableService(this.paginator, casoR["delitos"]);    
                        }
                    });
            }else{
                this.http.get('/v1/base/delitos-casos').subscribe((response) => {
                        this.pag = response.totalCount;
                        console.log("Respuestadelitos",response["data"]);
                        this.dataSource = new TableService(this.paginator, response["data"]);
                    });
            }    
            
                
            
        });
        

    	this.data = data;

    }

    swap(e){
        e.principal=!e.principal;
        //this.db.update("casos",this.caso);
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


