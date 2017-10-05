import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Perito } from '@models/solicitud-preliminar/perito';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	templateUrl: './component.html',
})
export class PeritoCreateComponent {

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
	selector: 'solicitud-perito',
	templateUrl: './solicitud.component.html',
})
export class SolicitudPeritoComponent extends SolicitudPreliminarGlobal {

	public apiUrl: string = "/v1/base/perito";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: Perito;
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
		this.model = new Perito();

		this.form = new FormGroup({
			'tipoSolicitud': new FormControl(this.model.tipoSolicitud),
			'hechosNarrados': new FormControl(this.model.hechosNarrados),
			'hechosDenunciados': new FormControl(this.model.hechosDenunciados),
			'numeroOficio': new FormControl(this.model.numeroOficio),
			'nombreDirector': new FormControl(this.model.nombreDirector),
			'solicitaPerito': new FormControl(this.model.solicitaPerito),
			'finalidadRequermiento': new FormControl(this.model.finalidadRequermiento),
			'plazoDias': new FormControl(this.model.plazoDias),
			'apercibimiento': new FormControl(this.model.apercibimiento),
			'observaciones': new FormControl(this.model.observaciones),
			'nombreMedico': new FormControl(this.model.nombreMedico),
			'nombreRealizaExamen': new FormControl(this.model.nombreRealizaExamen),
			'examen': new FormControl(this.model.examen)
		});

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			console.log('casoId', this.casoId);
			if (params['id']) {
				this.id = +params['id'];
				console.log('id', this.id);
				this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
					this.fillForm(response);
				});
			}
		});
	}

	public save(valid: any, _model: any): void {

		Object.assign(this.model, _model);
		this.model.caso.id = this.casoId;
		console.log('-> Perito@save()', this.model);
		this.http.post(this.apiUrl, this.model).subscribe(

			(response) => {
				console.log(response);
				console.log('here')
				if (this.casoId) {
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
			console.log('-> Registro acutualizado', response);
			if (this.id) {
				this.router.navigate(['/caso/' + this.casoId + '/perito']);
			}
		});
	}

	public fillForm(_data) {
		this.form.patchValue(_data);
		console.log(_data);
	}

	tipo: String = '';

	tipoChange(_event): void {
		this.tipo = _event;
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
