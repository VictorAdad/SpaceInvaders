import {Component, OnInit} from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { Http, Response } from '@angular/http';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { Caso } from '@models/caso';
import { Observable } from 'rxjs';
import { _config} from '@app/app.config';
import 'rxjs/add/operator/map'

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent implements OnInit {

    private db: CIndexedDB;
    private onLine: OnLineService;
    private http: Http;
    casos: Caso[] = [];
    

    constructor(
        private route: ActivatedRoute,
        private _db: CIndexedDB,
        private _onLine: OnLineService,
        private _http: Http
        ) {
        this.db     = _db;
        this.onLine = _onLine;
        this.http   = _http;
    }

    ngOnInit(){
        if(this.onLine.onLine){
            this.list().subscribe((response) => {
                this.casos = response;
            });
        }else{
            this.db.list('casos').then(list => {
                for(let object in list){
                    let caso = new Caso();
                    Object.assign(caso, list[object]);
                    console.log('-> Caso', caso.created);
                    this.casos.push(caso);
                }
            });
        }
    }

    private list(): Observable<Caso[]>{
        return this.http.get(_config.api.host+'/v1/base/casos')
            .map((response: Response) => response.json());
    }
}