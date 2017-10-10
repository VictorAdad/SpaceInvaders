import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Relacion } from '@models/relacion'
import { CIndexedDB } from '@services/indexedDB';
import { NoticiaHechoService } from '@services/noticia-hecho.service';

@Component({
    templateUrl:'./relacion.component.html',
    selector:'relacion'
})

export class RelacionComponent{
  
    public casoId: number   = null;
	public displayedColumns = ['Tipo', 'Elementos'];
	public relaciones:Relacion[]  = [];
	public dataSource: TableService | null;
    public pag: number = 0;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB,
        ){}

	ngOnInit() {
    	console.log('-> Data Source', this.dataSource);

        this.route.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/relaciones/casos/'+this.casoId+'/page').subscribe((response) => {
                        this.pag = response.totalCount;
                        this.relaciones = response.data as Relacion[];
                        this.dataSource = new TableService(this.paginator, this.relaciones);
                    });
                }else{
                    this.db.get("casos",this.casoId).then(caso=>{
                        if (caso){
                            if(caso["relacion"]){
                                this.dataSource = new TableService(this.paginator, caso["relacion"]);
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
        this.relaciones = [];
        this.page('/v1/base/casos/' + this.casoId + '/relaciones?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.http.get(url).subscribe((response) => {
            //console.log('Paginator response', response.data);
            
            response.data.forEach(object => {
                this.pag = response.totalCount;
                //console.log("Respuestadelitos", response["data"]);
                this.relaciones.push(Object.assign(new Relacion(), object));
                this.dataSource = new TableService(this.paginator, this.relaciones);
            });
            console.log('Datos finales', this.dataSource);
        });
    }
}
