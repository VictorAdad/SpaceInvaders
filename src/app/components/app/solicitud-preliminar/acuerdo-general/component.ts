import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { AcuerdoGeneral } from '@models/acuerdoGeneral';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class AcuerdoGeneralComponent {


	public columns = ['fundamento', 'plazo'];
	public dataSource: TableService | null;
	public data: AcuerdoGeneral[];
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
                this.http.get('/v1/base/caso/'+this.casoId+'/acuerdosgenerales').subscribe((response) => {
                    this.data = response as AcuerdoGeneral[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get('/v1/base/acuerdosgenerales').subscribe((response) => {
	                 this.data = response.data as AcuerdoGeneral[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        });  
  	}

}
