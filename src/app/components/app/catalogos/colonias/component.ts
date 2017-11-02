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
    templateUrl: 'component.html',
})
export class ColoniaComponent {
    columns = ['nombre'];
    dataSource: TableService;
    hidePaginator: boolean = false;
    selectedRow: Number;
    catalogo: any;
    tipo: string = 'colonias';
    url: string = '/v1/catalogos/colonia';
    public totalCount: number = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB
        ) {}


    ngOnInit() {
        if(this.onLine.onLine)
            this.page(this.url+'/page');
    }

    public changePage(_e){
        if(this.onLine.onLine){
            this.page(this.url+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.totalCount = response.totalCount;
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }
}