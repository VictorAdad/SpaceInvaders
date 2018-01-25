import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'anexo3',
    templateUrl: './anexo3.component.html'
})

export class Anexo3Component {
 	columns = ['usodelafuerza', "primerresponsable", "nivel","accion"];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    public breadcrumb = [];

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }

 ngOnInit(){
        var rows = {};
        rows['usodelafuerza'] = "Yahir Ruiz" 
        rows['primerresponsable'] = "Ricardo Crespo"
        rows['nivel'] = "Control de Contacto"
        
        
        this.dataSource = new TableService(this.paginator, [rows]);
    }
}