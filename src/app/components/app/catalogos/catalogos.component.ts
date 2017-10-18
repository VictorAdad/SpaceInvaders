import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { _catalogos } from './catalogos';

@Component({
    templateUrl: 'catalogos.component.html',
    styleUrls: ['catalogos.component.css']
})

export class CatalogosComponent {
    columns = ['nombre', 'descripcion'];
    dataSource: ExampleDataSource;
    hidePaginator: boolean = false;
    selectedRow: Number;

    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(private router: Router, private _activeRoute: ActivatedRoute) {}

    setClickedRow(row) {
        this.selectedRow = row.id;
        switch(row.id){
            case 1:{
                this.router.navigate(['/catalogo-armas']);
                break;
            }
        }
    }

    ngOnInit() {
        this._activeRoute.params.subscribe(params => {
            if(params['tipo']){
                console.log(_catalogos);
                console.log(_catalogos[params['tipo']]);
            }
        });
        this.dataSource = new ExampleDataSource();
    }
}

const data: Catalogo[] = [
    { id: 1, nombre: 'Armas', descripcion: 'Descripción 1' },
    { id: 2, nombre: 'Vehículos', descripcion: 'Descripción 2' },
];

export interface Catalogo {
    id: number
    nombre: string;
    descripcion: string;
}

export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Catalogo[]> {
        return Observable.of(data);
    }

    disconnect() { }
}