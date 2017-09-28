import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '@utils/table/table.service';
import { Observable } from 'rxjs';
import { Arma } from '@models/arma';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { _config} from '@app/app.config';
import 'rxjs/add/operator/map'

@Component({
    templateUrl:'./arma.component.html',
    selector:'arma'
})
export class ArmaComponent{

    public casoId: number = null;
	public displayedColumns = ['Arma', 'Tipo', 'Marca', 'Calibre'];
    public dataSource: TableService;
    public data: Arma[] = [];
	@ViewChild(MdPaginator) 
    paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService){}

	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
        if(this.onLine.onLine){
            this.http.get('/v1/base/casos/'+this.casoId+'/armas').subscribe((response) => {
                this.data = response as Arma[];
                this.dataSource = new TableService(this.paginator, this.data);
            });
        }
  	}
}  
