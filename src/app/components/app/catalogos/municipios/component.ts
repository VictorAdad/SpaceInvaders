import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '@utils/table/table.service';
import { Observable } from 'rxjs';
import { Municipio } from '@models/catalogo/municipio';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'component.html',
})
export class municipioCatalogosComponent{

    public casoId: number = null;
	  public displayedColumns = ['Nombre'];
    public dataSource: TableService;
    public data: Municipio[] = [];
    public pag: number = 0;

	@ViewChild(MatPaginator)
    paginator: MatPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
        console.log(this.route)
        this.route.parent.params.subscribe(params => {
                if(this.onLine.onLine){
                    this.page('/v1/catalogos/municipio/page');

                }
            }
        );
  	}

    public changePage(_e){
        if(this.onLine.onLine){
            this.page('/v1/catalogos/municipio/page?p='+_e.pageIndex+'&tr='+_e.pageSize);

        }
    }

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Municipio[];
            console.log("Loading catalogo Municipio..");
            console.log(this.data);
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }




}
