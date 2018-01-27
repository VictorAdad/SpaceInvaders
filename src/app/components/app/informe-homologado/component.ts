import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { FormatosLocal, FormatosService } from '@services/formatos/formatos.service';
// import { FormatosGlobal} from '../solicitud-preliminar/formatos';

@Component({
    selector: 'paginador',
    templateUrl: './component.html'
})

export class PaginadorHomologado extends BasePaginationComponent{

    public setFormato = new FormatosLocal();
    // public formato = new FormatosGlobal(null,null,null,null,null);

    public displayedColumns = ['tipo', 'calle', 'colonia', 'localidad', 'estado'];
    public breadcrumb = [];
    columns = ['nombre', 'fecha', 'accion'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private formatoServ :FormatosService){
        super();
    }

    ngOnInit(){
        let result
        result = JSON.parse(localStorage.getItem('Principal'));

        console.log('<<< Aqui estoy en el paginador >>>', result);
        
        this.dataSource = new TableService(this.paginator, [result]);
    }

    public onPrint() {
        console.log('<<< Click!! >>>')

        this.setFormato.setDataIPH();
        this.formatoServ.replaceWord(this.formatoServ.formatos['F1_IPH'].nombre, 'F1_IPH');

        // let url='../../../assets/formatos/IPH.docx';    
        // window.open(url, 'Download');
    }
    

}
