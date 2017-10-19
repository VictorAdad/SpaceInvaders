import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Perito } from '@models/solicitud-preliminar/perito';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService } from '@services/selects.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
	templateUrl: './component.html',
})
export class PeritoCreateComponent {

	public casoId: number = null;
	public breadcrumb = [];
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
			}
		});
	}

}

@Component({
	selector: 'solicitud-perito',
	templateUrl: './solicitud.component.html',
})
export class SolicitudPeritoComponent extends SolicitudPreliminarGlobal {

	public apiUrl: string = "/v1/base/solicitudes-pre-pericial";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: Perito;
	isPericiales: boolean = false;
	isPsicofisico: boolean = false;


	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		private onLine: OnLineService,
		private http: HttpService,
		private router: Router,
		private db: CIndexedDB,
		private options: SelectsService
	) { super(); }

	ngOnInit() {
		this.model = new Perito();
		this.form = this.createForm();

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			console.log('casoId', this.casoId);
			if (params['id']) {
				this.id = +params['id'];
				console.log('id', this.id);
				this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
					this.isPericiales = this.form.controls.tipo.value === 'Periciales';
					this.isPsicofisico = this.form.controls.tipo.value === 'Psicofísico';


					this.fillForm(response);
				});
			}
		});
	}

	public createForm() {
		return new FormGroup({
			'tipo': new FormControl(this.model.tipo),
			'hechosNarrados': new FormControl(this.model.hechosNarrados),
			'hechosDenunciados': new FormControl(this.model.hechosDenunciados),
			'noOficio': new FormControl(this.model.noOficio),
			'directorInstituto': new FormControl(this.model.directorInstituto),
			'peritoMateria': new FormGroup({
				'id': new FormControl("", []),
			}),
			'finalidad': new FormControl(this.model.finalidad),
			'plazoDias': new FormControl(this.model.plazoDias),
			'apercibimiento': new FormControl(this.model.apercibimiento),
			'observaciones': new FormControl(this.model.observaciones),
			'medicoLegista': new FormControl(this.model.medicoLegista),
			'realizadoA': new FormControl(this.model.realizadoA),
			'tipoExamen': new FormGroup({
				'id': new FormControl("", []),
			}),
			'caso': new FormGroup({
				'id': new FormControl("", []),
			})
		});
	}

	public save(valid: any, _model: any): void {
		_model.caso.id = this.casoId;
		console.log('-> Perito@save()', _model);
		this.http.post(this.apiUrl, _model).subscribe(

			(response) => {
				if(this.casoId!=null){
					this.router.navigate(['/caso/' + this.casoId + '/perito']);
				}
			},
			(error) => {
				console.error('Error', error);
			}
		);
	}

	public edit(_valid: any, _model: any): void {
		console.log('-> AcuerdoGeneral@edit()', _model);
		this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
			console.log('-> Registro actualizado', response);
			if (this.id) {
				this.router.navigate(['/caso/' + this.casoId + '/perito']);
			}
		});
	}

	public fillForm(_data) {
		console.log('_data1', _data);
		for (var propName in _data) {
			if (_data[propName] === null || _data[propName] === undefined)
				delete _data[propName];
		}
		console.log('_data2', _data);
		this.form.patchValue({
			tipo: _data.tipo
		});
		let timer = Observable.timer(1);
		timer.subscribe(t => {
			this.form.patchValue(_data);
		})
	}
	tipoChange(_tipo): void {
		this.isPericiales = _tipo === 'Periciales';
		this.isPsicofisico = _tipo === 'Psicofísico';
	}

}

@Component({
	selector: 'documento-perito',
	templateUrl: './documento.component.html',
})
export class DocumentoPeritoComponent {

	columns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoPerito[] = [
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

export interface DocumentoPerito {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
