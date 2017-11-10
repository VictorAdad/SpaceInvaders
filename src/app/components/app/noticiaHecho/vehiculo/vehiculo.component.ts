import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { ActivatedRoute } from '@angular/router';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Vehiculo } from '@models/vehiculo';
import { CIndexedDB } from '@services/indexedDB';

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

    constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB) { }

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
                }else{
                    this.db.get("casos",this.casoId).then(caso=>{
                        if (caso){
                            if(caso["vehiculos"]){
                                this.dataSource = new TableService(this.paginator, caso["vehiculos"]);
                            }
                        }
                    });
                }                
            }
        });  
  	}

    public changePage(_e) {
        console.log('Page index', _e.pageIndex);
        console.log('Page size', _e.pageSize);
        console.log('Id caso', this.casoId);
        this.vehiculos = [];
        this.page('/v1/base/vehiculos/casos/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.http.get(url).subscribe((response) => {
            //console.log('Paginator response', response.data);
            
            response.data.forEach(object => {
                this.pag = response.totalCount;
                //console.log("Respuestadelitos", response["data"]);
                this.vehiculos.push(Object.assign(new Vehiculo(), object));
                this.dataSource = new TableService(this.paginator, this.vehiculos);
            });
            console.log('Datos finales', this.dataSource);
        });
    }
}
