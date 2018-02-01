import { CasoService } from '@services/caso/caso.service';
import { FormatosService } from '@services/formatos/formatos.service';
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
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";
import { AuthenticationService } from "@services/auth/authentication.service";

@Component({
	templateUrl: './component.html',
})
export class PeritoCreateComponent {

	public casoId: number = null;
	public solicitudId: number = null;
	public breadcrumb = [];
	public isPericiales: boolean = false;
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
				this.breadcrumb.push({ path: `/caso/${this.casoId}/perito`, label: "Solicitudes preliminares a peritos" })
			}
		});
	}

	modelUpdate(model: any) {
		this.solicitudId= model.id;
		this.isPericiales = model.tipo === 'Periciales'
		this.model=model
		Logger.log(model);
	}

	pericialesUpdate(bool: any) {
		this.isPericiales= bool;
		Logger.log(bool);
	}

}

@Component({
	selector: 'solicitud-perito',
	templateUrl: './solicitud.component.html',
})
export class SolicitudPeritoComponent extends SolicitudPreliminarGlobal {

	public apiUrl: string = "/v1/base/solicitudes-pre-pericial";
	public apiUrlPre : string = "/v1/base/predenuncias/casos/"
	public casoId: number = null;
	public masDe3Dias:any;
	public id: number = null;
	public personas: any[] = [];
    @Output() modelUpdate = new EventEmitter<any>();
    @Output() isPericialesUpdate= new EventEmitter<any>();
	public form: FormGroup;
	public model: Perito;
	isPericiales: boolean = false;
	isPsicofisico: boolean = false;
	public disable: boolean = false;


	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	public precarga = true;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		public onLine: OnLineService,
		private http: HttpService,
		private router: Router,
		private db: CIndexedDB,
		private options: SelectsService,
		private auth:AuthenticationService,
    	public casoServ: CasoService
	) { super(); }

	ngOnInit() {
		this.auth.masDe3DiasSinConexion().then(r=>{
            let x= r as boolean;
            this.masDe3Dias=r;
        });
		this.model = new Perito();
		this.form = this.createForm();

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			Logger.log('casoId', this.casoId);
			if (params['id']) {
				this.id = +params['id'];
				this.precarga = false;
				Logger.log('id', this.id);
				if(this.onLine.onLine){
					this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
	          			this.fillForm(response);
						this.isPericiales = this.form.controls.tipo.value === 'Periciales';
						this.isPsicofisico = this.form.controls.tipo.value === 'Psicofísico';
	          			this.isPericialesUpdate.emit(this.isPericiales);
						this.modelUpdate.emit(response); 
						this.personas = response.personas;
						Logger.logColor('<<< personas >>>', 'green', this.personas); 
						let timer = Observable.timer(1);
						timer.subscribe(t=>{
							this.form.disable();
						});
	          			

	        		});
        		}else{
        			// this.db.get("casos", this.casoId).then(t=>{
                        const t = this.casoServ.caso;
                        let sol = t["solicitudPrePericiales"] as any[];
                        for (var i = 0; i < sol.length; ++i) {
                            if ((sol[i])["id"]==this.id){
								// this.fillForm(sol[i]);
								let item = sol[i];
								const timer = Observable.timer(100);
								timer.subscribe(t=> {
									this.fillForm(item);
									this.isPericiales = this.form.controls.tipo.value === 'Periciales';
									this.isPsicofisico = this.form.controls.tipo.value === 'Psicofísico';
									this.isPericialesUpdate.emit(this.isPericiales);
									this.modelUpdate.emit(item);
									this.personas = item.personas;
									Logger.log('<<<< OffLine >>>>',sol[i])
									this.form.disable();
								});
                                break;
                            }
                        }
                    // });
        		}
			}
		});

		if(this.onLine.onLine){
			this.http.get(this.apiUrlPre+this.casoId+'/page').subscribe(response => {
				this.form.patchValue({
					hechosNarrados : response.data[0].hechosNarrados
				});
			});
		}else{

		}
	}

	public createForm() {
		return new FormGroup({
      'lugar': new FormGroup({
				'id': new FormControl('', []),
			}),
      'arma': new FormGroup({
				'id': new FormControl('', []),
      }),
      'vehiculo': new FormGroup({
				'id': new FormControl('', []),
      }),
      'delito': new FormGroup({
				'id': new FormControl('', []),
      }),
      'heredar':  new FormControl('', []),
      'heredarSintesisHechos':  new FormControl(false, []),
      'personas': new FormArray([]),

			'tipo': new FormControl(this.model.tipo, [Validators.required,]),
			'hechosNarrados': new FormControl(this.model.hechosNarrados),
			'noOficio': new FormControl(this.model.noOficio),
			'directorInstituto': new FormControl(this.model.directorInstituto),
			'peritoMateria': new FormGroup({
				'id': new FormControl('', []),
			}),
			'finalidad': new FormControl(this.model.finalidad),
			'plazoDias': new FormControl(this.model.plazoDias),
			'apercibimiento': new FormControl(this.model.apercibimiento),
			'observaciones': new FormControl(this.model.observaciones),
			'medicoLegista': new FormControl(this.model.medicoLegista),
			'realizadoA': new FormControl(this.model.realizadoA),
			'tipoExamen': new FormGroup({
				'id': new FormControl('', []),
			}),
			'caso': new FormGroup({
				'id': new FormControl('', []),
			})
		});
  }
  public heredarDatos(){
    console.log("Heredar en perito")
    //Heredar narrativa de los hechos ((Hecho narrados de Predenuncia)
	console.log(this.casoServ.caso);
	if(this.casoServ.caso.predenuncias.hechosNarrados){
		this.form.controls["hechosNarrados"].setValue(this.casoServ.caso.predenuncias.hechosNarrados)
	}
  }

	public save(valid: any, _model: any){
		if(valid){
			_model.caso.id = this.casoId;
			return new Promise<any>(
				(resolve, reject) => {
					Logger.log('-> Perito@save()', _model);
	                if (this.onLine.onLine) {
	    				this.http.post(this.apiUrl, _model).subscribe(
	    					(response) => {
	    							if(this.casoId!=null){
	    								this.id=response.id;
	    								this.router.navigate(['/caso/' + this.casoId + '/perito/' + this.id + '/edit']);
	    							}
	    							resolve('Solicitud pericial creada con éxito');
	    					},
	    					(error) => {
	    						Logger.error('Error', error);
	    						reject(error);
	    					}
	    				);
	                }else{
	                    let temId = Date.now();
	                    let dato  = {
	                        url: this.apiUrl,
	                        body:_model,
	                        options:[],
	                        tipo:"post",
	                        pendiente:true,
	                        dependeDe:[this.casoId],
							temId: temId,
							username: this.auth.user.username
	                    }
	                    this.db.add("sincronizar",dato).then(
	                        p => {
	                            if (this.casoServ.caso){
	                                if(!this.casoServ.caso["solicitudPrePericiales"])
	                                    this.casoServ.caso["solicitudPrePericiales"] = [];

	                                _model["id"] = temId;
	                                this.id      = _model['id'];
	                                this.casoServ.caso["solicitudPrePericiales"].push(_model);

	                                this.db.update("casos",this.casoServ.caso).then(
	                                    t => {
	                                        resolve('Solicitud pericial creada con éxito');
	                                        this.router.navigate(['/caso/' + this.casoId + '/perito/' + this.id + '/edit']);
	                                    }
	                                );
	                            }
	                        }
	                    );
	                }
				}
			);
		}else{
            console.error('El formulario no pasó la validación D:')
        }
	}

	public edit(_valid: any, _model: any){
		Logger.log('-> AcuerdoGeneral@edit()', _model);
		return new Promise<any>(
			(resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe(
					response => {
						Logger.log('-> Registro actualizado', response);
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
		Logger.log('_data1', _data);
		for (var propName in _data) {
			if (_data[propName] === null || _data[propName] === undefined)
				delete _data[propName];
		}
		Logger.log('_data2', _data, this.form);
		this.form.patchValue({
			tipo: _data.tipo
		});
		let timer = Observable.timer(1);
		timer.subscribe(t => {
			this.form.patchValue(_data);
		})
		this.disable = true;
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
export class DocumentoPeritoComponent extends FormatosGlobal {

    columns = ['nombre', 'fechaCreacion', 'acciones'];
    @Input() isPericiales:boolean=false;
    @Input() id:number=null;
    displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
    @Input()
    object: any;
    dataSource: TableDataSource | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public data: DocumentoPerito[] = [];
    public subject:BehaviorSubject<DocumentoPerito[]> = new BehaviorSubject<DocumentoPerito[]>([]);
    public source:TableDataSource = new TableDataSource(this.subject);
    public formData:FormData = new FormData();
    public urlUpload: string;


    constructor(
        public http: HttpService,
        public confirmationService:ConfirmationService,
        public globalService:GlobalService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        public onLine: OnLineService,
        public formatos: FormatosService,
        public db: CIndexedDB,
        public caso: CasoService,
        public auth: AuthenticationService
    ){
	    super(
	        http,
	        confirmationService,
	        globalService,
	        dialog,
	        onLine,
	        formatos,
	        auth,
	        db,
	        caso
	    );
	    this.vista="solicitudPerito";
	}

  ngOnInit() {
      Logger.log('-> Data source ', this.object);
      if (this.onLine.onLine){
	      if(this.object.documentos){
	          this.dataSource = this.source;
	          for (let object of this.object.documentos) {
	              this.data.push(object);
	              this.subject.next(this.data);
	          }

	      }
      }else{
      	this.cargaArchivosOffline(this,"",DocumentoPerito);
      }

      this.route.params.subscribe(params => {
          if (params['casoId']){
              this.urlUpload = '/v1/documentos/solicitudes-pre-pericial/save/'+params['casoId'];
              this.caso.find(params['casoId']).then(
                response => {
                    this.updateDataFormatos(this.caso.caso);
                }
            );

            }
      });
      this.atributoExtraPost={nombre:"solicitudPrePericial.id",valor:this.id.toString()};
      this.formData.append('solicitudPrePericial.id', this.id.toString());
  }

  public cargaArchivos(_archivos){
  	if (this.onLine.onLine){
	    let archivos=_archivos.saved
	      for (let object of archivos) {
	          this.data.push(object);
	          this.subject.next(this.data);
	      }
	}else{
		this.cargaArchivosOffline(this,"",DocumentoPerito);
	}
  }

  public setData(_object){
      Logger.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }
  public updateDataFormatos(_object){
    if(this.isPericiales)
    this.formatos.formatos.setDataF1009(_object,this.id);
    else
    this.formatos.formatos.setDataF1010(_object,this.id);

}


}
export class DocumentoPerito {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
