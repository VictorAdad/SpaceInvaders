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


@Component({
    templateUrl: 'estado.component.html',
})
export class estadosCatalogosComponent {
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

    ngOnInit() {
        this._activeRoute.params.subscribe(params => {
            if(this.onLine.onLine)
                this.page('/v1/catalogos/estado/page');
        });
    }

    public changePage(_e){
        if(this.onLine.onLine){
            this.page('/v1/catalogos/estado/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.totalCount = response.totalCount;
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }
}
