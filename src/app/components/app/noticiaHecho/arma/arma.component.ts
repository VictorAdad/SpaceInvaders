import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
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

	@ViewChild(MatPaginator) 
    paginator: MatPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}

	ngOnInit() {
        console.log(this.route)
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.page('/v1/base/armas/casos/'+this.casoId+'/page');

                }else{
                    this.db.get("casos",this.casoId).then(caso=>{
                        console.log("Caso en armas ->",caso);
                        if (caso){
                            if(caso["arma"]){
                                this.dataSource = new TableService(this.paginator, caso["arma"] as Arma[]);
                            }
                        }
                    });
                }
            }
        });
  	}

    public changePage(_e){
        if(this.onLine.onLine){
            this.page('/v1/base/casos/'+this.casoId+'/armas?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Arma[];
            console.log("Loading armas..");
            console.log(this.data);
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }




}  
