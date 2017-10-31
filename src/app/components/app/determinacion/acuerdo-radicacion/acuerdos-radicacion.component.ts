import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { AcuerdoRadicacion } from '@models/determinacion/acuerdoRadicacion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./acuerdos-radicacion.component.html',
    selector:'acuerdos-radicacion'
})

export class AcuerdosRadicacionComponent{

   public breadcrumb = [];
   public apiUrl:string="/v1/base/acuerdos/casos/{id}/page";
   columns = ['Fecha'];
   public dataSource: TableService | null;
   public data: AcuerdoRadicacion[];
   public casoId: number = null;
   public haveCaso: boolean=false;
   @ViewChild(MatPaginator)
   paginator: MatPaginator;
   public pag: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}
  ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['casoId']){
              this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.apiUrl = this.apiUrl.replace("{id}", String(this.casoId));
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
                this.page(this.apiUrl);
            }

        });
    }

    public changePage(_e) {
        this.page(this.apiUrl + '?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.data = [];
        this.http.get(url).subscribe((response) => {
            //console.log('Paginator response', response.data);

            response.data.forEach(object => {
                this.pag = response.totalCount;
                //console.log("Respuestadelitos", response["data"]);
                this.data.push(Object.assign(new AcuerdoRadicacion(), object));
                //response["data"].push(Object.assign(new Caso(), object));
                this.dataSource = new TableService(this.paginator, this.data);
            });
            console.log('Datos finales', this.dataSource);
        });
    }
}


