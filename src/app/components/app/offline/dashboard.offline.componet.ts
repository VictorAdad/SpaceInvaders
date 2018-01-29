import { Component, OnInit} from '@angular/core';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { ActivatedRoute } from '@angular/router';
import { Logger } from '../../../services/logger.service';
import { TableService} from '@utils/table/table.service';


@Component({
    templateUrl : './dashboard.offline.componet.html',
    styles: [
        `
        .centrar {
            text-align: center;
        }
        `,
        `
        .negrita{
            font-weight: bold;
        }
        `]
})
export class DashBoardOffline implements OnInit{
	constructor(
		private route: ActivatedRoute,
		private _db: CIndexedDB,
		private onLine: OnLineService,
		) {
    }
    public dataSource: TableService | null;

    public displayedColumns = ['id', 'descripcion'];

    public dataSourceCatalogos: TableService | null;

    public displayedColumnsCatalogos = ['nombre', 'descripcion'];

    datos = {
        total: [],
        pendientes: [],
        catalogos: []
    };
    
    ngOnInit(){
        var obj = this;
        this._db.list('sincronizar').then( list => {
            obj.datos.total = (list as any[]);
            obj.datos.total.length
            obj.datos.pendientes = obj.datos.total.filter( e => {
                return e.pendiente; 
            })
            this.dataSource = new TableService(null, obj.datos.pendientes);
            Logger.logColor('Sincronizar','red',obj.datos);
        });

        this._db.list('catalogos').then( list => {
            const lista = list as any[];
            for (let i =0 ; i < lista.length; i++) {
                const e = lista[i];
                obj.datos.catalogos.push({
                    id: e['id'],
                    cantidad: e['arreglo']['length'] ? e['arreglo']['length'] : Object.keys(e['arreglo']).length
                });
            }
            this.dataSourceCatalogos = new TableService(null, obj.datos.catalogos);
        });
    }

    jsonToString(json){
        return JSON.stringify(json,null,'\t')
    }
}
