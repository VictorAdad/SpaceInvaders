import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Inspeccion } from '@models/solicitud-preliminar/inspeccion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class InspeccionComponent {

    public apiUrl='/v1/base/solicitudes-pre-inspecciones/casos/{id}/page';
	columns = ['fecha', 'adscripcion'];
	public dataSource: TableService | null;
	public data: Inspeccion[];
    public casoId: number = null;
    public haveCaso: boolean=false;
	@ViewChild(MdPaginator) 
    paginator: MdPaginator;
    public breadcrumb = [];

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}
	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['casoId']){
            	this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.apiUrl=this.apiUrl.replace("{id}",String(this.casoId));
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"})
                this.http.get('/v1/base/solicitudes-pre-inspecciones').subscribe((response) => {
                    this.data = response.data as Inspeccion[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
            else{
            	 this.http.get('/v1/base/solicitudes-pre-inspecciones').subscribe((response) => {
	                 this.data = response.data as Inspeccion[];
	                 console.log(this.data)
	                 this.dataSource = new TableService(this.paginator, this.data);
	                });
            }
        });  
  	}
}
/*
Inspeccion {
    id: number;
    fecha: string;
    hora: string;
    adscripcion: string;
    descripcion: string;
*/

