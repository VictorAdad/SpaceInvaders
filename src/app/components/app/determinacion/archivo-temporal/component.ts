import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { ArchivoTemporal } from '@models/determinacion/archivoTemporal';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class ArchivoTemporalComponent {
	public breadcrumb = [];
	public apiUrl='/v1/base/archivos-temporales';
	columns = ['creadoPor', 'fechaCreacion'];
	public dataSource: TableService | null;
	public data: ArchivoTemporal[];
	public casoId: number = null;
	public haveCaso: boolean=false;
	@ViewChild(MdPaginator) 
	paginator: MdPaginator;
 
   constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

   ngOnInit() {
	this.route.params.subscribe(params => {
		if(params['casoId']){
		  this.haveCaso=true;
			this.casoId = +params['casoId'];
			this.http.get(this.apiUrl).subscribe((response) => {
				this.data = response.data as ArchivoTemporal[];
				this.dataSource = new TableService(this.paginator, this.data);
			});
			this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
		}

	});  
}
}