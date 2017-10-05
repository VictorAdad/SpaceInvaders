import { Component, ViewChild, OnInit } from '@angular/core';
// import { Component} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { MdPaginator } from '@angular/material';
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
    _columns = ['nombre', 'principal'];
    public delitoCasos: DelitoCaso[] = [];
    dataSource: TableService | null;
    db: CIndexedDB;
    @ViewChild(MdPaginator) paginator: MdPaginator;

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
            if (params['id'] && this.onLine.onLine) {
                this.id = parseInt(params['id']);
                this.page('/v1/base/casos/' + this.id + '/delitos-casos');
            } else {
                this.db.get("delitos-casos", this.id).then(
                    casoR => {
                        if (casoR) {
                            this.delitoCaso = casoR as DelitoCaso;
                            if (casoR["delitos"])
                                this.dataSource = new TableService(this.paginator, casoR["delitos"]);
                        }
                    });
            }
        });
    }

    public changePage(_e) {
        console.log('Page index', _e.pageIndex);
        console.log('Page size', _e.pageSize);
        console.log('Id caso', this.id);
        this.delitoCasos = [];
        this.page('/v1/base/casos/' + this.id + '/delitos-casos?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
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
        e.principal = !e.principal;
        //this.db.update("casos",this.caso);
    }
}


