import { Component, ViewChild } from '@angular/core';
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
export class EntrevistaComponent {

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
        private db:CIndexedDB) {}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.apiUrl=`/v1/base/entrevistas/casos/${this.casoId}/page`;

                if(this.onLine.onLine){
                    this.page(this.apiUrl);
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
        if(this.onLine.onLine){
            this.page(this.apiUrl+'?p='+_e.pageIndex+'&tr='+_e.pageSize);
        }
    }

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Entrevista[];
            Logger.log("Loading armas..");
            Logger.log(this.data);
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }
}
