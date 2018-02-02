import {Component, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
  selector: 'anexo7',
  templateUrl: './anexo7.component.html'
})

export class Anexo7Component extends InformeBaseComponent {

  public breadcrumb = [];
  columns = ['nombre', 'traslado', 'entrega', 'recibe', 'ubicacion', 'accion'];
  dataSource: TableService | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();
  }

  ngOnInit() {
    var rows = {};
    rows['nombre'] = "Yair Ruiz"
    rows['traslado'] = "DIF"
    rows['entrega'] = "Humberto Sánchez"
    rows['recibe'] = "Carmen Martínez"
    rows['ubicacion'] = "CDMX"

    this.dataSource = new TableService(this.paginator, [rows]);
  }


}
