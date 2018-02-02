import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
  selector: 'anexo9',
  templateUrl: './anexo9.component.html'
})

export class Anexo9Component extends InformeBaseComponent {

  columns = ['tipo', "cantidad", "especificacion", "accion"];
  dataSource: TableService | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public breadcrumb = [];

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();
  }

  ngOnInit() {
    var rows = {};
    rows['tipo'] = "Objeto de Gran Tamaño"
    rows['cantidad'] = "1"
    rows['especificacion'] = "Refrigerador"


    this.dataSource = new TableService(this.paginator, [rows]);
  }
}
