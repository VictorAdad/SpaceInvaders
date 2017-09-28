import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Relacion } from '@models/relacion'

@Component({
    templateUrl:'./relacion.component.html',
    selector:'relacion'
})

export class RelacionComponent{
  
    public casoId: number   = null;
	public displayedColumns = ['Tipo', 'Elementos'];
	public data:Relacion[]  = [];
	public dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService){}

	ngOnInit() {
    	console.log('-> Data Source', this.dataSource);

        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });

        if(this.onLine.onLine){
            this.http.get('/v1/base/casos/'+this.casoId+'/relaciones').subscribe((response) => {
                this.data = response as Relacion[];
                this.dataSource = new TableService(this.paginator, this.data);
            });
        }
  	}
}
