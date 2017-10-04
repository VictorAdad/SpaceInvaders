import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RequerimientoInformacion } from '@models/solicitud-preliminar/requerimientoInformacion';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class RequerimientoInformacionCreateComponent {
	public casoId: number = null;
	constructor(private route: ActivatedRoute){}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
		});
	}

}

@Component({
	selector: 'solicitud-requerimiento',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudRequerimientoInformacionComponent extends SolicitudPreliminarGlobal{
	public apiUrl: string = "/v1/base/requerimiento-informacion";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: RequerimientoInformacion;
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
		this.model = new RequerimientoInformacion();

		this.form = new FormGroup({
			'numeroOficio': new FormControl(this.model.numeroOficio),
			'fechaRequerimiento': new FormControl(this.model.fechaRequerimiento),
			'nombreAutoridad': new FormControl(this.model.nombreAutoridad),
			'cargoTurnoAutoridad': new FormControl(this.model.cargoTurnoAutoridad),
			'domicilioAutoridad': new FormControl(this.model.domicilioAutoridad),
			'informacion': new FormControl(this.model.informacion),
			'plazoMaxino': new FormControl(this.model.plazoMaxino),
			'apercibimiento': new FormControl(this.model.apercibimiento),
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
					console.log('Get reg ',response),
						this.fillForm(response);
				});
			}
		});
	}

	public save(valid: any, _model: any): void {

		Object.assign(this.model, _model);
		this.model.caso.id = this.casoId;
		console.log('-> RequerimientoInformacion@save()', this.model);
		this.http.post(this.apiUrl, this.model).subscribe(

			(response) => {
				console.log(response);
				console.log('here')
				if (this.casoId) {
					this.router.navigate(['/caso/' + this.casoId + '/requerimiento-informacion']);
				}
			},
			(error) => {
				console.error('Error', error);
			}
		);

	}

	public edit(_valid: any, _model: any): void {
		console.log('-> RequerimientoInformacion@edit()', _model);
		this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
			console.log('-> Registro acutualizado', response);
			if (this.id) {
				this.router.navigate(['/caso/' + this.casoId + '/requerimiento-informacion']);
			}
		});
	}

	public fillForm(_data) {
		_data.fechaRequerimiento = new Date(_data.fechaRequerimiento);
		this.form.patchValue(_data);
		console.log(_data);
	}
}

@Component({
	selector: 'documento-requerimiento',
    templateUrl:'./documento.component.html',
})
export class DocumentoRequerimientoInformacionComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoRequerimientoInformacion[] = [
		{id : 1, nombre: 'Entrevista.pdf',  	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 2, nombre: 'Nota.pdf',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 3, nombre: 'Fase.png',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id : 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}

export interface DocumentoRequerimientoInformacion {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
