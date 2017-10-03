import {Component, OnInit, ViewChild} from '@angular/core';
import { MdPaginator } from '@angular/material';
import { ActivatedRoute }    from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { TableService } from '@utils/table/table.service';
import { Caso } from '@models/caso';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent implements OnInit {

    private db: CIndexedDB;
    private onLine: OnLineService;
    private http: HttpService;
    public casos: Caso[] = [];
    public dataSource: TableService;
    @ViewChild(MdPaginator) 
    paginator: MdPaginator;
    

    constructor(
        private route: ActivatedRoute,
        private _db: CIndexedDB,
        private _onLine: OnLineService,
        private _http: HttpService
        ) {
        this.db     = _db;
        this.onLine = _onLine;
        this.http   = _http;
    }

    ngOnInit(){
        if(this.onLine.onLine){
            this.http.get('/v1/base/casos').subscribe((response) => {
                response.data.forEach(object => {
                    this.casos.push(Object.assign(new Caso(), object));
                    this.dataSource = new TableService(this.paginator, this.casos);
                });
            });
        }else{
            this.db.list('casos').then(list => {
                for(let object in list){
                    let caso = new Caso();
                    Object.assign(caso, list[object]);
                    this.casos.push(caso);
                    this.dataSource = new TableService(this.paginator, this.casos);
                }
            });
        }
    }

    public page(_e){
        if(this.onLine.onLine){
            this.http.get('/v1/base/casos?p='+_e.pageIndex+'&tr='+_e.pageSize).subscribe((response) => {
                this.casos = [];
                response.data.forEach(object => {
                    this.casos.push(Object.assign(new Caso(), object));
                    this.dataSource = new TableService(this.paginator, this.casos);
                });
                console.log('Casos: ', this.casos);
            });
        }
    }

    guardarCaso(caso){
        if(this.onLine.onLine){
            this.db.clear("casos").then(t=>{
                this.db.update("casos",caso).then(t=>{
                    console.log(caso);
                });
            });
        }
        
    }
}