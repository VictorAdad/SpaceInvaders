import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '@utils/table/table.service';
import { Observable } from 'rxjs';
import { Arma } from '@models/arma';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./arma.component.html',
    selector:'arma'
})
export class ArmaComponent{

    public casoId: number = null;
	public displayedColumns = ['Arma', 'Tipo', 'Marca', 'Calibre'];
    public dataSource: TableService;
    public data: Arma[] = [];
    public pag: number = 0;

	@ViewChild(MdPaginator) 
    paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.page('/v1/base/casos/'+this.casoId+'/armas');
                }else{
                    this.db.get("casos",this.casoId).then(caso=>{
                        if (caso){
                            if(caso["arma"]){
                                this.dataSource = new TableService(this.paginator, caso["arma"]);
                            }
                        }
                    });
                }
            }
        });
  	}

    public changePage(_e){
        this.page('/v1/base/casos/'+this.casoId+'/armas?p='+_e.pageIndex+'&tr='+_e.pageSize);
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Arma[];
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }




}  
