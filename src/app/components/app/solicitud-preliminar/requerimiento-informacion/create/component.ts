import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RequerimientoInformacion } from '@models/solicitud-preliminar/requerimientoInformacion';
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
import { Yason } from '@services/utils/yason';
import { CasoService } from '@services/caso/caso.service';

@Component({
    templateUrl:'./component.html',
})
export class RequerimientoInformacionCreateComponent {
	public casoId: number = null;
  public solicitudId: number = null;
  public breadcrumb = [];
  public model:any=null;
	constructor(
		public casoServ: CasoService,
      	private router: Router ,
		private route: ActivatedRoute){}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']){
				this.casoId = +params['casoId'];
				this.casoServ.find(this.casoId).then(
                    caso => {
                        if(!this.casoServ.caso.hasRelacionVictimaImputado && !this.casoServ.caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.breadcrumb.push({path:`/caso/${this.casoId}/requerimiento-informacion`,label:"Solicitudes de requerimiento de información"})
			}
		});
	}
  modelUpdate(model: any) {
    this.solicitudId= model.id;
    this.model=model
  Logger.log(model);
  }

}

@Component({
	selector: 'solicitud-requerimiento',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudRequerimientoInformacionComponent extends SolicitudPreliminarGlobal{
	public apiUrl: string = "/v1/base/solicitudes-pre-info";
	public casoId: number = null;
	public personas: any[] = [];
	public id: number = null;
  @Output() modelUpdate=new EventEmitter<any>();
	public form: FormGroup;
	public model: RequerimientoInformacion;
	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

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
		this.model = new RequerimientoInformacion();

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

			'noOficio': new FormControl("", []),
			'fechaReq': new FormControl("", []),
			'autoridadReq': new FormControl("", []),
			'cargoTurnoAdscripcion': new FormControl("", []),
			'domicilioAutoridad': new FormControl("", []),
			'infoRequerida': new FormControl("", []),
			'plazoDias': new FormControl("", []),
			'apercibimiento': new FormControl("", []),
			'observaciones': new FormControl("", []),
			'caso': new FormGroup({
				'id': new FormControl("", []),
			})
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
					Logger.log('<<<< Get reg >>>>',response),
					this.modelUpdate.emit(response);
					this.personas = response.personas;
					this.fillForm(response);
					this.form.disable();
				});
			}
		});
	}

	public save(valid: any, _model: any) {
		if(valid){
			_model.caso.id = this.casoId;
			Logger.log('-> RequerimientoInformacion@save()', _model);

			return new Promise<any>(
	            (resolve, reject) => {
					this.http.post(this.apiUrl, _model).subscribe(

						(response) => {
							Logger.log(response);
							Logger.log('here');
							this.id=response.id;
							this.router.navigate(['/caso/' + this.casoId + '/requerimiento-informacion/' + this.id + '/edit']);
							resolve('Solicitud de requerimiento de información creada con éxito');

						},
						(error) => {
							Logger.error('Error', error);
							reject(error);
						}
					);
				}
			);
		}else{
            console.error('El formulario no pasó la validación D:')
        }

	}

	public edit(_valid: any, _model: any) {
		Logger.log('-> RequerimientoInformacion@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					Logger.log('-> Registro acutualizado', response);

					this.router.navigate(['/caso/' + this.casoId + '/requerimiento-informacion']);
					resolve('Solicitud de requerimiento de información actualizada con éxito');

				});
			}
		);
	}

	public fillForm(_data) {
    	if(_data.fechaReq !== "" && _data.fechaReq != null && _data.fechaReq != undefined){
			_data.fechaReq = new Date(_data.fechaReq);
			Yason.eliminaNulos(_data);
		}else{
			_data.fechaReq = "";  
			Yason.eliminaNulos(_data);
			_data.fechaReq = null;
		}
		this.form.patchValue(_data);
		
	}
}

@Component({
	selector: 'documento-requerimiento',
    templateUrl:'./documento.component.html',
})
export class DocumentoRequerimientoInformacionComponent extends FormatosGlobal{

  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoRequerimientoInformacion[] = [];
  public subject:BehaviorSubject<DocumentoRequerimientoInformacion[]> = new BehaviorSubject<DocumentoRequerimientoInformacion[]>([]);
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
			  this.urlUpload = '/v1/documentos/solicitudes-pre-info/save/'+params['casoId'];
			  this.casoId = +params['casoId'];
		  }

      });

      this.formData.append('solicitudPreReqInfo.id', this.id.toString());
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

export interface DocumentoRequerimientoInformacion {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
