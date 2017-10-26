import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RequerimientoInformacion } from '@models/solicitud-preliminar/requerimientoInformacion';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";

@Component({
    templateUrl:'./component.html',
})
export class RequerimientoInformacionCreateComponent {
	public casoId: number = null;
  public solicitudId: number = null;
  public breadcrumb = [];
  public model:any=null;
	constructor(private route: ActivatedRoute){}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']){
				this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
                this.breadcrumb.push({path:`/caso/${this.casoId}/requerimiento-informacion`,label:"Solicitudes de requerimiento de información"})
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
	selector: 'solicitud-requerimiento',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudRequerimientoInformacionComponent extends SolicitudPreliminarGlobal{
	public apiUrl: string = "/v1/base/solicitudes-pre-info";
	public casoId: number = null;
	public id: number = null;
  @Output() modelUpdate=new EventEmitter<any>();
	public form: FormGroup;
	public model: RequerimientoInformacion;
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
		this.model = new RequerimientoInformacion();

		this.form = new FormGroup({
			'noOficio': new FormControl(this.model.noOficio),
			'fechaReq': new FormControl(this.model.fechaReq),
			'autoridadReq': new FormControl(this.model.autoridadReq),
			'cargoTurnoAdscripcion': new FormControl(this.model.cargoTurnoAdscripcion),
			'domicilioAutoridad': new FormControl(this.model.domicilioAutoridad),
			'infoRequerida': new FormControl(this.model.infoRequerida),
			'plazoDias': new FormControl(this.model.plazoDias),
			'apercibimiento': new FormControl(this.model.apercibimiento),
			'observaciones': new FormControl(this.model.observaciones),
			'caso': new FormGroup({
				'id': new FormControl("", []),
			})
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
            this.modelUpdate.emit(response);

				});
			}
		});
	}

	public save(valid: any, _model: any) {

		_model.caso.id = this.casoId;
		console.log('-> RequerimientoInformacion@save()', _model);

		return new Promise<any>(
            (resolve, reject) => {
				this.http.post(this.apiUrl, _model).subscribe(

					(response) => {
						console.log(response);
						console.log('here');
						this.id=response.id;
						this.router.navigate(['/caso/' + this.casoId + '/requerimiento-informacion/'+this.id+'/edit']);
						resolve('Solicitud de requerimiento de información creada con éxito');

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
		console.log('-> RequerimientoInformacion@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					console.log('-> Registro acutualizado', response);

					this.router.navigate(['/caso/' + this.casoId + '/requerimiento-informacion']);
					resolve('Solicitud de requerimiento de información actualizada con éxito');

				});
			}
		);
	}

	public fillForm(_data) {
		_data.fechaReq = new Date(_data.fechaReq);
		this.form.patchValue(_data);
		console.log(_data);
	}
}

@Component({
	selector: 'documento-requerimiento',
    templateUrl:'./documento.component.html',
})
export class DocumentoRequerimientoInformacionComponent extends FormatosGlobal{

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data=[];
  @Input() id:boolean=false;
  dataSource: TableService | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() object: any;

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService
      ){
      super(http, confirmationService, globalService);
  }

ngOnInit() {
  console.log('-> Object ', this.object);
  if(this.object.documentos)
  this.data = this.object.documentos;
  this.dataSource = new TableService(this.paginator, this.data);
}
}

export interface DocumentoRequerimientoInformacion {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
