import { TipoInterviniente } from './../../../../models/personaCaso';
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
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../global.component';
import { Validation } from '@services/validation/validation.service';
import * as moment from 'moment';
import { CasoService } from '@services/caso/caso.service';
import { FormatosService } from '@services/formatos/formatos.service';
import { Logger } from "@services/logger.service";
import { PersonaService} from '@services/noticia-hecho/persona/persona.service';


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
  constructor(private route: ActivatedRoute,
              public personaServ: PersonaService,
  ) { }

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
	  Logger.log(_model);
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
  public personasHeredadas:any[];
  public heredar:boolean=false;
  public heredarSintesis:boolean=false;

	constructor(
		private _fbuilder: FormBuilder,
		private route: ActivatedRoute,
		private onLine: OnLineService,
		private http: HttpService,
		private router: Router,
		private db: CIndexedDB,
    public options: SelectsService,
    public personaServ: PersonaService,
    public casoService:CasoService

	) { super(); }

	ngOnInit() {
		this.model = new Entrevista();
		this.form = this.createForm();

		this.route.params.subscribe(params => {
			if (params['casoId'])
				this.casoId = +params['casoId'];
			Logger.log('casoId', this.casoId);
			if (params['id']) {
				this.id = + params['id'];
				this.form.disable();
				Logger.log('id', this.id);

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
                                this.fillForm(entrevistas[i]);
                                this.modelUpdate.emit(entrevistas[i]);
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


			'autoridadRealizaEntrevista': new FormControl(""),
			'lugarRealizaEntrevista': new FormControl(""),
			'nombreEntrevistado': new FormControl(""),
			'sexo': new FormGroup({
				'id': new FormControl("", []),
			}),
      'fechaNacimiento': new FormControl(""),
			'fechasNacimiento': new FormControl(""),
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
		Logger.log('-> Entrevista@save()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				if (this.onLine.onLine) {
					this.http.post(this.apiUrl, _model).subscribe(

						(response) => {
							this.id=response.id;
							if (this.casoId!=null) {
							    Logger.log(response);
								this.router.navigate(['/caso/' + this.casoId + '/entrevista/'+this.id+'/view']);
							}
							resolve('Entrevista creada con éxito');
						},
						(error) => {
							Logger.error('Error', error);
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
		Logger.log('-> Entrevista@edit()', _model);
		return new Promise<any>(
            (resolve, reject) => {
				this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
					Logger.log('-> Registro acutualizado', response);
					if (this.id) {
						this.router.navigate(['/caso/' + this.casoId + '/entrevista']);
					}
					resolve('Entrevista actualizada con éxito');
				});
			}
		);
	}

	public fillForm(_data) {
  if(_data.fechaNacimiento !== "" && _data.fechaNacimiento != null && _data.fechaNacimiento != undefined)
		_data.fechaNacimiento = new Date(_data.fechaNacimiento);
		eliminaNulos(_data);
		Logger.log(_data);
		this.form.patchValue(_data);
		Logger.log(_data);
  }
  public heredarDatos(){
    console.log("Heredar en entravista")

    /*
        ◦ nombre del entrevistado
        ◦ Sexo
        ◦ Fecha de nacimiento*
        ◦ Edad*
        ◦ Nacionalidad
        ◦ CURP
        ◦ RFC
        ◦ Ocupación
        ◦ Lugar de trabajo
        ◦ Estado Civil

        ◦ Calle
        ◦ No. exterior
        ◦ No. Interior
        ◦ Colonia/asentamiento
        ◦ CP*
        ◦ Municipio
        ◦ Nº telefónico particular*
        ◦ Nº telefónico celular*
        ◦ Correo
        ◦ Narrativa de los hechos ((Hecho narrados de Predenuncia)

    */

   this.personasHeredadas.forEach((personaCaso)=> {

     // Heradar nombre del entrevistado
     let nombrePersona=(personaCaso.persona.nombre?personaCaso.persona.nombre:"")+(personaCaso.persona.paterno?" "+personaCaso.persona.paterno:"")+(personaCaso.persona.materno?" "+personaCaso.persona.materno:"");
     if(!this.form.controls['nombreEntrevistado'].value){
        this.form.controls['nombreEntrevistado'].setValue(nombrePersona);
        console.log(nombrePersona)
      }
      else {
        if(nombrePersona=="" && personaCaso.tipoInterviniente.id==_config.optionValue.tipoInterviniente.imputado){
          nombrePersona="Quién Resulte Culpable"
        }
        if(nombrePersona=="" && !(personaCaso.tipoInterviniente.id==_config.optionValue.tipoInterviniente.imputado)){
          nombrePersona="Identidad desconocida"
        }
        this.form.controls['nombreEntrevistado'].setValue(this.form.controls['nombreEntrevistado'].value+","+nombrePersona);
        console.log(this.form.controls['nombreEntrevistado'])
      }

      // Heredar Sexo
      this.form.controls["sexo"].setValue( this.form.controls["sexo"].value?(personaCaso.persona.sexo?this.form.controls["sexo"].value+","+personaCaso.persona.sexo.nombre:"Sin valor"):personaCaso.persona.sexo.nombre?personaCaso.persona.sexo.nombre:"Sin valor")
      // Heredar Fecha Nacimiento
      personaCaso.persona.fechaNacimiento=personaCaso.persona.fechaNacimiento?new Date(personaCaso.persona.fechaNacimiento).toLocaleDateString():null;
      this.form.controls["fechasNacimiento"].setValue(this.form.controls["fechasNacimiento"].value?(personaCaso.persona.fechaNacimiento?this.form.controls["fechasNacimiento"].value+","+personaCaso.persona.fechaNacimiento:this.form.controls["fechasNacimiento"].value+",Sin valor"):(personaCaso.persona.fechaNacimiento?personaCaso.persona.fechaNacimiento:"Sin valor"))
      // Heredar Edad
      this.form.controls["edad"].setValue( this.form.controls["edad"].value?(personaCaso.persona.edad?this.form.controls["edad"].value+","+personaCaso.persona.edad:this.form.controls["edad"].value+"Sin valor"):personaCaso.persona.edad)
     // heredar Nacionalidad
      console.log("a buscar ",personaCaso.persona.nacionalidadReligion)
      let nacionalidad=personaCaso.persona.nacionalidadReligion.nacionalidad;
      this.form.controls["nacionalidad"].setValue( this.form.controls["nacionalidad"].value?(nacionalidad?this.form.controls["nacionalidad"].value+","+nacionalidad:this.form.controls["nacionalidad"].value+",Sin valor"):(nacionalidad?nacionalidad:"Sin valor"))
      //Heredar CURP
        this.form.controls["curp"].setValue( this.form.controls["curp"].value?(personaCaso.persona.curp?this.form.controls["curp"].value+","+personaCaso.persona.curp:this.form.controls["curp"].value+",Sin valor"):(personaCaso.persona.curp?personaCaso.persona.curp:"Sin valor"))
      //Heredar RFC
      this.form.controls["rfc"].setValue( this.form.controls["rfc"].value?(personaCaso.persona.rfc?this.form.controls["rfc"].value+","+personaCaso.persona.rfc:this.form.controls["rfc"].value+",Sin valor"):(personaCaso.persona.rfc?personaCaso.persona.rfc:"Sin valor"))
      //Heredar Ocupacion
      this.form.controls["ocupacion"].setValue( this.form.controls["ocupacion"].value?(personaCaso.persona.ocupacion?this.form.controls["ocupacion"].value+", "+personaCaso.persona.ocupacion.nombre:this.form.controls["ocupacion"].value+",Sin valor"):(personaCaso.persona.ocupacion.nombre?personaCaso.persona.ocupacion.nombre:"Sin valor"))
      //Heredar Lugar Ocupacion
      this.form.controls["lugarOcupacion"].setValue( this.form.controls["lugarOcupacion"].value?(personaCaso.persona.lugarTrabajo?this.form.controls["lugarOcupacion"].value+","+personaCaso.persona.lugarTrabajo:this.form.controls["lugarOcupacion"].value+",Sin valor"):(personaCaso.persona.lugarTrabajo?personaCaso.persona.lugarTrabajo:"Sin valor"))
      // Heredar estado civil
      this.form.controls["estadoCivil"].setValue( this.form.controls["estadoCivil"].value?(personaCaso.persona.estadoCivil?this.form.controls["estadoCivil"].value+","+personaCaso.persona.estadoCivil.nombre:this.form.controls["estadoCivil"].value+",Sin valor"):(personaCaso.persona.estadoCivil?personaCaso.persona.estadoCivil.nombre:"Sin valor"))
      let localizacion = personaCaso.persona.localizacionPersona[0];
      if(localizacion){
      // Heredar Calle
      this.form.controls["calle"].setValue( this.form.controls["calle"].value?(localizacion.calle?this.form.controls["calle"].value+","+localizacion.calle:this.form.controls["calle"].value+",Sin valor"):(localizacion.calle?localizacion.nombre:"Sin valor"))
      // Heredar No Exterior
      this.form.controls["noExterior"].setValue( this.form.controls["noExterior"].value?(localizacion.noExterior?this.form.controls["noExterior"].value+","+localizacion.noExterior:this.form.controls["noExterior"].value+",Sin valor"):(localizacion.noExterior?localizacion.noExterior:"Sin valor"))
      // Heredar No interior
      this.form.controls["noInterior"].setValue( this.form.controls["noInterior"].value?(localizacion.noInterior?this.form.controls["noInterior"].value+","+localizacion.noInterior:this.form.controls["noInterior"].value+",Sin valor"):(localizacion.noInterior?localizacion.noInterior:"Sin valor"))
      // Heredar colonia
      this.form.controls["colonia"].setValue( this.form.controls["colonia"].value?(localizacion.colonia?this.form.controls["colonia"].value+","+localizacion.colonia:this.form.controls["colonia"].value+",Sin valor"):(localizacion.colonia?localizacion.colonia:"Sin valor"))
      // Heredar CP
      this.form.controls["cp"].setValue( this.form.controls["cp"].value?(localizacion.cp?this.form.controls["cp"].value+","+localizacion.cp:this.form.controls["cp"].value+",Sin valor"):(localizacion.cp?localizacion.cp:"Sin valor"))
      // Heredar Municipio
      this.form.controls["municipio"].setValue( this.form.controls["municipio"].value?(localizacion.municipioOtro?this.form.controls["municipio"].value+","+localizacion.municipioOtro:this.form.controls["municipio"].value+",Sin valor"):(localizacion.municipioOtro?localizacion.municipioOtro:"Sin valor"))
      // Heredar Estado
      this.form.controls["estado"].setValue( this.form.controls["estado"].value?(localizacion.estadoOtro?this.form.controls["estado"].value+","+localizacion.estadoOtro:this.form.controls["estado"].value+",Sin valor"):(localizacion.estadoOtro?localizacion.estadoOtro:"Sin valor"))
      // Heredar Tel particular
      this.form.controls["noTelefonoParticular"].setValue( this.form.controls["noTelefonoParticular"].value?(localizacion.telParticular?this.form.controls["noTelefonoParticular"].value+","+localizacion.telParticular:this.form.controls["noTelefonoParticular"].value+",Sin valor"):(localizacion.telParticular?localizacion.telParticular:"Sin valor"))
      // Heredar Tel movil
      this.form.controls["noTelefonoCelular"].setValue( this.form.controls["noTelefonoCelular"].value?(localizacion.telMovil?this.form.controls["noTelefonoCelular"].value+","+localizacion.telMovil:this.form.controls["noTelefonoCelular"].value+",Sin valor"):(localizacion.telMovil?localizacion.telMovil:"Sin valor"))
     // Heredar Tel correo
     this.form.controls["correoElectronico"].setValue( this.form.controls["correoElectronico"].value?(localizacion.correo?this.form.controls["correoElectronico"].value+","+localizacion.correo:this.form.controls["correoElectronico"].value+",Sin valor"):(localizacion.correo?localizacion.correo:"Sin valor"))

     }
      else{
        this.setSinValor("calle");
        this.setSinValor("noExterior");
        this.setSinValor("noInterior");
        this.setSinValor("colonia");
        this.setSinValor("cp");
        this.setSinValor("municipio");
        this.setSinValor("estado");
        this.setSinValor("noTelefonoParticular");
        this.setSinValor("noTelefonoCelular");
        this.setSinValor("correoElectronico");

      }
    });

    //Heredar narrativa de los hechos ((Hecho narrados de Predenuncia)
    console.log(this.casoService.caso);
    this.form.controls["narracionHechos"].setValue(this.casoService.caso.predenuncias.hechosNarrados)
  }
  public setSinValor(key){
    this.form.controls[key].setValue( this.form.controls[key].value?this.form.controls[key].value+",Sin valor":"Sin valor")
  }

  public  personasChanged(_personasHeredadas){
    this.personasHeredadas=_personasHeredadas;
  }
  public heredarChanged(_heredar){
    this.heredar=_heredar;
    console.log("heredar changed")
    if(_heredar){
      this.form.removeControl("sexo");
      this.form.addControl("sexo",new FormControl("",[]));
      }
    else{
        this.form.removeControl("sexo");
        this.form.addControl("sexo",new FormGroup({
          'id': new FormControl("", []),
        }));
      }
      this.form.removeControl("edad");
      this.form.addControl("edad",new FormControl("",[]));
      this.form.removeControl("curp");
      this.form.addControl("curp",new FormControl("",[]));
      this.form.removeControl("rfc");
      this.form.addControl("rfc",new FormControl("",[]));

      this.form.removeControl("ocupacion");
      this.form.addControl("ocupacion",new FormControl("",[]));
      this.form.removeControl("lugarOcupacion");
      this.form.addControl("lugarOcupacion",new FormControl("",[]));
      this.form.removeControl("estadoCivil");
      this.form.addControl("estadoCivil",new FormControl("",[]));
      this.form.removeControl("calle");
      this.form.addControl("calle",new FormControl("",[]));
      this.form.removeControl("noExterior");
      this.form.addControl("noExterior",new FormControl("",[]));
      this.form.removeControl("noInterior");
      this.form.addControl("noInterior",new FormControl("",[]));
      this.form.removeControl("colonia");
      this.form.addControl("colonia",new FormControl("",[]));

      this.form.removeControl("cp");
      this.form.addControl("cp",new FormControl("",[]));
      this.form.removeControl("noTelefonoParticular");
      this.form.addControl("noTelefonoParticular",new FormControl("",[]));
      this.form.removeControl("noTelefonoCelular");
      this.form.addControl("noTelefonoCelular",new FormControl("",[]));
      this.form.removeControl("correoElectronico");
      this.form.addControl("correoElectronico",new FormControl("",[]));
      console.log("Heredar= ",this.heredar)

  }
	tipoChange(_tipo): void {
		Logger.log('valor', _tipo);
  }
  calculateAge(e){

            var m = moment(e);
            Logger.log(typeof e,m.isValid());
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
  displayedColumns = ['nombre', 'fechaCreacion', 'acciones',];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoEntrevista[] = [];
  public subject:BehaviorSubject<DocumentoEntrevista[]> = new BehaviorSubject<DocumentoEntrevista[]>([]);
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
    public caso: CasoService
    ){
    super(
        http,
        confirmationService,
        globalService,
        dialog,
        onLine,
        formatos
        );
    this.vista="entrevista";
}

  ngOnInit() {
      Logger.log('-> Object ', this.object);
      if (this.onLine.onLine){
	      if(this.object.documentos){
	          this.dataSource = this.source;
	          for (let object of this.object.documentos) {
	              this.data.push(object);
	              this.subject.next(this.data);
	          }

	      }
      }else{
      	this.cargaArchivosOffline(this,"",DocumentoEntrevista);
      }

      this.route.params.subscribe(params => {
          if (params['casoId']){
            this.urlUpload = '/v1/documentos/entrevistas/save/'+params['casoId'];
            this.caso.find(params['casoId']).then(
              response => {
                  this.updateDataFormatos(this.caso.caso);
              }
          );

            }
      });
      this.atributoExtraPost={nombre:"entrevista.id",valor:this.id.toString()};
      this.formData.append('entrevista.id', this.id.toString());
  }

  public cargaArchivos(_archivos){
  	if (this.onLine.onLine){
	    let archivos=_archivos.saved
	      for (let object of archivos) {
	          this.data.push(object);
	          this.subject.next(this.data);
	      }
  	}else{
  		this.cargaArchivosOffline(this, "",DocumentoEntrevista);
  	}

  }



  public setData(_object){
      Logger.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }
  public updateDataFormatos(_object){
    this.formatos.formatos.setDataF1008(_object);
}

}

export class DocumentoEntrevista {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
