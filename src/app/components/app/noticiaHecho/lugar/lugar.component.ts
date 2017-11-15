import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Lugar } from '@models/lugar';
import { CIndexedDB } from '@services/indexedDB';
import { CasoService } from '@services/caso/caso.service';

@Component({
    selector:'lugar',
    templateUrl:'./lugar.component.html'
})

export class LugarComponent{

    public casoId: number = null;
	public displayedColumns = ['tipo', 'calle', 'colonia', 'localidad', 'estado'];
    public data: Lugar[] = [];
    public dataSource: TableService | null;
    public pag: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB, private casoService:CasoService){}

    ngOnInit(){
        console.log('-> Data Source', this.dataSource);
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
                                this.dataSource = new TableService(this.paginator, caso["lugares"]);
                            }
                        }
                    });
                        
                    //});
                }
            }
        });
    }

    public changePage(_e){
        if(this.onLine.onLine){
            this.page('/v1/base/lugares/casos/'+this.casoId+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Lugar[];
            console.log("Loading Lugares..");
            console.log(this.data);
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }

}
