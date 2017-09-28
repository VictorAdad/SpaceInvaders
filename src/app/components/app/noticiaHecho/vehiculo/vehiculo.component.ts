import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { ActivatedRoute } from '@angular/router';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Vehiculo } from '@models/vehiculo'

@Component({
    selector: 'vehiculo',
    templateUrl:'./vehiculo.component.html'
})

export class VehiculoComponent{

    public casoId: number = null;
	public displayedColumns = ['tipo', 'marca', 'color', 'modelo', 'placa'];
	public data: Vehiculo[] = [];
	public dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService) { }

	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/casos/'+this.casoId+'/vehiculos').subscribe((response) => {
                        this.data = response as Vehiculo[];
                        this.dataSource = new TableService(this.paginator, this.data);
                    });
                }                
            }
        });  
  	}
}
