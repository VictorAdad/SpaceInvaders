import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { FormatosLocal, FormatosService } from '@services/formatos/formatos.service';
import { InformeBaseComponent } from '@components-app/informe-homologado/informe-base.component';
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
        this.dataSource = new TableService(this.paginator, [result]);

        console.log('<<< BaseBoolean >>>', InformeBaseComponent.userOption);

    }

    public onPrint() {
        let result
        result = JSON.parse(localStorage.getItem('Principal'));
        this.formatoServ.replaceWord(this.formatoServ.formatos["F1_IPH"].nombre, "F1_IPH", this.setFormato.setDataIPH(result));
    }

    public changeFill() {
        InformeBaseComponent.userOption = true;        
    }
    

}
