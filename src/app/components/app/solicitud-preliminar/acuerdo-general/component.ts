import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { AcuerdoGeneral } from '@models/solicitud-preliminar/acuerdoGeneral';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class AcuerdoGeneralComponent {

    public pag: number = 0;
	public columns = ['fundamento', 'plazo'];
	public dataSource: TableService | null;
	public data: AcuerdoGeneral[] = [];
    public casoId: number = null;
    public haveCaso: boolean=false;
	@ViewChild(MdPaginator) 
    paginator: MdPaginator;
    public breadcrumb = [];
    public apiUrl="/v1/base/solicitudes-pre-acuerdos/casos/{id}/page";


	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}
	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['casoId']){
                console.log('casoID---');
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.apiUrl=this.apiUrl.replace("{id}",String(this.casoId));
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"});
                this.page('/v1/base/solicitudes-pre-acuerdos/casos/' + this.casoId + '/page');
            }
            else{
                console.log('sin casoId');
            	 this.http.get(this.apiUrl).subscribe((response) => {
	                 this.data = response.data as AcuerdoGeneral[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        });  
      }
      
      public changePage(_e) {
        this.page('/v1/base/solicitudes-pre-acuerdos/casos/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.data = [];
        this.http.get(url).subscribe((response) => {
            //console.log('Paginator response', response.data);
            
            response.data.forEach(object => {
                this.pag = response.totalCount;
                //console.log("Respuestadelitos", response["data"]);
                this.data.push(Object.assign(new AcuerdoGeneral(), object));
                //response["data"].push(Object.assign(new Caso(), object));
                this.dataSource = new TableService(this.paginator, this.data);
            });
            console.log('Datos finales', this.dataSource);
        });
    }

}
