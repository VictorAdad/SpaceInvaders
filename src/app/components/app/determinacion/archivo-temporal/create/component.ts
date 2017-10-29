import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild, Output, Input,EventEmitter  } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ArchivoTemporal } from '@models/determinacion/archivoTemporal';
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

@Component({
	templateUrl: './component.html',
})
export class ArchivoTemporalCreateComponent {
	public breadcrumb = [];
	public casoId: number = null;
  public archivoId: number = null;
  public model:any=null;

	constructor(private route: ActivatedRoute) { }
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']){
				this.casoId = +params['casoId'];
				this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
				this.breadcrumb.push({path:`/caso/${this.casoId}/archivo-temporal`,label:"Archivo temporal"});
			}
		});
	}
  modelUpdate(model: any) {
    this.archivoId= model.id;
    this.model=model
  console.log(model);
  }
}

@Component({
	selector: 'determinacion-archivo-temporal',
	templateUrl: './determinacion.component.html',
})
export class DeterminacionArchivoTemporalComponent extends DeterminacionGlobal {
	public apiUrl: string = "/v1/base/archivos-temporales";
	public casoId: number = null;
	public id: number = null;
  @Output() modelUpdate=new EventEmitter<any>();
	public form: FormGroup;
	public model: ArchivoTemporal;
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
		this.model = new ArchivoTemporal();
		this.form = new FormGroup({
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
            this.modelUpdate.emit(response);
          });
			}
		});
	}

	public save(valid: any, _model: any) {
		Object.assign(this.model, _model);
		this.model.caso.id = this.casoId;
		//var _date = new Date();
		//this.model.fechaCreacion = _date.toString();
		console.log('-> ArchivoTemporal@save()', this.model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.post(this.apiUrl, this.model).subscribe(
					(response) => {
						this.id=response.id;
						console.log(response);
						if (this.casoId!=null) {
							this.router.navigate(['/caso/' + this.casoId + '/archivo-temporal/'+this.id+'/edit']);
						}
						resolve('Archivo temporal creado con éxito');
					},
					(error) => {
						reject(error);
					}
				);
			}
		);

	}

	public edit(_valid: any, _model: any) {
		console.log('-> ArchivoTemporal@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					console.log('-> Registro acutualizado', response);
					if(this.id!=null){
						this.router.navigate(['/caso/' + this.casoId + '/archivo-temporal']);
					}
					resolve('Archivo temporal actualizado con éxito');
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
	selector: 'documento-archivo-temporal',
	templateUrl: './documento.component.html',
})
export class DocumentoArchivoTemporalComponent extends FormatosGlobal{


  @Input() id:number=null;
  displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoArchivoTemporal[] = [];
  public subject:BehaviorSubject<DocumentoArchivoTemporal[]> = new BehaviorSubject<DocumentoArchivoTemporal[]>([]);
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

public setData(_object){
    console.log('setData()');
    this.data.push(_object);
    this.subject.next(this.data);
}
}

export interface DocumentoArchivoTemporal {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
