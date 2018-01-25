import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'paginador',
    templateUrl: './component.html'
})

export class PaginadorHomologado extends BasePaginationComponent{

    public displayedColumns = ['tipo', 'calle', 'colonia', 'localidad', 'estado'];
    public breadcrumb = [];
    columns = ['nombre', 'fecha', 'accion'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        super();
    }

    ngOnInit(){
        var rows = {};
        rows['nombre'] = "juan de dios Lopez Contreras" 
        rows['fecha'] = "22/03/2017"
        rows['accion'] = "X"
        
        this.dataSource = new TableService(this.paginator, [rows,rows,rows]);
    }

    public onPrint() {
        console.log('<<< Click!! >>>')
        let url='../../../assets/formatos/IPH Word.docx';    
        window.open(url, 'Download');
    }
    

}
