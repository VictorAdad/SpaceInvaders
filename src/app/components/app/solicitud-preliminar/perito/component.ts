import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Perito } from '@models/solicitud-preliminar/perito';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class PeritoComponent {

	public pag: number = 0;

	public data: Perito[] = [];
	public casoId: number = null;
	public hasCaso: boolean = false;
	public breadcrumb = [];
	public apiUrl: string = "/v1/base/solicitudes-pre-pericial/casos/{id}/page";

	columns = ['tipo', 'oficio'];
	dataSource: TableService | null;

	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

	ngOnInit() {

		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.hasCaso = true;
				this.casoId = +params['casoId'];
				this.apiUrl = this.apiUrl.replace("{id}", String(this.casoId));
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
				this.page(this.apiUrl);
			}
			else {
				this.http.get(this.apiUrl).subscribe((response) => {
					this.data = response.data as Perito[];
					console.log(this.data)
					this.dataSource = new TableService(this.paginator, this.data);
				});
			}
		});
	}

	public changePage(_e) {
		this.page(this.apiUrl + '?p=' + _e.pageIndex + '&tr=' + _e.pageSize);
	}

	public page(url: string) {
		this.data = [];
		this.http.get(url).subscribe((response) => {
			//console.log('Paginator response', response.data);

			response.data.forEach(object => {
				this.pag = response.totalCount;
				//console.log("Respuestadelitos", response["data"]);
				this.data.push(Object.assign(new Perito(), object));
				//response["data"].push(Object.assign(new Caso(), object));
				this.dataSource = new TableService(this.paginator, this.data);
			});
			console.log('Datos finales', this.dataSource);
		});
	}
}
