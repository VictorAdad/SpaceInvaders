import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { FormatosLocal, FormatosService } from '@services/formatos/formatos.service';
import { InformeBaseComponent } from '@components-app/informe-homologado/informe-base.component';
import {Observable} from 'rxjs';
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
        var items = [];
        for (var a in localStorage) {
            if (a.indexOf("Principal") >= 0) {
                items.push(JSON.parse(localStorage.getItem(a)));
            }
        }
        console.log('<<< Aqui estoy en el paginador >>>', items);
        this.dataSource = new TableService(this.paginator, items);
        console.log('<<< BaseBoolean >>>', InformeBaseComponent.userOption);
    }

    public onPrint(numeroReferencia) {
        console.log("Hola si entré al onPrint");
        let timer = Observable.timer(1);
        timer.subscribe(t => {
            let result;
            result = JSON.parse(localStorage.getItem('Principal_'+numeroReferencia));
            this.formatoServ.replaceWord(this.formatoServ.formatos["F1_IPH"].nombre, "F1_IPH", this.setFormato.setDataIPH(result));
        });
        console.log("Hola si salí al onPrint");
    }
}
