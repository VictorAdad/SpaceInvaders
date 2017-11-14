import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TableService} from '@utils/table/table.service';
import { CIndexedDB } from '@services/indexedDB';
import { Persona } from '@models/persona';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CasoService } from '@services/caso/caso.service';

@Component({
    selector : 'persona',
    templateUrl:'./component.html'
})

export class PersonaComponent implements OnInit{

    public casoId: number = null;
    public pag: number = 0;

    columns = ['tipo', 'nombre', 'razonSocial', 'alias'];
    data: Persona[] = [];
    dataSource: TableService | null;
    tabla: CIndexedDB;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _tabla: CIndexedDB,
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private casoService:CasoService){
        this.tabla = _tabla;
    }

    ngOnInit(){
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.page('/v1/base/personas-casos/casos/'+this.casoId+'/page');
                    this.casoService.find(this.casoId);
                }else{
                    //Nota: si marca error es por que ya existe la base de datos y no se le puede agregar una nueva tabla
                    //para solucionarlo borra la base evomatik
                    //this.tabla.get("casos",this.casoId).then(caso => {
                    this.casoService.find(this.casoId).then(r=>{
                        var caso = this.casoService.caso;
                        if (caso["personaCasos"]){
                            this.pag = caso["personaCasos"].length;
                            console.log("CASO ->",caso);
                            // var data=[];
                            // for (var i = 0; i < lista["length"]; ++i) {
                            //     let item = lista[i];
                            //     let tipoInterviniente=(item["personaCaso"])[0].tipoInterviniente["id"];
                            //     let tipo = (item["personaCaso"])[0].tipoInterviniente["tipo"]?(item["personaCaso"])[0].tipoInterviniente["tipo"]:"";
                            //     let nombre = item["nombre"];
                            //     let razonSocial = item["razonSocial"];
                            //     if ( (item["personaCaso"])[0].caso.id==this.casoId )
                            //         data.push({tipoInterviniente:{tipo:tipo}, persona:{nombre:nombre}, razonSocial:razonSocial, alias:"", id:item["id"]});
                            // }
                            this.dataSource = new TableService(this.paginator, caso["personaCasos"]);
                        }
                        
                    });
                } 
            }
        });   
    }

    public changePage(_e) {
        this.page('/v1/base/personas-casos/casos/'+this.casoId+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize)
    }

    public page(url:string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Persona[];
            this.dataSource = new TableService(this.paginator, this.data);
        });
    }


}
