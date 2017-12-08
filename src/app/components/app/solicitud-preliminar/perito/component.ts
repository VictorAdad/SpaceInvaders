import { BasePaginationComponent } from './../../base/pagination/component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Perito } from '@models/solicitud-preliminar/perito';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

@Component({
	templateUrl: './component.html',
})
export class PeritoComponent extends BasePaginationComponent implements OnInit {

	public pag: number = 0;

	public data: Perito[] = [];
	public casoId: number = null;
	public hasCaso: boolean = false;
	public breadcrumb = [];
	public apiUrl: string = "/v1/base/solicitudes-pre-pericial/casos/{id}/page";
  public solicitudes=[];
	columns = ['tipo', 'oficio'];
	dataSource: TableService | null;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private route: ActivatedRoute,
		private http: HttpService,
		private onLine: OnLineService,
		private db: CIndexedDB) {
      super();
    }

	ngOnInit() {

		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.hasCaso = true;
				this.casoId = +params['casoId'];
			//	this.apiUrl = this.apiUrl.replace("{id}", String(this.casoId));
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
				if(this.onLine.onLine){
					this.page();
				}else{
                    this.db.get("casos", this.casoId).then(caso=>{
                        if (caso){
                            if(caso["solicitudPrePericiales"]){
                                this.dataSource = new TableService(this.paginator, caso["solicitudPrePericiales"] as Perito[]);
                            }
                        }
                    });
                }
			}
			else {
				this.http.get(this.apiUrl).subscribe((response) => {
					this.data = response.data as Perito[];
					Logger.log(this.data)
					this.dataSource = new TableService(this.paginator, this.data);
				});
			}
		});
	}


  public changePage(_e){
    console.log('changePage()', _e);
    this.dataSource = null;
    this.pageIndex  = _e.pageIndex;
    this.pageSize   = _e.pageSize;
    this.page();
}

public filterPage(_event){
    if(typeof _event == 'string'){
        this.dataSource = null;
        this.pageFilter = _event;
        this.page();
    }
}

  public page(){
    this.loadList = true;
    this.http.get(
        `/v1/base/solicitudes-pre-pericial/casos/${this.casoId}/page?f=${this.pageFilter}&p=${this.pageIndex}&tr=${this.pageSize}`
    ).subscribe(
        (response) => {
            this.solicitudes = [];
            this.loadList = false;
            response.data.forEach(object => {
                this.pag = response.totalCount;
                this.solicitudes.push(object);
                this.dataSource = new TableService(this.paginator, this.solicitudes);
            });
        },
        (error) => {
            this.loadList = false
        }
    );
}
}
