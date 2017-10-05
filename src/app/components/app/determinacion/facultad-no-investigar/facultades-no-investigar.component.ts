import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { FacultadNoInvestigar } from '@models/determinacion/facultad-no-investigar';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
  templateUrl: './facultades-no-investigar.component.html',
  selector: 'facultades-no-investigar'
})

export class FacultadesNoInvestigarComponent {

  public apiUrl = '/v1/base/facultad-no-investigar';
  displayedColumns = ['Remitente', 'Motivos', 'Creado por', 'Fecha'];
  public dataSource: TableService | null;
  public data: FacultadNoInvestigar[];
  public casoId: number = null;
  public haveCaso: boolean = false;
  @ViewChild(MdPaginator)
  paginator: MdPaginator;

  constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['casoId']) {
        this.haveCaso = true;
        this.casoId = +params['casoId'];
        this.http.get('/v1/base/caso/' + this.casoId + '/facultad-no-investigar').subscribe((response) => {
          this.data = response as FacultadNoInvestigar[];
          this.dataSource = new TableService(this.paginator, this.data);
        });
      }

    });
  }
}
