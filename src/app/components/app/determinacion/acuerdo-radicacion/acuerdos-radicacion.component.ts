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

   public apiUrl='/v1/base/acuerdosradicacion';
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
                this.http.get('/v1/base/caso/'+this.casoId+'/acuerdoradicacion').subscribe((response) => {
                    this.data = response as AcuerdoRadicacion[];
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }

        });  
    }
}


