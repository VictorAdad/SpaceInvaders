import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { ArchivoTemporal } from '@models/determinacion/archivoTemporal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class ArchivoTemporalComponent {
	public breadcrumb = [];
	public apiUrl = '/v1/base/archivos-temporales';
	columns = ['creadoPor', 'fechaCreacion'];
	public dataSource: TableService | null;
	public data: ArchivoTemporal[] = [];
	public casoId: number = null;
	public haveCaso: boolean = false;
	@ViewChild(MdPaginator)
	paginator: MdPaginator;
	public pag: number = 0;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.haveCaso = true;
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle de caso" });
				this.page('/v1/base/archivos-temporales/casos/'+this.casoId+'/page');
			}

		});
	}

	public changePage(_e) {
        this.page('/v1/base/archivos-temporales/casos/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
    }

    public page(url: string) {
        this.data = [];
        this.http.get(url).subscribe((response) => {
            //console.log('Paginator response', response.data);

            response.data.forEach(object => {
                this.pag = response.totalCount;
                //console.log("Respuestadelitos", response["data"]);
                this.data.push(Object.assign(new ArchivoTemporal(), object));
                //response["data"].push(Object.assign(new Caso(), object));
                this.dataSource = new TableService(this.paginator, this.data);
            });
            console.log('Datos finales', this.dataSource);
        });
    }
}