import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { _catalogos } from '../catalogos';

@Component({
    templateUrl: 'turno.component.html',
})
export class TurnoCatalogosComponent {
    columns = ['nombre','clave'];
    dataSource: TableService;
    hidePaginator: boolean = false;
    selectedRow: Number;
    catalogo: any;
    tipo: string;
    public totalCount: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB
        ) {}

    // setClickedRow(row) {
    //     this.selectedRow = row.id;
    //     switch(row.id){
    //         case 1:{
    //             //this.router.navigate(['/catalogo-armas']);
    //             break;
    //         }
    //     }
    // }

    ngOnInit() {
        console.log("INICIA");
        this.tipo = 'turno';
        this.catalogo = _catalogos[this.tipo];
        if(this.onLine.onLine)
            this.page(this.catalogo.url+'/page');
        //this.dataSource = new TableService(this.paginator, null);
        console.log("FIN INICIA",this);
           
    }

    public changePage(_e){
        if(this.onLine.onLine){
            this.page(this.catalogo.url+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            console.log("RESPONSE",response);
            this.totalCount = response.totalCount;
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }
}

const data: Catalogo[] = [
    
    
];

export interface Catalogo {
    id: number
    nombre: string;
    agencia: string;
    clave: string;
}
