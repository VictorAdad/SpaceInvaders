import {Component, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
  selector: 'anexo6',
  templateUrl: './anexo6.component.html'
})

export class Anexo6Component extends InformeBaseComponent {

  public breadcrumb = [];
  columns = ['victima', 'responsable', 'accion'];
  dataSource: TableService | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();
  }

  ngOnInit() {
    var rows = {};
    rows['victima'] = "Humberto Sánchez"
    rows['responsable'] = "Noé Robles Camacho"

    this.dataSource = new TableService(this.paginator, [rows]);
  }


}
