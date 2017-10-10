import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Perito } from '@models/solicitud-preliminar/perito';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class PeritoComponent {
	public data: Perito[];
    public casoId: number = null;
    public hasCaso: boolean=false;
    public breadcrumb = [];
    public apiUrl: string = "/v1/base/solicitudes-pre-pericial";

	columns = ['tipo', 'oficio'];
	dataSource: TableService | null;
	/*data: Perito[] = [
		{id : 1, tipo: 'Fundamento A',  oficio: 'Plazo A'},
		{id : 2, tipo: 'Fundamento B',  oficio: 'Plazo B'},
		{id : 3, tipo: 'Fundamento C',  oficio: 'Plazo C'},
	];*/
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
    	/*this.dataSource = new TableService(this.paginator, this.data);

    	this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
		});*/
		
		this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.hasCaso=true;
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.http.get(this.apiUrl).subscribe((response) => {
                    this.data = response.data as Perito[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get(this.apiUrl).subscribe((response) => {
	                 this.data = response.data as Perito[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        });
  	}
}
/*export interface Perito {
	id:number
	tipo: string;
	oficio: string;
}*/