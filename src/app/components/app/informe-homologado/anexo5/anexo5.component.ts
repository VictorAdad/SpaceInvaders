import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
    selector: 'anexo5',
    templateUrl: './anexo5.component.html'
})

export class Anexo5Component extends InformeBaseComponent{

    public breadcrumb = [];
    columns = ['detenido', 'descripcion', 'cantidad', 'accion'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        super();
    }

    ngOnInit(){
        var rows = {};
        rows['detenido'] = "Yair Ruiz" 
        rows['descripcion'] = "Control de contacto"
        rows['cantidad'] = "4"
        
        this.dataSource = new TableService(this.paginator, [rows]);
    }


}