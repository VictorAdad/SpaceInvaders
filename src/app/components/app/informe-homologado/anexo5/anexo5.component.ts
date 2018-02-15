import {Component, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
    selector: 'anexo5',
    templateUrl: './anexo5.component.html',
    styleUrls: ['./anexo5.component.css'],
})

export class Anexo5Component extends InformeBaseComponent {

    public breadcrumb = [];
    columns = ['detenido', 'descripcion', 'cantidad', 'accion'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService) 
    {
        super();
    }

    ngOnInit() {
        var arr = [];

        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Oscar Jimenez', 'descripcion': 'Descripcion 3', 'cantidad': '345'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
        var row = {'detenido': 'Juan Perez', 'descripcion': 'Descripcion 2', 'cantidad': '87'};
        arr.push(row);
        var row = {'detenido': 'Pedro Morales', 'descripcion': 'Descripcion 1', 'cantidad': '99'};
        arr.push(row);
          

        console.log(arr);
        this.dataSource = new TableService(this.paginator, arr);

    }
}
