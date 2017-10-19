import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Entrevista } from '@models/entrevista/entrevista';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class EntrevistaComponent {

	public columns = [ 'entrevistado', 'calidadEntrevistado','creadoPor', 'fechaCreacion'];
	public dataSource: TableService | null;
	public data: Entrevista[] = [];
    public casoId: number = null;
    public haveCaso: boolean=false;
	@ViewChild(MatPaginator) 
    paginator: MatPaginator;
    public breadcrumb = [];
    public apiUrl="/v1/base/entrevistas";

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.http.get(this.apiUrl).subscribe((response) => {
                    console.log(response);
                    this.data = response.data as Entrevista[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get(this.apiUrl).subscribe((response) => {
	                 this.data = response.data as Entrevista[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        });
  	}
}