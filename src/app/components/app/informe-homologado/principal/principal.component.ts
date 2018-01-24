import { Component, ViewChild } from '@angular/core';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'principal',
    templateUrl: './principal.component.html'
})

export class PrincipalInformeHomologadoCreate {

    public breadcrumb = [];
    columns = ['cuip', 'nombre', 'institucion', "entidadMunicipio", "accion"];
    columns2 = ['riesgoPara', 'tipo', "accion"];
    dataSource: TableService | null;
    dataSource2: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginator2: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();

    }

    ngOnInit(){
        var rows = {};
        rows['cuip'] = "12372368476327432" 
        rows['nombre'] = "Noé Robles Camacho"
        rows['institucion'] = "Policia Federal"
        rows['entidadMunicipio'] = "Xalapa, Veracruz (10,018)"
        
        this.dataSource = new TableService(this.paginator, [rows]);

        var rows2 = {};
        rows2['riesgoPara'] = "Víctima" 
        rows2['tipo'] = "Salud"

        this.dataSource2 = new TableService(this.paginator2, [rows2]);
    }

}