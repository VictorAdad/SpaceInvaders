import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { NoEjercicioAccionPenal } from '@models/determinacion/no-ejercicio-accion-penal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class NoEjercicioAccionPenalComponent {

	columns = ['ambito', 'calidadEntrevistado', 'creadoPor', 'fechaCreacion'];
	public dataSource: TableService | null;
	public data: NoEjercicioAccionPenal[];
	public casoId: number = null;
	public haveCaso: boolean = false;
	@ViewChild(MdPaginator)
	paginator: MdPaginator;

	constructor(private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService, private db: CIndexedDB) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.haveCaso = true;
				this.casoId = +params['casoId'];
				this.http.get('/v1/base/caso/' + this.casoId + '/no-ejercicio-accion-penal').subscribe((response) => {
					this.data = response as NoEjercicioAccionPenal[];
					this.dataSource = new TableService(this.paginator, this.data);
				});
			}

		});
	}
}