import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild,Output, Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
  console.log(model);
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
		private db: CIndexedDB
	) { super(); }

	ngOnInit() {
		this.model = new NoEjercicioAccionPenal();
		this.form = new FormGroup({
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
        console.log('->AccionPenal@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
		        this.http.post(this.apiUrl, this.model).subscribe(
		            (response) => {
		                console.log(response);
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
        console.log('-> AccionPenal@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
		        this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
		            console.log('-> Registro acutualizado', response);
		            this.router.navigate(['/caso/' + this.casoId + '/no-ejercicio-accion-penal']);
		            resolve('Registro actualizado con éxito');
		        });
	        }
        );
    }

    public fillForm(_data) {
		_data.fechaHechoDelictivo = new Date(_data.fechaHechoDelictivo);
        this.form.patchValue(_data);
        console.log(_data);
    }
}

@Component({
	selector: 'documento-accion-penal',
	templateUrl: './documento.component.html',
})
export class DocumentoNoEjercicioAccionPenalComponent extends FormatosGlobal {

  @Input() id:number=null;
  displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoNoEjercicioAccionPenal[] = [];
  public subject:BehaviorSubject<DocumentoNoEjercicioAccionPenal[]> = new BehaviorSubject<DocumentoNoEjercicioAccionPenal[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService
      ){
      super(http, confirmationService, globalService);
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

export interface DocumentoNoEjercicioAccionPenal {
	id: number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
