import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { Component, ViewChild , Output,Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Entrevista } from '@models/entrevista/entrevista';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { EntrevistaGlobal } from '../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService} from '@services/selects.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../global.component';
import { Validation } from '@services/validation/validation.service';
import * as moment from 'moment';


var eliminaNulos = function(x){
            if (typeof x == "object"){
                for(let i in x){
                    if (x[i]==null || typeof x[i] =="undefined"){
                        delete x[i];
                    }
                    if (typeof x[i]=="object")
                        eliminaNulos(x[i]);
                }
            }
        }

@Component({
	templateUrl: './component.html',
})
export class EntrevistaCreateComponent {
	public casoId: number = null;
	public breadcrumb = [];
  public entrevistaId: number = null;
  public model:any=null;
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['casoId']) {
				this.casoId = +params['casoId'];
				this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle de caso" });
				this.breadcrumb.push({ path: `/caso/${this.casoId}/entrevista`, label: "Entrevistas" });
			}

		});
	}
  modelUpdate(_model: any) {
    this.entrevistaId = _model.id;
    this.model=_model;
	  console.log(_model);
  }

}

@Component({
	selector: 'entrevista-entrevista',
	templateUrl: './entrevista.component.html',
})
export class EntrevistaEntrevistaComponent extends EntrevistaGlobal {
	public apiUrl: string = "/v1/base/entrevistas";
	public casoId: number = null;
	public id: number = null;
	@Output() modelUpdate = new EventEmitter<any>();
	public form: FormGroup;
	public model: Entrevista;
	dataSource: TableService | null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		private onLine: OnLineService,
		private http: HttpService,
		private router: Router,
		private db: CIndexedDB,
		public options: SelectsService
	) { super(); }

	ngOnInit() {
		this.model = new Entrevista();
		this.form = this.createForm();

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			console.log('casoId', this.casoId);
			if (params['id']) {
				this.id = + params['id'];
				this.form.disable();
				console.log('id', this.id);

				if(this.onLine.onLine){
					this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
						this.fillForm(response);
						this.modelUpdate.emit(response);

					});
				}else{
					this.db.get("casos", this.casoId).then(t=>{
                        let entrevistas = t["entrevistas"] as any[];
                        for (var i = 0; i < entrevistas.length; ++i) {
                            if ((entrevistas[i])["id"]==this.id){
                                var entrevista = entrevistas[i];
                                // (arma["claseArma"])["claseArma"]=arma["clase"];
                                // if (arma["subtipo"])
                                //     (arma["claseArma"])["subtipo"]=arma["subtipo"];
                                // if (arma["tipo"])
                                //     (arma["claseArma"])["tipo"]=arma["tipo"];

                                this.fillForm(entrevistas[i]);
                                break;
                            }
                        }
                    });
				}
			}
		});

		this.validateForm(this.form);
	}

	public createForm() {
		return new FormGroup({
			'autoridadRealizaEntrevista': new FormControl(""),
			'lugarRealizaEntrevista': new FormControl(""),
			'nombreEntrevistado': new FormControl(""),
			'sexo': new FormGroup({
				'id': new FormControl("", []),
			}),
			'fechaNacimiento': new FormControl(""),
			'edad': new FormControl("",[Validators.min(0),]),
			'nacionalidad': new FormControl(""),
			'originarioDe': new FormControl(""),
			'estadoMigratorio': new FormControl(""),
			'tipoInterviniente': new FormGroup({
				'id': new FormControl("", []),
			}),
			'tipoIdentificacion': new FormControl(""),
			'emisorIdentificacion': new FormControl(""),
			'noIdentificacion': new FormControl(""),
			'curp': new FormControl(""),
			'rfc': new FormControl(""),
			'sabeLeerEscribir': new FormControl(""),
			'gradoEscolaridad': new FormControl(""),
			'ocupacion': new FormControl(""),
			'lugarOcupacion': new FormControl(""),
			'estadoCivil': new FormControl(""),
			'salarioSemanal': new FormControl("", [Validation.validationMax(99999),Validators.min(0)]),
			'relacionEntrevistado': new FormControl(""),
			'calle': new FormControl(""),
			'noExterior': new FormControl(""),
			'noInterior': new FormControl(""),
			'colonia': new FormControl(""),
			'cp': new FormControl(""),
			'municipio': new FormControl(""),
			'estado': new FormControl(""),
			'noTelefonoParticular': new FormControl(""),
			'noTelefonoCelular': new FormControl(""),
			'correoElectronico': new FormControl(""),
			'tieneRepresentanteLegal': new FormControl(""),
			'nombreRepresentanteLegal': new FormControl(""),
			'medioTecnologicoRegistro': new FormControl(""),
			'medioTecnologicoUtilizado': new FormControl(""),
			'medioTecnicoRegistro': new FormControl(""),
			'medioTecnicoUtilizado': new FormControl(""),
			'narracionHechos': new FormControl('', [Validators.required, Validators.minLength(150)]),
			'observaciones': new FormControl(this.model.observaciones),
			'caso': new FormGroup({
				'id': new FormControl("", []),
			})
		});
	}

	public save(valid: any, _model: any) {

		_model.caso.id = this.casoId;
		console.log('-> Entrevista@save()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				if (this.onLine.onLine) {
					this.http.post(this.apiUrl, _model).subscribe(

						(response) => {
							this.id=response.id;
							if (this.casoId!=null) {
							    console.log(response);
								this.router.navigate(['/caso/' + this.casoId + '/entrevista/'+this.id+'/view']);
							}
							resolve('Entrevista creada con éxito');
						},
						(error) => {
							console.error('Error', error);
							reject(error);
						}
					);
				}else{
					let temId=Date.now();
	                let dato={
	                    url: this.apiUrl,
	                    body:_model,
	                    options:[],
	                    tipo:"post",
	                    pendiente:true,
	                    dependeDe:[this.casoId],
	                    temId: temId
	                }
	                this.db.add("sincronizar",dato).then(p=>{
	                    this.db.get("casos", this.casoId).then(caso=>{
	                        if (caso){
	                            if(!caso["entrevistas"]){
                        			caso["entrevistas"]=[];
	                            }
	                            _model["id"]=temId;
	                            this.id= _model['id'];
	                            caso["entrevistas"].push(_model);
	                            this.db.update("casos",caso).then(t=>{
	                                resolve("Se agregó la entrevista de manera local");
	                                this.router.navigate(['/caso/' + this.casoId + '/entrevista/'+this.id+'/view']);
	                            });
	                        }
	                    });
	                });
				}
			}
		);
	}

	public edit(_valid: any, _model: any) {
		this.model.sexo.id = 2;
		console.log('-> Entrevista@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					console.log('-> Registro acutualizado', response);
					if (this.id) {
						this.router.navigate(['/caso/' + this.casoId + '/entrevista']);
					}
					resolve('Entrevista actualizada con éxito');
				});
			}
		);
	}

	public fillForm(_data) {
		_data.fechaNacimiento = new Date(_data.fechaNacimiento);
		eliminaNulos(_data);
		console.log(_data);
		this.form.patchValue(_data);
		console.log(_data);
	}

	tipoChange(_tipo): void {
		console.log('valor', _tipo);
  }
  calculateAge(e){

            var m = moment(e);
            console.log(typeof e,m.isValid());
            if (m.isValid()){
                var a=moment(e);
                var hoy=moment();
                var edad=hoy.diff(a, 'years');
                this.form.patchValue({edad:edad});
                this.form.controls.edad.disable();
            }else{
                this.form.controls.edad.enable();
            }

        }

}

@Component({
	selector: 'documento-entrevista',
	templateUrl: './documento.component.html',
})
export class DocumentoEntrevistaComponent extends FormatosGlobal{

  @Input() id:number=null;
  displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoEntrevista[] = [];
  public subject:BehaviorSubject<DocumentoEntrevista[]> = new BehaviorSubject<DocumentoEntrevista[]>([]);
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

}

export interface DocumentoEntrevista {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
