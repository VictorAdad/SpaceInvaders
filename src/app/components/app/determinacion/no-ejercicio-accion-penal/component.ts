import { BasePaginationComponent } from './../../base/pagination/component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { NoEjercicioAccionPenal } from '@models/determinacion/no-ejercicio-accion-penal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";
import { CasoService } from '@services/caso/caso.service';

@Component({
	templateUrl: './component.html',
})
export class NoEjercicioAccionPenalComponent extends BasePaginationComponent implements OnInit {
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

	constructor(
        private route: ActivatedRoute, 
        private http: HttpService, 
        private onLine: OnLineService, 
        public casoServ: CasoService,
        private router: Router ,
        private db: CIndexedDB) { super();}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.haveCaso = true;
				this.casoId = +params['casoId'];
                this.casoServ.find(this.casoId).then(
                    caso => {
                        if(!this.casoServ.caso.hasRelacionVictimaImputado && !this.casoServ.caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )
				this.apiUrl=this.apiUrl.replace("{idCaso}",String(this.casoId));
				this.page();
				this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
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
        `/v1/base/no-ejercicio-accion/casos/${this.casoId}/page?f=${this.pageFilter}&p=${this.pageIndex}&tr=${this.pageSize}`
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
