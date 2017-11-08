import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild , Output,Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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

@Component({
	templateUrl: './component.html',
})
export class RegistroGeneralCreateComponent {

	public casoId: number = null;
	public breadcrumb = [];
  public solicitudId: number = null;
  public model:any=null;
	constructor(private route: ActivatedRoute) { }
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
				this.breadcrumb.push({ path: `/caso/${this.casoId}/registro-general`, label: "Solicitudes de registro general" })
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
	selector: 'solicitud-registro-general',
	templateUrl: './solicitud.component.html',
})
export class SolicitudRegistroGeneralComponent extends SolicitudPreliminarGlobal {

	public apiUrl: string = "/v1/base/solicitudes-pre-registros";
	public casoId: number = null;
	public id: number = null;
  @Output() modelUpdate=new EventEmitter<any>();
	public form: FormGroup;
	public model: RegistroGeneral;
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
		this.model = new RegistroGeneral();

		this.form = new FormGroup({
			'contenidoConstancia': new FormControl(''),
			'noTelefonico': new FormControl(''),
			'atencionLlamada': new FormControl(''),
			'observaciones': new FormControl('')
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
					this.modelUpdate.emit(response);
					this.fillForm(response);
					this.form.disable();
				});
			}
		});
	}

	public save(valid: any, _model: any) {

		Object.assign(this.model, _model);
		this.model.caso.id = this.casoId;
		console.log('-> RegistroGeneral@save()', this.model);

		return new Promise<any>(
            (resolve, reject) => {
				this.http.post(this.apiUrl, this.model).subscribe(

					(response) => {
            console.log('registro guardado->',response);
						if(this.casoId!=null){
							this.id=response.id;
							this.router.navigate(['/caso/' + this.casoId + '/registro-general/' + this.id + '/edit']);
						}
						resolve('Solicitud de registro general creada con éxito');
					},
					(error) => {
						console.error('Error', error);
						reject(error)
					}
				);
			}
		);

	}

	public edit(_valid: any, _model: any) {
		console.log('-> RegistroGeneral@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					console.log('-> Registro acutualizado', response);
					if (this.id) {
						this.router.navigate(['/caso/' + this.casoId + '/registro-general']);
					}
					resolve('Solicitud de registro general actualizada con éxito');
				});
			}
		);
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
export class DocumentoRegistroGeneralComponent  extends FormatosGlobal{
  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoRegistroGeneral[] = [];
  public subject:BehaviorSubject<DocumentoRegistroGeneral[]> = new BehaviorSubject<DocumentoRegistroGeneral[]>([]);
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

export interface DocumentoRegistroGeneral {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
