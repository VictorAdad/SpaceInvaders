import { Component, OnInit, ViewChild } from "@angular/core";
import { InformeBaseComponent } from '@components-app/informe-homologado/informe-base.component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';

@Component({
    selector: 'documentos-iph',
    templateUrl: './documentosIph.component.html'
})

export class DocumentosIphComponent implements OnInit {

    public breadcrumb = [];
    columns = ['nombre', 'fecha'];
    dataSource: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit() {
        const rows = {};
        rows['nombre'] = 'Informe Policial Homologado';
        rows['fecha'] = '14/feb/2018';

        this.dataSource = new TableService(this.paginator, [rows]);

        console.log('<<< hhh >>>', this.dataSource);
    }
}
