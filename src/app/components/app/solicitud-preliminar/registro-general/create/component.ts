import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild , Output,Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RegistroGeneral } from '@models/solicitud-preliminar/registroGeneral';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";
import { CasoService } from '@services/caso/caso.service';
import { Yason } from '@services/utils/yason';

@Component({
	templateUrl: './component.html',
})
export class RegistroGeneralCreateComponent {

	public casoId: number = null;
	public breadcrumb = [];
	public solicitudId: number = null;
	public model:any=null;
	constructor(
		public casoServ: CasoService,
      	private router: Router ,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.casoServ.find(this.casoId).then(
                    caso => {
                        if(!this.casoServ.caso.hasRelacionVictimaImputado && !this.casoServ.caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
				this.breadcrumb.push({ path: `/caso/${this.casoId}/registro-general`, label: "Solicitudes de registro general" })
			}
		});
	}

	modelUpdate(model: any) {
		this.solicitudId = model.id;
		this.model = model;
		// Logger.log(model);
	}

}

@Component({
	selector: 'solicitud-registro-general',
	templateUrl: './solicitud.component.html',
})
export class SolicitudRegistroGeneralComponent extends SolicitudPreliminarGlobal {

	public apiUrl: string = "/v1/base/solicitudes-pre-registros";

	public casoId: number = null;

	public id: number = null;

	public tipo: string;

	public personas: any[] = [];

	public form: FormGroup;

	public model: RegistroGeneral;

	public dataSource: TableService | null;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	@Output() modelUpdate=new EventEmitter<any>();

	public precarga = true;

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
      'lugar': new FormGroup({
				'id': new FormControl("", []),
			}),
      'arma': new FormGroup({
				'id': new FormControl("", []),
      }),
      'vehiculo': new FormGroup({
				'id': new FormControl("", []),
      }),
      'delito': new FormGroup({
				'id': new FormControl("", []),
      }),
      'heredar':  new FormControl("", []),
      'heredarSintesisHechos':  new FormControl(false, []),
      'personas': new FormArray([]),

			'tipo': new FormControl('', [Validators.required,]),
			'contenidoConstancia': new FormControl(''),
			'noTelefonico': new FormControl(''),
			'atencionLlamada': new FormControl(''),
			'observaciones': new FormControl(''),

			'fundamentoLegal': new FormControl(''),
			'contenidoAcuerdo': new FormControl(''),
			'finalidad': new FormControl(''),
			'plazo': new FormControl(''),
			'apercibimiento': new FormControl(''),
			'senialar': new FormControl(''),
		});

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			Logger.log('casoId', this.casoId);

			if (params['id']) {
				this.id = +params['id'];
				this.precarga = false;
				Logger.log('id', this.id);
				this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
					Logger.log(response.data),
					this.modelUpdate.emit(response);
					this.fillForm(response);
					this.personas = response.personas;
					this.form.disable();
				});
			}
		});
	}

	public save(valid: any, _model: any) {
		if(valid){
			Object.assign(this.model, _model);
			this.model.caso.id = this.casoId;
			Logger.log('-> RegistroGeneral@save()', this.model);

			return new Promise<any>(
	            (resolve, reject) => {
					this.http.post(this.apiUrl, this.model).subscribe(

						(response) => {
	            			Logger.log('registro guardado->',response);
							if(this.casoId!=null){
								this.id=response.id;
								this.router.navigate(['/caso/' + this.casoId + '/registro-general/' + this.id + '/edit']);
							}
							resolve('Solicitud de registro general creada con éxito');
						},
						(error) => {
							Logger.error('Error', error);
							reject(error)
						}
					);
				}
			);
		}else{
            console.error('El formulario no pasó la validación D:')
        }
	}

	public edit(_valid: any, _model: any) {
		Logger.log('-> RegistroGeneral@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					Logger.log('-> Registro acutualizado', response);
					if (this.id) {
						this.router.navigate(['/caso/' + this.casoId + '/registro-general']);
					}
					resolve('Solicitud de registro general actualizada con éxito');
				});
			}
		);
	}

	public fillForm(_data) {
		Yason.eliminaNulos(_data);
		let timer = Observable.timer(1);
		this.form.controls.tipo.setValue(_data.tipo);
		timer.subscribe(t => {
			this.form.patchValue(_data);
		});
	}

	public tipoChange(_event){
		this.tipo = _event;
	}

}

@Component({
	selector: 'documento-registro-general',
	templateUrl: './documento.component.html',
})
export class DocumentoRegistroGeneralComponent  extends FormatosGlobal{

	@Input() id:number=null;
	displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
	@Input()
	object: any;
	dataSource: TableDataSource | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	public data: DocumentoRegistroGeneral[] = [];
	public subject:BehaviorSubject<DocumentoRegistroGeneral[]> = new BehaviorSubject<DocumentoRegistroGeneral[]>([]);
	public source:TableDataSource = new TableDataSource(this.subject);
	public formData:FormData = new FormData();
	public urlUpload: string;

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService,
      public dialog: MatDialog,
      private route: ActivatedRoute,
      ){
      super(http, confirmationService, globalService, dialog);
  }

	ngOnInit() {
		Logger.log('-> Object ', this.object);
		if(this.object.documentos){
			this.dataSource = this.source;
			for (let object of this.object.documentos) {
				this.data.push(object);
				this.subject.next(this.data);
			}

		}

		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.urlUpload = '/v1/documentos/solicitudes-pre-registros/save/'+params['casoId'];
			}

		});

      	this.formData.append('solicitudPreRegistro.id', this.id.toString());
	}

  public cargaArchivos(_archivos){
    let archivos=_archivos.saved
      for (let object of archivos) {
          this.data.push(object);
          this.subject.next(this.data);
      }
  }

  public setData(_object){
      Logger.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }
}

export interface DocumentoRegistroGeneral {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
