import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { SolicitudServicioPolicial } from '@models/solicitud-preliminar/solicitudServicioPolicial';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class PoliciaComponent {
	columns = ['oficio', 'comisario'];
	public dataSource: TableService | null;
	public data: SolicitudServicioPolicial[];
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
                this.http.get('/v1/base/policias').subscribe((response) => {
                    this.data = response.data as SolicitudServicioPolicial[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get('/v1/base/policias').subscribe((response) => {
	                 this.data = response.data as SolicitudServicioPolicial[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        });  
  	}
}
