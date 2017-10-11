import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
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
   public apiUrl:string="/v1/base/acuerdos";
   columns = ['Titulo', 'Fecha'];
   public dataSource: TableService | null;
   public data: AcuerdoRadicacion[];
   public casoId: number = null;
   public haveCaso: boolean=false;
   @ViewChild(MdPaginator) 
   paginator: MdPaginator;

  constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db:CIndexedDB){}
  ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['casoId']){
              this.haveCaso=true;
                this.casoId = +params['casoId'];
                this.http.get(this.apiUrl).subscribe((response) => {
                    console.log(response);
                    this.data = response.data as AcuerdoRadicacion[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
            }

        });  
    }
}


