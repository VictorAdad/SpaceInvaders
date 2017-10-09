import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RegistroGeneral } from '@models/solicitud-preliminar/registroGeneral';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class RegistroGeneralCreateComponent {

	public casoId: number = null;
    public breadcrumb = [];
	constructor(private route: ActivatedRoute) { }
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']){
				this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
			}
		});
	}

}

@Component({
	selector: 'solicitud-registro-general',
	templateUrl: './solicitud.component.html',
})
export class SolicitudRegistroGeneralComponent extends SolicitudPreliminarGlobal {

	public apiUrl: string = "/v1/base/registros-generales";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: RegistroGeneral;
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
		this.model = new RegistroGeneral();

		this.form = new FormGroup({
			'constancia': new FormControl(this.model.constancia),
			'numero': new FormControl(this.model.numero),
			'nombre': new FormControl(this.model.nombre),
			'observaciones': new FormControl(this.model.observaciones)
		});

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			console.log('casoId', this.casoId);
			if (params['id']) {
				this.id = +params['id'];
				console.log('id', this.id);
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
		console.log('-> RegistroGeneral@save()', this.model);
		this.http.post(this.apiUrl, this.model).subscribe(

			(response) => {
				console.log(response);
				console.log('here')
				if (this.casoId) {
					this.router.navigate(['/caso/' + this.casoId + '/registro-general']);
				}
			},
			(error) => {
				console.error('Error', error);
			}
		);

	}

	public edit(_valid: any, _model: any): void {
		console.log('-> Policia@edit()', _model);
		this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
			console.log('-> Registro acutualizado', response);
			if (this.id) {
				this.router.navigate(['/caso/' + this.casoId + '/registro-general']);
			}
		});
	}

	public fillForm(_data) {
		this.form.patchValue(_data);
		console.log(_data);
	}

}

@Component({
	selector: 'documento-registro-general',
	templateUrl: './documento.component.html',
})
export class DocumentoRegistroGeneralComponent {
	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoRegistroGeneral[] = [
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

export interface DocumentoRegistroGeneral {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
