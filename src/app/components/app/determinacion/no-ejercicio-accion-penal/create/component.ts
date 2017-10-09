import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NoEjercicioAccionPenal } from '@models/determinacion/no-ejercicio-accion-penal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
	templateUrl: './component.html',
})
export class NoEjercicioAccionPenalCreateComponent {
	public casoId: number = null;
	public breadcrumb = [];
	constructor(private route: ActivatedRoute) { }
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']){
				this.casoId = +params['casoId'];
				this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
			}
		});
	}

}

@Component({
	selector: 'determinacion-accion-penal',
	templateUrl: './determinacion.component.html',
})
export class DeterminacionNoEjercicioAccionPenalComponent extends DeterminacionGlobal {
	public apiUrl: string = "/v1/base/no-ejercicio-accion-penal";
	public casoId: number = null;
	public id: number = null;
	public form: FormGroup;
	public model: NoEjercicioAccionPenal;
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
		this.model = new NoEjercicioAccionPenal();
		this.form = new FormGroup({
			'narracionHechos': new FormControl(this.model.narracionHechos),
			'datosPrueba': new FormControl(this.model.datosPrueba),
			'fechaHecho': new FormControl(this.model.fechaHecho),
			'articuloCPEM': new FormControl(this.model.articuloCPEM),
			'referirHipotesis': new FormControl(this.model.referirHipotesis),
			'fraccionArticulo': new FormControl(this.model.fraccionArticulo),
			'hipotesis': new FormControl(this.model.hipotesis),
			'nombreProcurador': new FormControl(this.model.nombreProcurador),
			'hechosAmbito': new FormControl(this.model.hechosAmbito),
			'nombreAutoridad': new FormControl(this.model.nombreAutoridad),
			'causa': new FormControl(this.model.causa),
			'cargoAutoridad': new FormControl(this.model.cargoAutoridad),
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
        console.log('->AccionPenal@save()', this.model);
        this.http.post(this.apiUrl, this.model).subscribe(
            (response) => {
                console.log(response);
                if (this.casoId) {
                    this.router.navigate(['/caso/' + this.casoId + '/no-ejercicio-accion-penal']);
                }
            },
            (error) => {
                console.error('Error', error);
            }
        );

    }

    public edit(_valid: any, _model: any): void {
        console.log('-> AccionPenal@edit()', _model);
        this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
            console.log('-> Registro acutualizado', response);
            this.router.navigate(['/caso/' + this.casoId + '/no-ejercicio-accion-penal']);
        });
    }

    public fillForm(_data) {
        this.form.patchValue(_data);
        console.log(_data);
    }
}

@Component({
	selector: 'documento-accion-penal',
	templateUrl: './documento.component.html',
})
export class DocumentoNoEjercicioAccionPenalComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoNoEjercicioAccionPenal[] = [
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

export interface DocumentoNoEjercicioAccionPenal {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
