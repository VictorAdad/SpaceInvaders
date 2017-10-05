import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ArchivoTemporal } from '@models/determinacion/archivoTemporal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class ArchivoTemporalCreateComponent {
	public casoId: number = null;
	constructor(private route: ActivatedRoute) { }
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
		});
	}

}

@Component({
	selector: 'determinacion-archivo-temporal',
	templateUrl: './determinacion.component.html',
})
export class DeterminacionArchivoTemporalComponent extends DeterminacionGlobal {
	public apiUrl: string = "/v1/base/archivo-temporal";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: ArchivoTemporal;
	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		private onLine: OnLineService,
		private http: HttpService,
		private router: Router,
		private db: CIndexedDB
	) { super(); }

	ngOnInit() {
		this.model = new ArchivoTemporal();
		this.form = new FormGroup({
			'observaciones': new FormControl(this.model.observaciones)
		});

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			if (params['id']) {
				this.id = +params['id'];
				this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
					console.log(response.data),
						this.fillForm(response);
				});
			}
		});
	}

	public save(valid: any, _model: any): void {
		Object.assign(this.model, _model);
		this.model.caso.id = this.casoId;
		console.log('-> ArchivoTemporal@save()', this.model);
		this.http.post(this.apiUrl, this.model).subscribe(
			(response) => {
				console.log(response);
				if (this.casoId) {
					this.router.navigate(['/caso/' + this.casoId + '/archivo-temporal']);
				}
			},
			(error) => {
				console.error('Error', error);
			}
		);

	}

	public edit(_valid: any, _model: any): void {
		console.log('-> ArchivoTemporal@edit()', _model);
		this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
			console.log('-> Registro acutualizado', response);
			this.router.navigate(['/caso/' + this.casoId + '/archivo-temporal']);
		});
	}

	public fillForm(_data) {
		this.form.patchValue(_data);
		console.log(_data);
	}
}

@Component({
	selector: 'documento-archivo-temporal',
	templateUrl: './documento.component.html',
})
export class DocumentoArchivoTemporalComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoArchivoTemporal[] = [
		{ id: 1, nombre: 'Entrevista.pdf', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
		{ id: 2, nombre: 'Nota.pdf', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
		{ id: 3, nombre: 'Fase.png', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
		{ id: 4, nombre: 'Entrevista1.pdf', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
		{ id: 5, nombre: 'Fase1.png', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


	ngOnInit() {
		this.dataSource = new TableService(this.paginator, this.data);
	}
}

export interface DocumentoArchivoTemporal {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
