import {Component, OnInit} from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { Caso } from '@models/caso';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent implements OnInit {

    private db: CIndexedDB;
    private onLine: OnLineService;
    private http: HttpService;
    casos: Caso[] = [];
    

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
                this.casos = response as Caso[];
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
}