import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'anexo1',
    templateUrl: './anexo1.component.html'
})

export class Anexo1Component {

    public breadcrumb = [];
    columns = ['detenido', 'comprendio', 'primer'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }

    ngOnInit(){
        var rows = {};
        rows['detenido'] = "12372368476327432" 
        rows['comprendio'] = "Noé Robles Camacho"
        rows['primer'] = "Policia Federal"
        
        this.dataSource = new TableService(this.paginator, [rows]);
    }


}