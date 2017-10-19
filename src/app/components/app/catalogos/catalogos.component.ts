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
import { _catalogos } from './catalogos';

@Component({
    templateUrl: 'catalogos.component.html',
    styleUrls: ['catalogos.component.css']
})
export class CatalogosComponent {
    columns = ['nombre'];
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

    setClickedRow(row) {
        this.selectedRow = row.id;
        switch(row.id){
            case 1:{
                this.router.navigate(['/catalogo-armas']);
                break;
            }
        }
    }

    ngOnInit() {
        this._activeRoute.params.subscribe(params => {
            if(params['tipo']){
                this.tipo = params['tipo'];
                this.catalogo = _catalogos[this.tipo];
                if(this.onLine.onLine)
                    this.page(this.catalogo.url+'/page');
            }
        });
    }

    public changePage(_e){
        if(this.onLine.onLine){
            this.page(this.catalogo.url+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.totalCount = response.totalCount;
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }
}

const data: Catalogo[] = [
    { id: 1, nombre: 'Armas', descripcion: 'Descripción 1' },
    { id: 2, nombre: 'Vehículos', descripcion: 'Descripción 2' },
];

export interface Catalogo {
    id: number
    nombre: string;
    descripcion: string;
}

export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Catalogo[]> {
        return Observable.of(data);
    }

    disconnect() { }
}