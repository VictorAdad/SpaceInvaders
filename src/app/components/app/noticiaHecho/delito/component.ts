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
	_columns = ['nombre', 'principal'];
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
                            this.caso = casoR as Caso;
                            if(casoR["delitos"])
                                this.dataSource = new TableService(this.paginator, casoR["delitos"]);    
                        }
                    });
            }else{
                this.page(`/v1/base/casos/${this.id}/delitos-casos`);
            }    
            
                
            
        });
        

    	this.data = data;

    }

    public changePage(_e){
        this.page(`/v1/base/casos/${this.id}/delitos-casos?p=${_e.pageIndex}&tr=${_e.pageSize}`);
    }

    public page(url:string){
        this.http.get(url).subscribe((response) => {
            response.data.forEach(object => {
                this.pag = response.totalCount;
                console.log("Respuestadelitos",response["data"]);
                response["data"].push(Object.assign(new Caso(), object));
                this.dataSource = new TableService(this.paginator, response["data"]);
            });
        });
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


