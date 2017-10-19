import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { RequerimientoInformacion } from '@models/solicitud-preliminar/requerimientoInformacion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class RequerimientoInformacionComponent {
    columns = ['numeroOficio', 'fechaRequerimiento', 'nombreAutoridad'];
    public apiUrl: string = "/v1/base/solicitudes-pre-info";
	public dataSource: TableService | null;
	public data: RequerimientoInformacion[];
    public casoId: number = null;
    public haveCaso: boolean=false;
    public breadcrumb = [];
	@ViewChild(MatPaginator) 
	paginator: MatPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.http.get(this.apiUrl).subscribe((response) => {
                    this.data = response.data as RequerimientoInformacion[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get(this.apiUrl).subscribe((response) => {
	                 this.data = response.data as RequerimientoInformacion[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        }); 
  	}
}