import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '@utils/table/table.service';
import { Observable } from 'rxjs';
import { Arma } from '@models/arma';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";

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

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB, private casoService:CasoService){}

	ngOnInit() {
        Logger.log(this.route)
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.page('/v1/base/armas/casos/'+this.casoId+'/page');
                    this.casoService.find(this.casoId);
                }else{
                    //this.db.get("casos",this.casoId).then(caso=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var caso = this.casoService.caso;
                        Logger.log("Caso en armas ->",caso);
                        if (caso){
                            if(caso["armas"]){
                                this.pag = caso["armas"].length;
                                this.dataSource = new TableService(this.paginator, caso["armas"].slice(0,10));
                            }
                        }
                    });
                    //});
                }
            }
        });
  	}

    public changePage(_e){
        this.page('/v1/base/armas/casos/'+this.casoId+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize,_e);
    }  

    public page(url: string,_e=null){
        if (this.onLine.onLine){
            this.http.get(url).subscribe((response) => {
                this.pag = response.totalCount;
                this.data = response.data as Arma[];
                Logger.log("Loading armas..");
                Logger.log(this.data);
                this.dataSource = new TableService(this.paginator, this.data);
            });
        }else{
            if (_e){
                var caso = this.casoService.caso;
                if (caso["armas"]){
                    var datos=caso["armas"];
                    let x=_e.pageSize*_e.pageIndex;
                    this.dataSource = new TableService(this.paginator, datos.slice(x,x+_e.pageSize));
                }
            }
        }
        
    }




}  
