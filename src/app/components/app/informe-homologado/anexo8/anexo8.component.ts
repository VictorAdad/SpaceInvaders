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
    public divTipoArma = false;
    public divDinero = false;
    public divPersona = false;

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

    showTipoArma(value){
        (value=="true") ? this.divTipoArma = true : this.divTipoArma = false; 
    }
    showDinero(value){
        (value=="true") ? this.divDinero = true : this.divDinero = false; 
    }
    showPersona(value){
        (value=="true") ? this.divPersona = true : this.divPersona = false; 
    }


}