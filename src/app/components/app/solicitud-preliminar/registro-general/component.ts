import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
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
	@ViewChild(MdPaginator) 
	paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.http.get('/v1/base/registros-generales').subscribe((response) => {
                    this.data = response.data as RegistroGeneral[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get('/v1/base/registros-generales').subscribe((response) => {
	                 this.data = response.data as RegistroGeneral[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        }); 
  	}
}