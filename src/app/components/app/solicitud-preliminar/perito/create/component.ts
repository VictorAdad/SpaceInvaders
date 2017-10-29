import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild, Output,Input, EventEmitter  } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
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
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';

@Component({
	templateUrl: './component.html',
})
export class PeritoCreateComponent {

	public casoId: number = null;
  public solicitudId: number = null;
  public breadcrumb = [];
  isPericiales: boolean = false;
  public model:any=null;
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
				this.breadcrumb.push({ path: `/caso/${this.casoId}/perito`, label: "Solicitudes preliminares a peritos" })
			}
		});
	}
  modelUpdate(model: any) {
    this.solicitudId= model.id;
    this.isPericiales = model.tipo === 'Periciales'
    this.model=model
	  console.log(model);
  }
  pericialesUpdate(bool: any) {
    this.isPericiales= bool;
	  console.log(bool);
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
  @Output() modelUpdate = new EventEmitter<any>();
  @Output() isPericialesUpdate= new EventEmitter<any>();
	public form: FormGroup;
	public model: Perito;
	isPericiales: boolean = false;
	isPsicofisico: boolean = false;


	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

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
          			this.fillForm(response);
					this.isPericiales = this.form.controls.tipo.value === 'Periciales';
					this.isPsicofisico = this.form.controls.tipo.value === 'Psicofísico';
          			this.isPericialesUpdate.emit(this.isPericiales);
          			this.modelUpdate.emit(response);
          			this.form.disable();

        		});
			}
		});
	}

	public createForm() {
		return new FormGroup({
			'tipo': new FormControl(this.model.tipo),
			'hechosNarrados': new FormControl(this.model.hechosNarrados),
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

	public save(valid: any, _model: any){
		_model.caso.id = this.casoId;
		return new Promise<any>(
			(resolve, reject) => {
				console.log('-> Perito@save()', _model);
				this.http.post(this.apiUrl, _model).subscribe(
					(response) => {
						if(this.casoId!=null){
							this.id=response.id;
							this.router.navigate(['/caso/' + this.casoId + '/perito']);
						}
						resolve('Solicitud pericial creada con éxito');
					},
					(error) => {
						console.error('Error', error);
						reject(error);
					}
				);
			}
		);
	}

	public edit(_valid: any, _model: any){
		console.log('-> AcuerdoGeneral@edit()', _model);
		return new Promise<any>(
			(resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe(
					response => {
						console.log('-> Registro actualizado', response);
						if (this.id) {
							this.router.navigate(['/caso/' + this.casoId + '/perito']);
						}
						resolve('Solicitud pericial actualizada con éxito');
					},
					error => reject(error)
				);
			}
		);
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
		console.log('P ---------->', this.isPericiales);
	}

}

@Component({
	selector: 'documento-perito',
	templateUrl: './documento.component.html',
})
export class DocumentoPeritoComponent extends FormatosGlobal {

  columns = ['nombre', 'fechaCreacion'];
  @Input() isPericiales:boolean=false;
  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoPerito[] = [];
  public subject:BehaviorSubject<DocumentoPerito[]> = new BehaviorSubject<DocumentoPerito[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService,
      public dialog: MatDialog
      ){
      super(http, confirmationService, globalService, dialog);
  }

  ngOnInit() {
    console.log('-> Object ', this.object);
      if(this.object.documentos){
          this.dataSource = this.source;
          for (let object of this.object.documentos) {
              this.data.push(object);
              this.subject.next(this.data);
          }

      }
 }

 	public cargaArchivos(_archivos){
        for (let object of _archivos) {
        	let obj = {
        		'id': 0,
				'nameEcm': object.some.name,
				'created': new Date(),
				'procedimiento': '',
			}
			this.data.push(obj);
			this.subject.next(this.data);
        } 
    }
 
 public setData(_object){
  console.log('setData()');
  this.data.push(_object);
  this.subject.next(this.data);
}

}
export interface DocumentoPerito {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
