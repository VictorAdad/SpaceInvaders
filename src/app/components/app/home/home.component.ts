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
                this.casos.push(caso);
            }
        });
    }
    fecha (){
           let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

           var date = new Date ('12/02/1993');

           var dia = date.getDay();
           var mes = date.getMonth();
           var year = date.getFullYear();

           var user = 'Administrador del sistema'; //Necesita recibir el usuario 

           var x = 'Creado el '+ dia + ' de ' + meses[mes] + ' de ' + year + ' por el ' + user;
           return x;  
      }
}