import { BasePaginationComponent } from './../base/pagination/component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Entrevista } from '@models/entrevista/entrevista';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl:'./component.html',
})
export class EntrevistaComponent extends BasePaginationComponent implements OnInit{

    public columns = [ 'entrevistado', 'calidadEntrevistado', 'fechaCreacion'];
    public dataSource: TableService | null;
    public data: Entrevista[] = [];
    public casoId: number = null;
    public haveCaso: boolean=false;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    public breadcrumb = [];
    public apiUrl= '';//cambiar esta URL cuando este el servicio por caso
    public pag: number = 0;


	constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB) {super();}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.apiUrl=`/v1/base/entrevistas/casos/${this.casoId}/page`;

                if(this.onLine.onLine){
                    this.page();
                }else{
                    this.db.get("casos", this.casoId).then(caso=>{
                        if (caso){
                            if(caso["entrevistas"]){
                                this.dataSource = new TableService(this.paginator, caso["entrevistas"] as Entrevista[]);
                            }
                        }
                    });
                }
            }
            else{
                this.http.get(this.apiUrl).subscribe((response) => {
                    this.data = response.data as Entrevista[];
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
        this.pageSub = this.http.get(
            `/v1/base/entrevistas/casos/${this.casoId}/page?f=${this.pageFilter}&p=${this.pageIndex}&tr=${this.pageSize}`
        ).subscribe(
            (response) => {
                this.data = [];
                this.loadList = false;
                response.data.forEach(object => {
                    this.pag = response.totalCount;
                    this.data.push(object);
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            },
            (error) => {
                this.loadList = false
            }
        );
    }
}
