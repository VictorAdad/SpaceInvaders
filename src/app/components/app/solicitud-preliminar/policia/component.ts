import { BasePaginationComponent } from './../../base/pagination/component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { SolicitudServicioPolicial } from '@models/solicitud-preliminar/solicitudServicioPolicial';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl: './component.html',
})
export class PoliciaComponent extends BasePaginationComponent implements OnInit {
    columns = ['oficio', 'comisario'];
    public apiUrl = "/v1/base/solicitudes-pre-policias/casos/{id}/page";
    public dataSource: TableService | null;
    public data: SolicitudServicioPolicial[] = [];
    public casoId: number = null;
    public haveCaso: boolean = false;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    public breadcrumb = [];
    public pag: number = 0;

    constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { super();}
    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']) {
                this.haveCaso = true;
                this.casoId = +params['casoId'];
                this.apiUrl = this.apiUrl.replace("{id}", String(this.casoId));
                this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
                this.page();
            }
            else {
                this.http.get(this.apiUrl).subscribe((response) => {
                    this.data = response.data as SolicitudServicioPolicial[];
                    Logger.log(this.data)
                    this.dataSource = new TableService(this.paginator, this.data);
                });
            }
        });
    }



    public changePage(_e){
      console.log('changePage()', _e);
      this.dataSource = null;
      this.pageIndex  = _e.pageIndex;
      this.pageSize   = _e.pageSize;
      this.page();
  }

  public filterPage(_event){
      if(typeof _event == 'string'){
          this.dataSource = null;
          this.pageFilter = _event;
          this.page();
      }
  }



    public page(){
      this.loadList = true;
      this.pageSub = this.http.get(
          `/v1/base/solicitudes-pre-policias/casos/${this.casoId}/page?f=${this.pageFilter}&p=${this.pageIndex}&tr=${this.pageSize}`
      ).subscribe(
          (response) => {
              this.data = [];
              this.loadList = false;
              response.data.forEach(object => {
                  this.pag = response.totalCount;
                  this.data.push(object);
                  this.dataSource = new TableService(this.paginator, this.data);
              });
          },
          (error) => {
              this.loadList = false
          }
      );
  }
}
