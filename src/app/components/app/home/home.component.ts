import {Component, OnInit} from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { Caso } from '@models/caso';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent implements OnInit {

    private db: CIndexedDB;
    casos: Caso[] = [];
    

    constructor(private route: ActivatedRoute, private _db: CIndexedDB) {
        this.db = _db;
    }

    ngOnInit(){
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