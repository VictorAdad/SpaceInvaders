import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Entrevista } from '@models/entrevista/entrevista';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { EntrevistaGlobal } from '../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService} from '@services/selects.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	templateUrl: './component.html',
})
export class EntrevistaCreateComponent {
	public casoId: number = null;
	public breadcrumb = [];
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle de caso" });
			}

		});
	}

}

@Component({
	selector: 'entrevista-entrevista',
	templateUrl: './entrevista.component.html',
})
export class EntrevistaEntrevistaComponent extends EntrevistaGlobal {
	public apiUrl: string = "/v1/base/entrevistas";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: Entrevista;
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

		/*new FormGroup({
			'autoridadRealizaEntrevista': new FormControl(this.model.autoridadRealizaEntrevista),
			'lugarRealizaEntrevista': new FormControl(this.model.lugarRealizaEntrevista),
			'nombreEntrevistado': new FormControl(this.model.nombreEntrevistado),
			'sexo': new FormControl(this.model.sexo.id),
			'fechaNacimiento': new FormControl(this.model.fechaNacimiento),
			'edad': new FormControl(this.model.edad),
			'nacionalidad': new FormControl(this.model.nacionalidad),
			'originarioDe': new FormControl(this.model.originarioDe),
			'estadoMigratorio': new FormControl(this.model.estadoMigratorio),
			'tipoInterviniente': new FormControl(this.model.tipoInterviniente),
			'tipoIdentificacion': new FormControl(this.model.tipoIdentificacion),
			'emisorIdentificacion': new FormControl(this.model.emisorIdentificacion),
			'noIdentificacion': new FormControl(this.model.noIdentificacion),
			'curp': new FormControl(this.model.curp),
			'rfc': new FormControl(this.model.rfc),
			'sabeLeerEscribir': new FormControl(this.model.sabeLeerEscribir),
			'gradoEscolaridad': new FormControl(this.model.gradoEscolaridad),
			'ocupacion': new FormControl(this.model.ocupacion),
			'lugarOcupacion': new FormControl(this.model.lugarOcupacion),
			'estadoCivil': new FormControl(this.model.estadoCivil),
			'salarioSemanal': new FormControl(this.model.salarioSemanal),
			'relacionEntrevistado': new FormControl(this.model.relacionEntrevistado),
			'calle': new FormControl(this.model.calle),
			'noExterior': new FormControl(this.model.noExterior),
			'noInterior': new FormControl(this.model.noInterior),
			'colonia': new FormControl(this.model.colonia),
			'cp': new FormControl(this.model.cp),
			'municipio': new FormControl(this.model.municipio),
			'estado': new FormControl(this.model.estado),
			'noTelefonoParticular': new FormControl(this.model.noTelefonoParticular),
			'noTelefonoCelular': new FormControl(this.model.noTelefonoCelular),
			'correoElectronico': new FormControl(this.model.correoElectronico),
			'tieneRepresentanteLegal': new FormControl(this.model.tieneRepresentanteLegal),
			'nombreRepresentanteLegal': new FormControl(this.model.nombreRepresentanteLegal),
			'medioTecnologicoRegistro': new FormControl(this.model.medioTecnologicoRegistro),
			'medioTecnologicoUtilizado': new FormControl(this.model.medioTecnologicoUtilizado),
			'medioTecnicoRegistro': new FormControl(this.model.medioTecnicoRegistro),
			'medioTecnicoUtilizado': new FormControl(this.model.medioTecnicoUtilizado),
			'narracionHechos': new FormControl(this.model.narracionHechos),
			'observaciones': new FormControl(this.model.observaciones)
		});*/

		this.model = new Entrevista();
		this.form = this.createForm();

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			console.log('casoId', this.casoId);
			if (params['id']) {
				this.id = +params['id'];
				this.form.disable();
				console.log('id', this.id);
				this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
					this.fillForm(response);
				});
			}
		});
	}

	public createForm() {
		return new FormGroup({
			'autoridadRealizaEntrevista': new FormControl(this.model.autoridadRealizaEntrevista),
			'lugarRealizaEntrevista': new FormControl(this.model.lugarRealizaEntrevista),
			'nombreEntrevistado': new FormControl(this.model.nombreEntrevistado),
			'sexo': new FormGroup({
				'id': new FormControl("", []),
			}),
			'fechaNacimiento': new FormControl(this.model.fechaNacimiento),
			'edad': new FormControl(this.model.edad),
			'nacionalidad': new FormControl(this.model.nacionalidad),
			'originarioDe': new FormControl(this.model.originarioDe),
			'estadoMigratorio': new FormControl(this.model.estadoMigratorio),
			'tipoInterviniente': new FormGroup({
				'id': new FormControl("", []),
			}),
			'tipoIdentificacion': new FormControl(this.model.tipoIdentificacion),
			'emisorIdentificacion': new FormControl(this.model.emisorIdentificacion),
			'noIdentificacion': new FormControl(this.model.noIdentificacion),
			'curp': new FormControl(this.model.curp),
			'rfc': new FormControl(this.model.rfc),
			'sabeLeerEscribir': new FormControl(this.model.sabeLeerEscribir),
			'gradoEscolaridad': new FormControl(this.model.gradoEscolaridad),
			'ocupacion': new FormControl(this.model.ocupacion),
			'lugarOcupacion': new FormControl(this.model.lugarOcupacion),
			'estadoCivil': new FormControl(this.model.estadoCivil),
			'salarioSemanal': new FormControl(this.model.salarioSemanal),
			'relacionEntrevistado': new FormControl(this.model.relacionEntrevistado),
			'calle': new FormControl(this.model.calle),
			'noExterior': new FormControl(this.model.noExterior),
			'noInterior': new FormControl(this.model.noInterior),
			'colonia': new FormControl(this.model.colonia),
			'cp': new FormControl(this.model.cp),
			'municipio': new FormControl(this.model.municipio),
			'estado': new FormControl(this.model.estado),
			'noTelefonoParticular': new FormControl(this.model.noTelefonoParticular),
			'noTelefonoCelular': new FormControl(this.model.noTelefonoCelular),
			'correoElectronico': new FormControl(this.model.correoElectronico),
			'tieneRepresentanteLegal': new FormControl(this.model.tieneRepresentanteLegal),
			'nombreRepresentanteLegal': new FormControl(this.model.nombreRepresentanteLegal),
			'medioTecnologicoRegistro': new FormControl(this.model.medioTecnologicoRegistro),
			'medioTecnologicoUtilizado': new FormControl(this.model.medioTecnologicoUtilizado),
			'medioTecnicoRegistro': new FormControl(this.model.medioTecnicoRegistro),
			'medioTecnicoUtilizado': new FormControl(this.model.medioTecnicoUtilizado),
			'narracionHechos': new FormControl(this.model.narracionHechos),
			'observaciones': new FormControl(this.model.observaciones),
			'caso': new FormGroup({
				'id': new FormControl("", []),
			})
		});
	}

	public save(valid: any, _model: any): void {

		_model.caso.id = this.casoId;
		console.log('-> Entrevista@save()', _model);
		if (this.onLine.onLine) {
			this.http.post(this.apiUrl, _model).subscribe(

				(response) => {
					console.log(response);
					console.log('here')
					if (this.casoId) {
						this.router.navigate(['/caso/' + this.casoId + '/entrevista']);
					}
				},
				(error) => {
					console.error('Error', error);
				}
			);
		}
	}

	public edit(_valid: any, _model: any): void {
		this.model.sexo.id = 2;
		console.log('-> Entrevista@edit()', _model);
		this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
			console.log('-> Registro acutualizado', response);
			if (this.id) {
				this.router.navigate(['/caso/' + this.casoId + '/entrevista']);
			}
		});
	}

	public fillForm(_data) {
		_data.fechaNacimiento = new Date(_data.fechaNacimiento);
		this.form.patchValue(_data);
		console.log(_data);
	}

	tipoChange(_tipo): void {
		console.log('valor', _tipo);
	}

}

@Component({
	selector: 'documento-entrevista',
	templateUrl: './documento.component.html',
})
export class DocumentoEntrevistaComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoEntrevista[] = [
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

export interface DocumentoEntrevista {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
