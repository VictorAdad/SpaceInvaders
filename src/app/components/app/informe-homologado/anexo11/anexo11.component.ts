import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
    selector: 'anexo11',
    templateUrl: './anexo11.component.html'
})

export class Anexo11Component extends InformeBaseComponent{

    public breadcrumb = [];
    columns = ['entrevistado', 'entrevistador', 'fechaHora'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        super();
    }

    ngOnInit(){
        var rows = {};
        rows['entrevistado'] = "Juan Perez" 
        rows['entrevistador'] = "José Morales"
        rows['fechaHora'] = "12/01/2018 11:23 am"
        
        this.dataSource = new TableService(this.paginator, [rows]);
    }

}