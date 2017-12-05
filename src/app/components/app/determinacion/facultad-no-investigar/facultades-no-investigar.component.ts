import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { FacultadNoInvestigar } from '@models/determinacion/facultad-no-investigar';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

@Component({
  templateUrl: './facultades-no-investigar.component.html',
  selector: 'facultades-no-investigar'
})

export class FacultadesNoInvestigarComponent {
  public breadcrumb = [];
  public apiUrl = '/v1/base/facultades-no-investigar';
  displayedColumns = ['Remitente', 'Motivos', 'Fecha'];
  public dataSource: TableService | null;
  public data: FacultadNoInvestigar[];
  public casoId: number = null;
  public haveCaso: boolean = false;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  public pag: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['casoId']) {
        this.haveCaso = true;
        this.casoId = +params['casoId'];
        this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle de caso" });
        this.page('/v1/base/facultades-no-investigar/casos/'+this.casoId+'/page');
      }

    });
  }
  public changePage(_e) {
    this.page('/v1/base/facultades-no-investigar/casos/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
  }

  public page(url: string) {
    this.data = [];
    this.http.get(url).subscribe((response) => {
      //Logger.log('Paginator response', response.data);

      response.data.forEach(object => {
        this.pag = response.totalCount;
        //Logger.log("Respuestadelitos", response["data"]);
        this.data.push(Object.assign(new FacultadNoInvestigar(), object));
        //response["data"].push(Object.assign(new Caso(), object));
        this.dataSource = new TableService(this.paginator, this.data);
      });
      Logger.log('Datos finales', this.dataSource);
    });
  }
}
