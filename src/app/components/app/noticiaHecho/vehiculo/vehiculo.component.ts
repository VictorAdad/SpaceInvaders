import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { ActivatedRoute } from '@angular/router';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Vehiculo } from '@models/vehiculo';
import { CIndexedDB } from '@services/indexedDB';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
@Component({
    selector: 'vehiculo',
    templateUrl:'./vehiculo.component.html'
})

export class VehiculoComponent{

    public casoId: number = null;
	public displayedColumns = ['tipo', 'marca', 'color', 'modelo', 'placa'];
	public vehiculos: Vehiculo[] = [];
	public dataSource: TableService | null;
    public pag: number = 0;
	@ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB, private casoService:CasoService) { }

	ngOnInit() {
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/vehiculos/casos/'+this.casoId+'/page').subscribe((response) => {
                        this.pag = response.totalCount;
                        this.vehiculos = response.data as Vehiculo[];
                        this.dataSource = new TableService(this.paginator, this.vehiculos);
                    });
                    this.casoService.find(this.casoId);
                }else{
                    //this.db.get("casos",this.casoId).then(caso=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var caso = this.casoService.caso;
                        if (caso){
                            if(caso["vehiculos"]){
                                this.pag = caso["vehiculos"].length;
                                this.dataSource = new TableService(this.paginator, caso["vehiculos"]);
                            }
                        }
                    });
                }                
            }
        });  
  	}

    public changePage(_e) {
        Logger.log('Page index', _e.pageIndex);
        Logger.log('Page size', _e.pageSize);
        Logger.log('Id caso', this.casoId);
        this.vehiculos = [];
        this.page('/v1/base/vehiculos/casos/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.http.get(url).subscribe((response) => {
            //Logger.log('Paginator response', response.data);
            
            response.data.forEach(object => {
                this.pag = response.totalCount;
                //Logger.log("Respuestadelitos", response["data"]);
                this.vehiculos.push(Object.assign(new Vehiculo(), object));
                this.dataSource = new TableService(this.paginator, this.vehiculos);
            });
            Logger.log('Datos finales', this.dataSource);
        });
    }
}
