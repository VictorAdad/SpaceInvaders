import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { Relacion } from '@models/relacion'
import { CIndexedDB } from '@services/indexedDB';
import { NoticiaHechoService } from '@services/noticia-hecho.service';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";

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
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB,
        private casoService:CasoService
        ){}

	ngOnInit() {
    	Logger.log('-> Data Source', this.dataSource);

        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/tipo-relacion-persona/casos/'+this.casoId+'/page').subscribe((response) => {
                        this.pag = response.totalCount;
                        this.relaciones = response.data as Relacion[];
                        this.dataSource = new TableService(this.paginator, this.relaciones);
                    });
                    this.casoService.find(this.casoId);
                }else{
                    //this.db.get("casos",this.casoId).then(caso=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var caso=this.casoService.caso;
                        if (caso){
                            if(caso["tipoRelacionPersonas"]){
                                this.pag = caso["tipoRelacionPersonas"].length;
                                this.dataSource = new TableService(this.paginator, caso["tipoRelacionPersonas"]);
                            }
                        }
                    });
                }
            }
        });
  	}

    public changePage(_e) {
        if(this.onLine.onLine){
            Logger.log('Page index', _e.pageIndex);
            Logger.log('Page size', _e.pageSize);
            Logger.log('Id caso', this.casoId);
            this.relaciones = [];
            this.page('/v1/base/tipo-relacion-persona/casos/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
        }
    }

    public page(url: string) {
        this.http.get(url).subscribe((response) => {
            //Logger.log('Paginator response', response.data);
            
            response.data.forEach(object => {
                this.pag = response.totalCount;
                //Logger.log("Respuestadelitos", response["data"]);
                this.relaciones.push(Object.assign(new Relacion(), object));
                this.dataSource = new TableService(this.paginator, this.relaciones);
            });
            Logger.log('Datos finales', this.dataSource);
        });
    }
}
