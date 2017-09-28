import { Component, ViewChild, OnInit } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService} from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';
import { Persona } from '@models/persona';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';

@Component({
    selector : 'persona',
    templateUrl:'./component.html'
})

export class PersonaComponent implements OnInit{

    public casoId: number = null;

    columns = ['tipo', 'nombre', 'razonSocial', 'alias'];
    data: Persona[] = [];
    dataSource: TableService | null;
    tabla: CIndexedDB;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(
        private _tabla: CIndexedDB,
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService){
        this.tabla = _tabla;
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
        if(this.onLine.onLine){
            this.http.get('/v1/base/casos/'+this.casoId+'/personas').subscribe((response) => {
                this.data = response as Persona[];
                this.dataSource = new TableService(this.paginator, this.data);
            });
        }else{
            //Nota: si marca error es por que ya existe la base de datos y no se le puede agregar una nueva tabla
            //para solucionarlo borra la base evomatik
            this.tabla.list("personas").then(lista => {
                this.dataSource = new TableService(this.paginator, lista);
            });
        }    
    }


}
