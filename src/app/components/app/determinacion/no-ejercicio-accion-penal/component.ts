import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { NoEjercicioAccionPenal } from '@models/determinacion/no-ejercicio-accion-penal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

@Component({
	templateUrl: './component.html',
})
export class NoEjercicioAccionPenalComponent {
	public apiUrl: string = "/v1/base/no-ejercicio-accion/casos/{idCaso}/page";
	public breadcrumb = [];
	columns = ['ambito','fechaCreacion'];
	public dataSource: TableService | null;
	public data: NoEjercicioAccionPenal[];
	public casoId: number = null;
	public haveCaso: boolean = false;
	@ViewChild(MatPaginator)
	paginator: MatPaginator;
    public pag: number = 0;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.haveCaso = true;
				this.casoId = +params['casoId'];
				this.apiUrl=this.apiUrl.replace("{idCaso}",String(this.casoId));
				this.page(this.apiUrl);
				this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
			}

		});
	}

	public changePage(_e){
        if(this.onLine.onLine){
			Logger.log(this.apiUrl)
            this.page(this.apiUrl+'?p='+_e.pageIndex+'&tr='+_e.pageSize);

        }
    }

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as NoEjercicioAccionPenal[];
            Logger.log("Loading armas..");
            Logger.log(this.data);
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }
}
