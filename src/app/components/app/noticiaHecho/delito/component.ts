import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { Caso } from '@models/caso';
import { DelitoCaso } from '@models/delitoCaso';
import { GlobalService } from "@services/global.service";
import { HttpService } from '@services/http.service';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";

@Component({
    selector: 'delito',
    templateUrl: './component.html'
})
export class DelitoComponent {
    public pag: number = 0;
    public pageIndex: number = 0;
    public pageSize: number = 0;
    _columns = ['nombre', 'principal'];
    public delitoCasos: DelitoCaso[] = [];
    dataSource: TableService | null;
    db: CIndexedDB;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    activeRoute: ActivatedRoute;
    id: number;

    caso: Caso;
    delitoCaso: any;
    private onLine: OnLineService;
    public settings:ConfirmSettings={
        overlayClickToClose: false, // Default: true
        showCloseButton: true, // Default: true
        confirmText: "Continuar", // Default: 'Yes'
        declineText: "Cancelar",
    };
    constructor(
        private _tabla: CIndexedDB,
        _activeRoute: ActivatedRoute,
        _onLine: OnLineService,
        private http: HttpService,
        private confirmation: ConfirmationService,
        public globalService : GlobalService,
        private casoService:CasoService
        ){

        this.db = _tabla;
        this.activeRoute = _activeRoute;
        this.onLine = _onLine;
    }

    ngOnInit() {
        this.activeRoute.parent.params.subscribe(params => {
            if (params['id']) {
                if (this.onLine.onLine){
                    this.id = parseInt(params['id']);
                    this.page('/v1/base/delitos-casos/casos/' + this.id + '/page');   
                    this.casoService.find(this.id);
                }else{
                    this.id = parseInt(params['id']);
                    this.casoService.find(this.id).then(r=>{
                        this.delitoCaso=this.casoService.caso;
                        if (this.casoService.caso)
                            if (this.casoService.caso["delitoCaso"]){
                                this.pag = this.casoService.caso["delitoCaso"].length;
                                this.dataSource = new TableService(this.paginator, this.casoService.caso["delitoCaso"].slice(0,10));
                            }
                    });
                }    
            } 
        });
    }

    public setClickedRow(row){
        Logger.log('row',row);
        this.http.get('/v1/base/delitos-casos/'+row.id+'/casos/'+this.id).subscribe((response) => {
            Logger.log('response', response);
            this.page('/v1/base/delitos-casos/casos/' + this.id + '/page');  
        });
    }

    public changePage(_e) {
        this.pageIndex = _e.pageIndex;
        this.pageSize = _e.pageSize;
        Logger.log('Page index', _e.pageIndex);
        Logger.log('Page size', _e.pageSize);
        Logger.log('Id caso', this.id);
        this.delitoCasos = [];
        this.page('/v1/base/delitos-casos/casos/' + this.id + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize,_e);
    }

    public page(url: string,_e=null) {
        if (this.onLine.onLine){
            this.delitoCasos = [];
            this.http.get(url).subscribe((response) => {
                //Logger.log('Paginator response', response.data);
                
                response.data.forEach(object => {
                    this.pag = response.totalCount;
                    //Logger.log("Respuestadelitos", response["data"]);
                    this.delitoCasos.push(Object.assign(new DelitoCaso(), object));
                    //response["data"].push(Object.assign(new Caso(), object));
                    this.dataSource = new TableService(this.paginator, this.delitoCasos);
                });
                Logger.log('Datos finales', this.dataSource);
            });
        }else{
            if (_e){
                var caso = this.casoService.caso;
                if (caso["delitoCaso"]){
                    var datos=caso["delitoCaso"];
                    let x=_e.pageSize*_e.pageIndex;
                    this.dataSource = new TableService(this.paginator, datos.slice(x,x+_e.pageSize));
                }
            }
        }
    }

    swap(e) {
        Logger.log('row',e);
        this.confirmation.create('Advertencia','¿Está seguro de asignar a este delito como el delito principal?',this.settings).subscribe(
            (ans: ResolveEmit) => {
                if(ans.resolved){
                    if (this.onLine.onLine){
                        this.http.get('/v1/base/delitos-casos/'+e.id+'/casos/'+this.id).subscribe((response) => {
                            var msj = response.message;
                            if(msj.indexOf('correctamente') >= 0){
                                e.principal = true;
                                if(this.pageIndex!=0 || this.pageSize!=0){
                                    this.page('/v1/base/delitos-casos/casos/' + this.id + '/page?p=' + this.pageIndex + '&tr=' + this.pageSize);
                                }else{
                                    this.page('/v1/base/delitos-casos/casos/' + this.id + '/page'); 
                                }
                            }else{
                                e.principal = false;
                            }
                            this.globalService.openSnackBar('Nuevo delito asignado como principal');
                        });

                    }else{
                        let temId=Date.now();
                        let dato={
                            url:'/v1/base/delitos-casos/'+e.id+'/casos/'+this.id,
                            body:null,
                            options:[],
                            tipo:"get",
                            pendiente:true,
                            dependeDe:[this.id,e.id]
                        }
                        this.db.add("sincronizar",dato).then(p=>{
                            var casoR=this.casoService.caso;
                            if (casoR) {
                                if (casoR["delitoCaso"]){
                                    e.principal = true;
                                    var lista = casoR["delitoCaso"] as any[];
                                    for (var i = 0; i < lista.length; ++i) {
                                        lista[i].principal=false;
                                        if (lista[i].id==e.id){
                                            lista[i].principal=true;
                                        }
                                    }
                                    this.db.update("casos",casoR).then(casoU=>{
                                        var _e=this.paginator;
                                        let x=_e.pageSize*_e.pageIndex;
                                        this.dataSource = new TableService(this.paginator, this.casoService.caso["delitoCaso"].slice(x,x+_e.pageSize));
                                    });
                                    
                                }
                            }
                            this.globalService.openSnackBar('Nuevo delito asignado como principal');
                        }); 
                    }
                }
            }
        );
        
        //
    }
}


