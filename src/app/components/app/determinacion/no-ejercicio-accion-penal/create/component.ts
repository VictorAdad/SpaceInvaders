import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild,Output, Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NoEjercicioAccionPenal } from '@models/determinacion/no-ejercicio-accion-penal';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";
import { CasoService } from '@services/caso/caso.service';

@Component({
	templateUrl: './component.html',
})
export class NoEjercicioAccionPenalCreateComponent {
	public casoId: number = null;
  public determinacionId: number = null;
	public breadcrumb = [];
  public model:any=null;

	constructor(private route: ActivatedRoute) { }
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']){
				this.casoId = +params['casoId'];
				this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
				this.breadcrumb.push({path:`/caso/${this.casoId}/no-ejercicio-accion-penal`,label:"No ejercicio de la acción penal"});
			}
		});
	}
  modelUpdate(model: any) {
    this.determinacionId= model.id;
    this.model=model
  Logger.log(model);
  }
}

@Component({
	selector: 'determinacion-accion-penal',
	templateUrl: './determinacion.component.html',
})
export class DeterminacionNoEjercicioAccionPenalComponent extends DeterminacionGlobal {
	public apiUrl: string = "/v1/base/no-ejercicio-accion";
	public casoId: number = null;
	public id: number = null;
  @Output() modelUpdate=new EventEmitter<any>();
	public form: FormGroup;
	public model: NoEjercicioAccionPenal;
	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		private onLine: OnLineService,
		private http: HttpService,
		private router: Router,
    private db: CIndexedDB,
    private casoService:CasoService
	) { super(); }

	ngOnInit() {
		this.model = new NoEjercicioAccionPenal();
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
      'heredarSintesisHechos':  new FormControl("", []),
      'personas': new FormArray([]),

			'narracionHechos': new FormControl(this.model.narracionHechos),
			'datosPrueba': new FormControl(this.model.datosPrueba),
			'fechaHechoDelictivo': new FormControl(this.model.fechaHechoDelictivo),
			'articuloCpem': new FormControl(this.model.articuloCpem),
			'hipotesisCnpp': new FormControl(this.model.hipotesisCnpp),
			'fraccionArticulo': new FormControl(this.model.fraccionArticulo),
			'hipotesisSobreseimiento': new FormControl(this.model.hipotesisSobreseimiento),
			'nombreProcurador': new FormControl(this.model.nombreProcurador),
			'ambitoHechos': new FormControl(this.model.ambitoHechos),
			'autoridadCompetente': new FormControl(this.model.autoridadCompetente),
			'causaIncompetencia': new FormControl(this.model.causaIncompetencia),
			'cargoAutoridadCompetente': new FormControl(this.model.cargoAutoridadCompetente),
			'observaciones': new FormControl(this.model.observaciones)
		});

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			if (params['id']) {
				this.id = +params['id'];
				this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
					  Logger.log(response.data),
            this.fillForm(response);
            this.modelUpdate.emit(response);

				});
			}
		});
	}
  public heredarDatos(){
    console.log("Heredar en facultad de no investigar")
    /*
       • Narración de los hechos (Hecho narrados de Predenuncia))

    */
    this.form.controls["narracionHechos"].setValue(this.casoService.caso.predenuncias.hechosNarrados)
  }
	public save(valid: any, _model: any) {
        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        Logger.log('->AccionPenal@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
		        this.http.post(this.apiUrl, this.model).subscribe(
		            (response) => {
		                Logger.log(response);
						this.id=response.id;
		                if (this.casoId) {
		                    this.router.navigate(['/caso/' + this.casoId + '/no-ejercicio-accion-penal/'+this.id+'/edit']);
		                }
		                resolve('Registro creado con éxito');
		            },
		            (error) => {
	            		reject(error)
		            }
		        );
	        }
        );

    }

    public edit(_valid: any, _model: any) {
        Logger.log('-> AccionPenal@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
		        this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
		            Logger.log('-> Registro acutualizado', response);
		            this.router.navigate(['/caso/' + this.casoId + '/no-ejercicio-accion-penal']);
		            resolve('Registro actualizado con éxito');
		        });
	        }
        );
    }

    public fillForm(_data) {
		if(_data.fechaHechoDelictivo)
			_data.fechaHechoDelictivo = new Date(_data.fechaHechoDelictivo);
        this.form.patchValue(_data);
        this.form.disable();
        Logger.log(_data);
    }
}

@Component({
	selector: 'documento-accion-penal',
	templateUrl: './documento.component.html',
})
export class DocumentoNoEjercicioAccionPenalComponent extends FormatosGlobal {

  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoNoEjercicioAccionPenal[] = [];
  public subject:BehaviorSubject<DocumentoNoEjercicioAccionPenal[]> = new BehaviorSubject<DocumentoNoEjercicioAccionPenal[]>([]);
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
          if (params['casoId'])
              this.urlUpload = '/v1/documentos/no-ejercicio-accion/save/'+params['casoId'];

      });

      this.formData.append('noEjercicioAccionPenal.id', this.id.toString());
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


export interface DocumentoNoEjercicioAccionPenal {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
