import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { NoEjercicioAccionPenal } from '@models/determinacion/no-ejercicio-accion-penal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class NoEjercicioAccionPenalComponent {
	public apiUrl: string = "/v1/base/no-ejercicio-accion";
	public breadcrumb = [];
	columns = ['ambito', 'creadoPor', 'fechaCreacion'];
	public dataSource: TableService | null;
	public data: NoEjercicioAccionPenal[];
	public casoId: number = null;
	public haveCaso: boolean = false;
	@ViewChild(MatPaginator)
	paginator: MatPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.haveCaso = true;
				this.casoId = +params['casoId'];
				this.http.get(this.apiUrl).subscribe((response) => {
					this.data = response.data as NoEjercicioAccionPenal[];
					this.dataSource = new TableService(this.paginator, this.data);
				});
				this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
			}

		});
	}
}