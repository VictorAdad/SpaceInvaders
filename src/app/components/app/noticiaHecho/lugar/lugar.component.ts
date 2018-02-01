import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService} from '@utils/table/table.service';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Lugar } from '@models/lugar';
import { CIndexedDB } from '@services/indexedDB';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
import { _config} from '@app/app.config';

@Component({
    selector: 'lugar',
    templateUrl: './lugar.component.html'
})

export class LugarComponent extends BasePaginationComponent {

    public casoId: number = null;
    public displayedColumns = ['tipo', 'calle', 'colonia', 'localidad', 'estado'];
    public data: Lugar[] = [];
    public dataSource: TableService | null;
    public pag: number = 0;
    public IdMexico = _config.optionValue.idMexico; 
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB,
        private casoService:CasoService){
        super();
    }

    ngOnInit(){
        Logger.log('-> Data Source', this.dataSource);
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/lugares/casos/'+this.casoId+'/page').subscribe((response) => {
                        this.pag = response.totalCount;
                        this.data = response.data as Lugar[];
                        this.dataSource = new TableService(this.paginator, this.data);
                    });
                    this.casoService.find(this.casoId);
                }else{
                    //this.db.get("casos",this.casoId).then(caso=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var caso=this.casoService.caso;
                        if (caso){
                            if(caso["lugares"]){
                                this.pag = caso["lugares"].length;
                                this.dataSource = new TableService(this.paginator, caso["lugares"].slice(0,10));
                            }
                        }
                    });
                    //});
                }
            }
        });
    }

    public changePage(_e){
        this.page('/v1/base/lugares/casos/'+this.casoId+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize,_e);
    }  

    public page(url: string,_e=null){
        if (this.onLine.onLine)
            this.http.get(url).subscribe((response) => {
                this.pag = response.totalCount;
                this.data = response.data as Lugar[];
                Logger.log("Loading Lugares..");
                Logger.log(this.data);
                this.dataSource = new TableService(this.paginator, this.data);
            });
        else{
            if (_e){
                var caso = this.casoService.caso;
                if (caso["lugares"]){
                    var datos=caso["lugares"];
                    let x=_e.pageSize*_e.pageIndex;
                    this.dataSource = new TableService(this.paginator, datos.slice(x,x+_e.pageSize));
                }
            }
        }
    }

}
