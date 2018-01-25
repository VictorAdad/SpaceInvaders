import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'anexo2',
    templateUrl: './anexo2.component.html'
})

export class Anexo2Component {

	columns = ['Detenido', "Edad", "Direccion","accion"];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    public breadcrumb = [];
    public lat: number = 19.4968732;
    public lng: number = -99.7232673;
    public latMarker: number = 19.4968732;
    public lngMarker: number = -99.7232673;
    public zoom: number = 10;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){

        // super();
    }
ngOnInit(){
        var rows = {};
        rows['Detenido'] = "Ulises Morales" 
        rows['Edad'] = "20"
        rows['Direccion'] = "Calle Colima #34 Col. México"
        
        
        this.dataSource = new TableService(this.paginator, [rows]);
    }
}