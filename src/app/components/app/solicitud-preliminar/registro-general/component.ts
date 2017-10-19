import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { RegistroGeneral } from '@models/solicitud-preliminar/registroGeneral';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class RegistroGeneralComponent {
	columns = ['fundamento', 'plazo'];
	public dataSource: TableService | null;
	public data: RegistroGeneral[];
    public casoId: number = null;
    public haveCaso: boolean=false;
	@ViewChild(MatPaginator) 
	paginator: MatPaginator;
    public breadcrumb = [];
    public apiUrl:string="/v1/base/solicitudes-pre-registros/casos/{id}/page";

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.apiUrl=this.apiUrl.replace("{id}",String(this.casoId));
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.http.get(this.apiUrl).subscribe((response) => {
                    this.data = response.data as RegistroGeneral[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get(this.apiUrl).subscribe((response) => {
	                 this.data = response.data as RegistroGeneral[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        }); 
  	}
}