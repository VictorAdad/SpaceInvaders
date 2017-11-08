import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SolicitudServicioPolicial } from '@models/solicitud-preliminar/solicitudServicioPolicial';
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

@Component({
	templateUrl: './component.html',
})
export class PoliciaCreateComponent {
	public casoId: number = null;
  public solicitudId: number = null;
	public breadcrumb = [];
  public model:any=null;
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
				this.breadcrumb.push({ path: `/caso/${this.casoId}/policia`, label: "Solicitudes preliminares de Policia Ministerial" })
			}
		});
	}
  modelUpdate(model: any) {
    this.solicitudId= model.id;
    this.model=model
  console.log(model);
  }
}

@Component({
	selector: 'solicitud-policia',
	templateUrl: './solicitud.component.html',
})
export class SolicitudPoliciaComponent extends SolicitudPreliminarGlobal {
	public apiUrl = "/v1/base/solicitudes-pre-policias";
	public casoId: number = null;
	public id: number = null;
  @Output() modelUpdate=new EventEmitter<any>();
	public form: FormGroup;
	public model: SolicitudServicioPolicial;
	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		private onLine: OnLineService,
		private http: HttpService,
		private router: Router,
		private db: CIndexedDB
	) { super(); }

	ngOnInit() {
		this.model = new SolicitudServicioPolicial();

		this.form = new FormGroup({
			'noOficio': new FormControl(this.model.noOficio),
			'nombreComisario': new FormControl(this.model.nombreComisario),
			'actuacionesSolicitadas': new FormControl(this.model.actuacionesSolicitadas)
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
					this.modelUpdate.emit(response);
					this.form.disable();
				});
			}
		});
	}

	public save(valid: any, _model: any) {

		Object.assign(this.model, _model);
		this.model.caso.id = this.casoId;

		return new Promise<any>(
			(resolve, reject) => {
				console.log('-> Policia@save()', this.model);
				this.http.post(this.apiUrl, this.model).subscribe(

					(response) => {
						if(this.casoId!=null){
							this.id=response.id;
							this.router.navigate(['/caso/' + this.casoId + '/policia/' + this.id + '/edit']);
						}
						resolve('Solicitud de policía creada con éxito');
					},
					(error) => {
						console.error('Error', error);
						reject(error);
					}
				);
			}
		);

	}

	public edit(_valid: any, _model: any) {
		console.log('-> Policia@edit()', _model);
		return new Promise<any>(
			(resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe(
					(response) => {
						console.log('-> Registro acutualizado', response);
						if(this.id!=null){
							this.router.navigate(['/caso/' + this.casoId + '/policia']);
						}
						resolve('Solitud de policía actualizada con éxito');
					},
					(error) => {
						console.error('Error', error);
						reject(error);
					}
				);
			}
		);
	}

	public fillForm(_data) {
		this.form.patchValue(_data);
		console.log(_data);
	}

}

@Component({
	selector: 'documento-policia',
	templateUrl: './documento.component.html',
})
export class DocumentoPoliciaComponent extends FormatosGlobal{

  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoPolicia[] = [];
  public subject:BehaviorSubject<DocumentoPolicia[]> = new BehaviorSubject<DocumentoPolicia[]>([]);
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
      console.log('-> Object ', this.object);
      if(this.object.documentos){
          this.dataSource = this.source;
          for (let object of this.object.documentos) {
              this.data.push(object);
              this.subject.next(this.data);
          }

      }

      this.route.params.subscribe(params => {
          if (params['casoId'])
              this.urlUpload = '/v1/documentos/solicitudes-pre-policias/save/'+params['casoId'];

      });

      this.formData.append('solicitudPrePolicia.id', this.id.toString());
  }

  public cargaArchivos(_archivos){
      for (let object of _archivos) {
          let obj = {
              'id': 0,
              'nameEcm': object.nameEcm,
              'created': new Date(),
              'procedimiento': '',
              'uuidEcm': object.uuidEcm
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

export interface DocumentoPolicia {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
