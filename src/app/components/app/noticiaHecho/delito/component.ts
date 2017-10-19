import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { Caso } from '@models/caso';
import { DelitoCaso } from '@models/delitoCaso';
import { HttpService } from '@services/http.service';

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
    delitoCaso: DelitoCaso;
    private onLine: OnLineService;
    constructor(private _tabla: CIndexedDB, _activeRoute: ActivatedRoute, _onLine: OnLineService, private http: HttpService) {

        this.db = _tabla;
        this.activeRoute = _activeRoute;
        this.onLine = _onLine;
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(params => {
            if (params['id']) {
                if (this.onLine.onLine){
                    this.id = parseInt(params['id']);
                    this.page('/v1/base/delitos-casos/casos/' + this.id + '/page');   
                }else{
                    this.db.get("casos", this.id).then(
                    casoR => {
                        if (casoR) {
                            this.delitoCaso = casoR as DelitoCaso;
                            if (casoR["delitos"])
                                this.dataSource = new TableService(this.paginator, casoR["delitos"]);
                        }
                    });
                }    
            } 
        });
    }

    public setClickedRow(row){
        console.log('row',row);
        this.http.get('/v1/base/delitos-casos/'+row.id+'/casos/'+this.id).subscribe((response) => {
            console.log('response', response);
            this.page('/v1/base/delitos-casos/casos/' + this.id + '/page');  
        });
    }

    public changePage(_e) {
        this.pageIndex = _e.pageIndex;
        this.pageSize = _e.pageSize;
        console.log('Page index', _e.pageIndex);
        console.log('Page size', _e.pageSize);
        console.log('Id caso', this.id);
        this.delitoCasos = [];
        this.page('/v1/base/delitos-casos/casos/' + this.id + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.delitoCasos = [];
        this.http.get(url).subscribe((response) => {
            //console.log('Paginator response', response.data);
            
            response.data.forEach(object => {
                this.pag = response.totalCount;
                //console.log("Respuestadelitos", response["data"]);
                this.delitoCasos.push(Object.assign(new DelitoCaso(), object));
                //response["data"].push(Object.assign(new Caso(), object));
                this.dataSource = new TableService(this.paginator, this.delitoCasos);
            });
            console.log('Datos finales', this.dataSource);
        });
    }

    swap(e) {
        console.log('row',e);
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
        });
        
        //this.db.update("casos",this.caso);
    }
}


