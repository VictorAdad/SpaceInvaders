import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@services/http.service';

@Component({
    selector: 'anexo8',
    templateUrl: './anexo8.component.html'
})

export class Anexo8Component {

    public breadcrumb = [];
    columns = ['nombre', 'objeto', 'accion'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }

    ngOnInit(){
        var rows = {};
        rows['nombre'] = "Yair Ruiz" 
        rows['objeto'] = "Arma de fuego"
        
        this.dataSource = new TableService(this.paginator, [rows]);
    }


}