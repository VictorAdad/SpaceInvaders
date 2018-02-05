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
import { AuthenticationService } from '@services/auth/authentication.service';
import { Consultas } from './consultas';

var eliminaNulos = function(x){
    if (typeof x == "object"){
        for(let i in x){
            if (x.hasOwnProperty(i)) {
                if (x[i]==null || typeof x[i] =="undefined"){
                    delete x[i];
                }
                if (typeof x[i]=="object") {
                    eliminaNulos(x[i]);
                }
            }
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

    constructor(
        private route: ActivatedRoute,
        public casoServ: CasoService,
    	private router: Router ,
        public personaServ: PersonaService,
    ) { }

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
    public consultas: Consultas;
    public apiUrl = "/v1/base/entrevistas";
    public casoId: number = null;
    public id: number = null;
    public personas: any[] = [];
    public masDe3Dias:any;
    @Output() modelUpdate = new EventEmitter<any>();
    public form: FormGroup;
    public model: Entrevista;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public personasHeredadas:any[];
    public heredar = false;
    public heredarSintesis = false;
    public hintStart: String = "Campo obligatorio";
    public hintEnd: String = "150 carácteres mínimo";

    public precarga = true;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        public onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        public options: SelectsService,
        public personaServ: PersonaService,
        public casoService:CasoService,
        private auth: AuthenticationService,

    ) { super();  this.consultas = new Consultas(db); }

    ngOnInit() {
        this.auth.masDe3DiasSinConexion().then( r => {
            let x= r as boolean;
            this.masDe3Dias=r;
        });

        this.model = new Entrevista();
        this.form = this.createForm();

        this.route.params.subscribe(params => {
            if (params['casoId']) {
                this.casoId = +params['casoId'];
            }

            Logger.log('casoId', this.casoId);
            if (params['id']) {
                this.id = + params['id'];
                this.precarga = false;
                let timer = Observable.timer(1);
                timer.subscribe(t => {
                    this.form.disable();
                });
                Logger.log('id', this.id);

                if(this.onLine.onLine) {
                    this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                        this.heredar = response['heredar'];
                        const timer = Observable.timer(1000);

                        timer.subscribe(t=>{
                            this.fillForm(response);
                        });
                        this.modelUpdate.emit(response);
                        this.personas = response.personas;
                    });
                }else {
                    this.db.get("casos", this.casoId).then(t => {
                        let entrevistas = t["entrevistas"] as any[];
                        for (let i = 0; i < entrevistas.length; ++i) {
                            if ((entrevistas[i])["id"] == this.id)    {
                                const entrevista = entrevistas[i];
                                this.heredar = entrevista.heredar;
                                timer.subscribe(t=>{
                                    this.fillForm(entrevistas[i]);
                                });
                                this.modelUpdate.emit(entrevistas[i]);
                                this.personas = entrevistas[i].personas;
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
            'heredarSintesisHechos':  new FormControl(false, []),
            'personas': new FormArray([]),
            'sexoHeredar': new FormControl('', []),
            'edadHeredar': new FormControl('', []),
            'cpHeredar': new FormControl('', []),
            'fechaNacimientoHeredar': new FormControl('', []),
            'noTelefonoCelularHeredar': new FormControl('', []),
            'noTelefonoParticularHeredar': new FormControl('', []),
            'correoElectronicoHeredar': new FormControl('', []),
            'curpHeredar': new FormControl(""),
            'rfcHeredar': new FormControl(""),
            'autoridadRealizaEntrevista': new FormControl(""),
            'lugarRealizaEntrevista': new FormControl(""),
            'nombreEntrevistado': new FormControl(""),
            'calidadIntervinienteHeredar': new FormControl('', []),
            'tipoIdentificacionHeredar': new FormControl('', []),
            'emisorIdentificacionHeredar': new FormControl('', []),
            'noIdentificacionHeredar': new FormControl('', []),
            'gradoEscolaridadHeredar': new FormControl('', []),
            'salarioHeredar': new FormControl('', []),
            'originarioDeHeredar': new FormControl('', []),
            'sabeLeerEscribirHeredar': new FormControl('', []),
            'nombreEntrevistadoHeredar': new FormControl('', []),
            'nacionalidadHeredar': new FormControl('', []),
            'ocupacionHeredar': new FormControl('', []),
            'estadoCivilHeredar': new FormControl('', []),
            'lugarOcupacionHeredar': new FormControl('', []),
            // Localizacion
            'calleHeredar': new FormControl(''),
            'noExteriorHeredar': new FormControl(''),
            'noInteriorHeredar': new FormControl(''),
            'coloniaHeredar': new FormControl(''),
            'municipioHeredar': new FormControl(''),
            'estadoHeredar': new FormControl(''),

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
            'correoElectronico': new FormControl(null),
            'tieneRepresentanteLegal': new FormControl(""),
            'nombreRepresentanteLegal': new FormControl(""),
            'medioTecnologicoRegistro': new FormControl(""),
            'medioTecnologicoUtilizado': new FormControl(""),
            'medioTecnicoRegistro': new FormControl(""),
            'medioTecnicoUtilizado': new FormControl(""),
            'narracionHechos': new FormControl('', [Validators.required, Validators.minLength(150)]),
            'observaciones': new FormControl(''),
            'caso': new FormGroup({
                'id': new FormControl("", []),
            })
        });
    }

	public save(valid: any, _model: any) {
		if(valid){
            _model.caso.id = this.casoId;
            _model.personas = this.cleanPersonasRepetidas(_model.personas);
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
	                        temId: temId,
	                        username: this.auth.user.username
		                }
		                this.db.add("sincronizar",dato).then(p=>{
                            _model['created'] = Date.now();
		                    this.db.get("casos", this.casoId).then(caso=>{
		                        if (caso){
		                            if(!caso["entrevistas"]){
	                        			caso["entrevistas"]=[];
                                    }
                                    if (_model['personas']){
                                        const personas = _model['personas'] as any[];
                                        for (let i = 0; i< personas.length; i++){
                                            personas[i]['personaCaso'] = {id: personas[i]['id']};
                                        }
                                    }
		                            _model["id"]=temId;
		                            this.id= _model['id'];
		                            caso["entrevistas"].push(_model);
		                            this.db.update("casos",caso).then(t => {
                                        this.casoService.actualizaCasoOffline(t);
		                                resolve("Se agregó la entrevista de manera local");
		                                this.router.navigate(['/caso/' + this.casoId + '/entrevista/'+this.id+'/view']);
		                            });
		                        }
		                    });
		                });
					}
				}
			);
		}else{
            console.error('El formulario no pasó la validación D:')
        }
    }
    
    public validateNarraccion(_heredar){
        this.heredar=_heredar;
        if (this.heredar){
            this.hintStart = "";
            this.hintEnd = "";
            this.form.controls.narracionHechos.setValidators([]);
            this.form.controls.narracionHechos.updateValueAndValidity();
        }else{
            this.hintStart = "Campo obligatorio";
            this.hintEnd = "150 carácteres mínimo";
            this.form.controls.narracionHechos.setValidators([Validators.required, Validators.minLength(150)]);
            this.form.controls.narracionHechos.updateValueAndValidity();
        }
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

    public heredarDatos() {
        Logger.log('heredarDatos', this.personasHeredadas);

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
        let hasALocalizacion = false;

        this.cleanCamposHeredar();
        if (this.heredarSintesis) {
            this.form.controls["narracionHechos"].setValue(this.casoService.caso.predenuncias.hechosNarrados);
        }
        let alfabetismos ='';
        let edades = '';
        this.personasHeredadas.forEach((personaCaso)=> {
            // Heradar nombre del entrevistado
            let nombrePersona =
                (personaCaso.persona.nombre ? personaCaso.persona.nombre : "")
                +(personaCaso.persona.paterno ? " "+personaCaso.persona.paterno : "")
                +(personaCaso.persona.materno ? " "+personaCaso.persona.materno : "");

            if (!this.form.controls['nombreEntrevistadoHeredar'].value) {
                this.form.controls['nombreEntrevistadoHeredar'].setValue(nombrePersona);
            } else {
                if (nombrePersona=="" && personaCaso.tipoInterviniente.id==_config.optionValue.tipoInterviniente.imputado) {
                    nombrePersona="Quién Resulte Culpable"
                }
                if (nombrePersona=="" && !(personaCaso.tipoInterviniente.id==_config.optionValue.tipoInterviniente.imputado)) {
                    nombrePersona="Identidad desconocida"
                }
                this.form.controls['nombreEntrevistadoHeredar'].setValue(
                    this.form.controls['nombreEntrevistadoHeredar'].value+","+nombrePersona
                );
            }
            if (personaCaso.persona.sexo) {
                personaCaso.persona.sexo=this.consultas.get('sexo',personaCaso.persona.sexo.id);
            }
            if (personaCaso.persona.estado && personaCaso.persona.estado['id'] && personaCaso.persona.estado['id']!=''){
                personaCaso.persona.estado=this.consultas.get('estado',personaCaso.persona.estado.id);
            }
            if (personaCaso.persona.municipio && personaCaso.persona.municipio['id'] && personaCaso.persona.municipio['id']!=''){
                personaCaso.persona.municipio=this.consultas.get('municipio',personaCaso.persona.municipio.id);
            }
            if (personaCaso.persona.pais && personaCaso.persona.pais['id'] && personaCaso.persona.pais['id']!=''){
                personaCaso.persona.pais=this.consultas.get('pais',personaCaso.persona.pais.id);
            }
            if (personaCaso.persona.estadoCivil && personaCaso.persona.estadoCivil['id'] && personaCaso.persona.estadoCivil['id']!=''){
                personaCaso.persona.estadoCivil=this.consultas.get('estadoCivil',personaCaso.persona.estadoCivil.id);
            }
            if (personaCaso.persona.nacionalidadReligion && personaCaso.persona.nacionalidadReligion['id'] && personaCaso.persona.nacionalidadReligion['id']!=''){
                personaCaso.persona.nacionalidadReligion=this.consultas.get('nacionalidadReligion',personaCaso.persona.nacionalidadReligion.id);
            }
            if (personaCaso.persona.ocupacion && personaCaso.persona.ocupacion['id'] && personaCaso.persona.ocupacion['id']!=''){
                personaCaso.persona.ocupacion=this.consultas.get('ocupacion',personaCaso.persona.ocupacion.id);
            }
            if (personaCaso.persona.escolaridad && personaCaso.persona.escolaridad['id'] && personaCaso.persona.escolaridad['id']!=''){
                personaCaso.persona.escolaridad=this.consultas.get('escolaridad',personaCaso.persona.escolaridad.id);
            }
            if (personaCaso.persona.alfabetismo && personaCaso.persona.alfabetismo['id'] && personaCaso.persona.alfabetismo['id']!=''){
                personaCaso.persona.alfabetismo=this.consultas.get('alfabetismo',personaCaso.persona.alfabetismo.id);
            }
            Logger.log("PERSONA",personaCaso);
            const sexo = personaCaso.persona.sexo ? personaCaso.persona.sexo.nombre : null;
            const sexoControl = this.form.controls["sexoHeredar"];
            const salarioSemanal = personaCaso.persona.ingresoMensual;
            const originarioEstado
                = `${personaCaso.persona.estado && personaCaso.persona.estado.id != '' ? personaCaso.persona.estado.nombre : (personaCaso.persona.estadoNacimientoOtro ? personaCaso.persona.estadoNacimientoOtro : 'Sin estado')}`;
            const originarioMunicipio
                = `${personaCaso.persona.municipio && personaCaso.persona.municipio.id != '' ? personaCaso.persona.municipio.nombre : (personaCaso.persona.municipioNacimientoOtro ? personaCaso.persona.municipioNacimientoOtro : 'Sin municipio')}`;
            const originarioDe = `${originarioEstado} - ${originarioMunicipio}`;
            const originarioDeControl = this.form.controls['originarioDeHeredar'];
            const sabeLeerEscribir = personaCaso.persona.sabeLeerEscribir;
            const sabeLeerEscribirControl = this.form.controls['sabeLeerEscribirHeredar'];
            const lugarOcupacion = personaCaso.persona.lugarTrabajo ? personaCaso.persona.lugarTrabajo : 'Sin valor';
            const lugarOcupacionControl = this.form.controls['lugarOcupacionHeredar'];
            const ocupacion = personaCaso.persona.ocupacion ? personaCaso.persona.ocupacion.nombre : 'Sin valor';
            const ocupacionControl = this.form.controls['ocupacionHeredar'];
            const estadoCivil = personaCaso.persona.estadoCivil ? personaCaso.persona.estadoCivil.nombre : 'Sin valor';
            const estadoCivilControl = this.form.controls['estadoCivilHeredar'];
            const alfabetismo = personaCaso.persona.alfabetismo ? personaCaso.persona.alfabetismo.nombre : 'Sin valor';
            const alfabetismoControl = this.form.controls['sabeLeerEscribirHeredar'];
            const nacionalidad = personaCaso.persona.nacionalidadReligion ? personaCaso.persona.nacionalidadReligion.nacionalidad : 'Sin valor';
            const nacionalidadControl = this.form.controls['nacionalidadHeredar'];

            // Heredar Sexo
            sexoControl.setValue(
                sexoControl.value ? (sexoControl.value+", " + sexo) : sexo
            );
            // Heredar originarioDe
            originarioDeControl.setValue(
                originarioDeControl.value ? (originarioDeControl.value+", " + originarioDe) : originarioDe
            );
            // Heredar sabeLeerEscribir
            sabeLeerEscribirControl.setValue(
                sabeLeerEscribirControl.value ? (sabeLeerEscribirControl.value+", " + sabeLeerEscribir) : sabeLeerEscribir
            );
            // Heredar lugarOcupacion
            lugarOcupacionControl.setValue(
                lugarOcupacionControl.value ? (lugarOcupacionControl.value+", " + lugarOcupacion) : lugarOcupacion
            );
            // Heredar ocupacion
            ocupacionControl.setValue(
                ocupacionControl.value ? (ocupacionControl.value+", " + ocupacion) : ocupacion
            );
            // Heredar estadoCivil
            estadoCivilControl.setValue(
                estadoCivilControl.value ? (estadoCivilControl.value+", " + estadoCivil) : estadoCivil
            );
            // Heredar nacionalidad
            nacionalidadControl.setValue(
                nacionalidadControl.value ? (nacionalidadControl.value+", " + nacionalidad) : nacionalidad
            );
            // Heredar leerEscribir
            if (alfabetismos == '')
                alfabetismos=alfabetismo;
            else
                alfabetismos +=', '+alfabetismo;
            alfabetismoControl.setValue(alfabetismos);

            // Heredar Fecha Nacimiento
            // Logger.log('-> fecha de nacimiento ', personaCaso.persona.fechaNacimiento);

            let fechaNacimientoMoment = personaCaso.persona.fechaNacimiento ? moment(personaCaso.persona.fechaNacimiento).format('DD-MM-YYYY'): 'Sin valor';
            var hoy=moment();
            let edadMoment = personaCaso.persona.fechaNacimiento ? hoy.diff(moment(personaCaso.persona.fechaNacimiento), 'years'): personaCaso.persona.edad;
            if (edades=='')
                edades = ''+edadMoment;
            else
                edades += ', '+edadMoment;
            if (typeof personaCaso.persona.fechaNacimiento === 'number') {
                personaCaso.persona.fechaNacimiento = personaCaso.persona.fechaNacimiento? moment(personaCaso.persona.fechaNacimiento).format('DD-MM-YYYY'):null;
            }
            this.form.controls["fechaNacimientoHeredar"].setValue(
                this.form.controls["fechaNacimientoHeredar"].value ? this.form.controls["fechaNacimientoHeredar"].value + ', '+fechaNacimientoMoment:fechaNacimientoMoment );
            // Heredar Edad
            this.form.controls["edadHeredar"].setValue(edades);
            // heredar Nacionalidad
            //Heredar CURP
            this.form.controls["curpHeredar"].setValue( this.form.controls["curpHeredar"].value?(personaCaso.persona.curp?this.form.controls["curpHeredar"].value+","+personaCaso.persona.curp:this.form.controls["curpHeredar"].value+",Sin valor"):(personaCaso.persona.curp?personaCaso.persona.curp:"Sin valor"))
            //Heredar RFC
            this.form.controls["rfcHeredar"].setValue( this.form.controls["rfcHeredar"].value?(personaCaso.persona.rfc?this.form.controls["rfcHeredar"].value+","+personaCaso.persona.rfc:this.form.controls["rfcHeredar"].value+",Sin valor"):(personaCaso.persona.rfc?personaCaso.persona.rfc:"Sin valor"))

            // Heredar calidad interviniente
            this.form.controls["calidadIntervinienteHeredar"].setValue( 
                this.form.controls["calidadIntervinienteHeredar"].value?
                (personaCaso.tipoInterviniente ?
                    this.form.controls["calidadIntervinienteHeredar"].value+","+personaCaso.tipoInterviniente.tipo:
                        this.form.controls["calidadIntervinienteHeredar"].value+",") : 
                (personaCaso.tipoInterviniente?personaCaso.tipoInterviniente.tipo:"Sin valor"));

            // Heredar tipo identificacion 
            if (personaCaso.persona.idiomaIdentificacion.identificacion) {
                this.form.controls["tipoIdentificacionHeredar"].setValue( 
                    this.form.controls["tipoIdentificacionHeredar"].value?
                        (personaCaso.persona.idiomaIdentificacion?
                            this.form.controls["tipoIdentificacionHeredar"].value+","+(personaCaso.persona.idiomaIdentificacion.identificacion!=null?personaCaso.persona.idiomaIdentificacion.identificacion:'Sin valor'):
                            this.form.controls["tipoIdentificacionHeredar"].value+",Sin valor"):
                        (personaCaso.persona.idiomaIdentificacion?
                            (personaCaso.persona.idiomaIdentificacion.identificacion!=null?personaCaso.persona.idiomaIdentificacion.identificacion:"Sin valor"):
                            "Sin valor"))
            } else {
                this.form.controls["tipoIdentificacionHeredar"].setValue( 
                    this.form.controls["tipoIdentificacionHeredar"].value?
                        (personaCaso.persona.idiomaIdentificacion?
                            this.form.controls["tipoIdentificacionHeredar"].value+","+(personaCaso.persona.identificacion!=null?personaCaso.persona.identificacion:'Sin valor'):
                            this.form.controls["tipoIdentificacionHeredar"].value+",Sin valor"):
                        (personaCaso.persona.idiomaIdentificacion?
                            (personaCaso.persona.identificacion!=null?personaCaso.persona.identificacion:"Sin valor"):
                            "Sin valor"))
            }
            
            // Heredar emisor identificacion
            this.form.controls["emisorIdentificacionHeredar"].setValue( this.form.controls["emisorIdentificacionHeredar"].value?(personaCaso.persona.autoridadEmisora?this.form.controls["emisorIdentificacionHeredar"].value+","+personaCaso.persona.autoridadEmisora:this.form.controls["emisorIdentificacionHeredar"].value+",Sin valor"):(personaCaso.persona.autoridadEmisora?personaCaso.persona.autoridadEmisora:"Sin valor"))

            // Heredar noIdentificacion
            this.form.controls["noIdentificacionHeredar"].setValue( this.form.controls["noIdentificacionHeredar"].value?(personaCaso.persona.folioIdentificacion?this.form.controls["noIdentificacionHeredar"].value+","+personaCaso.persona.folioIdentificacion:this.form.controls["noIdentificacionHeredar"].value+",Sin valor"):(personaCaso.persona.folioIdentificacion?personaCaso.persona.folioIdentificacion:"Sin valor"))

            // Heredar grado Escolaridad
            this.form.controls["gradoEscolaridadHeredar"].setValue( this.form.controls["gradoEscolaridadHeredar"].value?(personaCaso.persona.escolaridad?this.form.controls["gradoEscolaridadHeredar"].value+","+personaCaso.persona.escolaridad.nombre:this.form.controls["gradoEscolaridadHeredar"].value+",Sin valor"):(personaCaso.persona.escolaridad?personaCaso.persona.escolaridad.nombre:"Sin valor"))

            // Heredar salarioHeredar
            this.form.controls["salarioHeredar"].setValue( this.form.controls["salarioHeredar"].value?(personaCaso.persona.ingresoMensual?this.form.controls["salarioHeredar"].value+","+salarioSemanal:this.form.controls["salarioHeredar"].value+",Sin valor"):(personaCaso.persona.ingresoMensual?salarioSemanal:"Sin valor"))

            let localizacion = personaCaso.persona.localizacionPersona? personaCaso.persona.localizacionPersona[0]:null;

            if(localizacion) {
                hasALocalizacion=true;
                // Heredar Calle
                this.form.controls["calleHeredar"].setValue(
                    this.form.controls["calleHeredar"].value ? (localizacion.calle?this.form.controls["calleHeredar"].value+","+localizacion.calle:this.form.controls["calleHeredar"].value+",Sin valor") : (localizacion.calle ? localizacion.calle:"Sin valor")
                );
                // Heredar No Exterior
                this.form.controls["noExteriorHeredar"].setValue( this.form.controls["noExteriorHeredar"].value?(localizacion.noExterior?this.form.controls["noExteriorHeredar"].value+","+localizacion.noExterior:this.form.controls["noExteriorHeredar"].value+",Sin valor"):(localizacion.noExterior?localizacion.noExterior:"Sin valor"))
                // Heredar No interior
                this.form.controls["noInteriorHeredar"].setValue( this.form.controls["noInteriorHeredar"].value?(localizacion.noInterior?this.form.controls["noInteriorHeredar"].value+","+localizacion.noInterior:this.form.controls["noInteriorHeredar"].value+",Sin valor"):(localizacion.noInterior?localizacion.noInterior:"Sin valor"))
                // Heredar CP
                this.form.controls["cpHeredar"].setValue( this.form.controls["cpHeredar"].value?(localizacion.cp?this.form.controls["cpHeredar"].value+","+localizacion.cp:this.form.controls["cpHeredar"].value+",Sin valor"):(localizacion.cp?localizacion.cp:"Sin valor"))

                let colonia=(localizacion.colonia?localizacion.colonia.nombre:(localizacion.coloniaOtro?localizacion.coloniaOtro:null))
                let municipio=(localizacion.municipio?localizacion.municipio.nombre:(localizacion.municipioOtro?localizacion.municipioOtro:null))
                let estado=(localizacion.estado?localizacion.estado.nombre:(localizacion.estadoOtro?localizacion.estadoOtro:null))
                // Heredar colonia
                this.form.controls["coloniaHeredar"].setValue( this.form.controls["coloniaHeredar"].value?(colonia?this.form.controls["coloniaHeredar"].value+","+colonia:this.form.controls["coloniaHeredar"].value+",Sin valor"):(colonia?colonia:"Sin valor"))
                // Heredar Municipio
                this.form.controls["municipioHeredar"].setValue( this.form.controls["municipioHeredar"].value?(municipio?this.form.controls["municipioHeredar"].value+","+municipio:this.form.controls["municipioHeredar"].value+",Sin valor"):(municipio?municipio:"Sin valor"))
                // Heredar Estado
                this.form.controls["estadoHeredar"].setValue( this.form.controls["estadoHeredar"].value?(estado?this.form.controls["estadoHeredar"].value+","+estado:this.form.controls["estadoHeredar"].value+",Sin valor"):(estado?estado:"Sin valor"))
                // Heredar Tel particular
                this.form.controls["noTelefonoParticularHeredar"].setValue( this.form.controls["noTelefonoParticularHeredar"].value?(localizacion.telParticular?this.form.controls["noTelefonoParticularHeredar"].value+","+localizacion.telParticular:this.form.controls["noTelefonoParticularHeredar"].value+",Sin valor"):(localizacion.telParticular?localizacion.telParticular:"Sin valor"))
                // Heredar Tel movil
                this.form.controls["noTelefonoCelularHeredar"].setValue( this.form.controls["noTelefonoCelularHeredar"].value?(localizacion.telMovil?this.form.controls["noTelefonoCelularHeredar"].value+","+localizacion.telMovil:this.form.controls["noTelefonoCelularHeredar"].value+",Sin valor"):(localizacion.telMovil?localizacion.telMovil:"Sin valor"))
                // Heredar Tel correo
                this.form.controls["correoElectronicoHeredar"].setValue( this.form.controls["correoElectronicoHeredar"].value?(localizacion.correo?this.form.controls["correoElectronicoHeredar"].value+","+localizacion.correo:this.form.controls["correoElectronicoHeredar"].value+",Sin valor"):(localizacion.correo?localizacion.correo:"Sin valor"))

            } else {
                this.setSinValor("calleHeredar");
                this.setSinValor('noExteriorHeredar');
                this.setSinValor("noExterior");
                this.setSinValor("noInteriorHeredar");
                this.setSinValor("noInterior");
                this.setSinValor("coloniaHeredar");
                this.setSinValor("estadoHeredar");
                this.setSinValor("municipioHeredar");
                this.setSinValor("correoElectronicoHeredar");
                this.setSinValor("cpHeredar");
                this.setSinValor("municipio");
                this.setSinValor("estado");
                this.setSinValor("noTelefonoParticularHeredar");
                this.setSinValor("noTelefonoCelularHeredar");

                // this.setSinValor("calidadIntervinienteHeredar");
                // this.setSinValor("tipoIdentificacionHeredar");
                // this.setSinValor("emisorIdentificacionHeredar");
                // this.setSinValor("noIdentificacionHeredar");
                // this.setSinValor("gradoEscolaridadHeredar");
                // this.setSinValor("salarioHeredar");

            }
        });
    }

    public setSinValor(key) {
        console.log('set sin valor',key)
        this.form.controls[key].setValue( this.form.controls[key].value?this.form.controls[key].value+",Sin valor":"Sin valor")
    }

    public  personasChanged(_personasHeredadas) {
        this.form.updateValueAndValidity();
        Logger.log('-> personasChanged()', this.form, this.form.value);
        this.personasHeredadas = _personasHeredadas;
    }

    public heredarChanged(_heredar:any) {
        this.heredar=_heredar;
        this.validateNarraccion(_heredar);
    }

    public tipoChange(_tipo): void {
        Logger.log('valor', _tipo);
    }

    public calculateAge(e){

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

    public cleanCamposHeredar() {
        this.form.controls['nombreEntrevistadoHeredar'].setValue('');
        this.form.controls['sexoHeredar'].setValue('');
        this.form.controls['fechaNacimientoHeredar'].setValue('');
        this.form.controls['edadHeredar'].setValue('');
        this.form.controls['nacionalidadHeredar'].setValue('');
        this.form.controls['curpHeredar'].setValue('');
        this.form.controls['rfcHeredar'].setValue('');
        this.form.controls['ocupacionHeredar'].setValue('');
        this.form.controls['lugarOcupacionHeredar'].setValue('');
        this.form.controls['estadoCivilHeredar'].setValue('');
        this.form.controls['narracionHechos'].setValue('');
        this.form.controls['calleHeredar'].setValue('')
        this.form.controls['noExteriorHeredar'].setValue('')
        this.form.controls['noInteriorHeredar'].setValue('')
        this.form.controls['cpHeredar'].setValue('')
        this.form.controls['coloniaHeredar'].setValue('')
        this.form.controls['municipioHeredar'].setValue('')
        this.form.controls['estadoHeredar'].setValue('')
        this.form.controls['noTelefonoParticularHeredar'].setValue('')
        this.form.controls['noTelefonoCelularHeredar'].setValue('');
        this.form.controls['correoElectronicoHeredar'].setValue('');
        this.form.controls['calidadIntervinienteHeredar'].setValue('')
        this.form.controls['tipoIdentificacionHeredar'].setValue('')
        this.form.controls['emisorIdentificacionHeredar'].setValue('')
        this.form.controls['noIdentificacionHeredar'].setValue('')
        this.form.controls['gradoEscolaridadHeredar'].setValue('')
        this.form.controls['salarioHeredar'].setValue('');
        this.form.controls['originarioDeHeredar'].setValue('');
        this.form.controls['sabeLeerEscribirHeredar'].setValue('');
    }

    public heredarSintesisChange(_event: boolean) {
        this.heredarSintesis = _event;
    }

    public cleanPersonasRepetidas(_personas) {
        const newPersonas = [];

        _personas.forEach(o => {
            if (newPersonas.length === 0) {
                newPersonas.push(o);
            } else {
                newPersonas.forEach(np => {
                    if (np.id !== o.id) {
                        newPersonas.push(o);
                    }
                });
            }
        });

        return newPersonas;
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
    public caso: CasoService,
    public auth: AuthenticationService
    ) {
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
      	this.cargaArchivosOffline(this,"",DocumentoEntrevista,{idEntrevista:this.object['id']});
      }

      this.route.params.subscribe(params => {
          if (params['casoId']){
            this.casoId = +params['casoId'];
            this.urlUpload = '/v1/documentos/entrevistas/save/'+params['casoId'];
            this.caso.find(params['casoId']).then(
              response => {
                  this.updateDataFormatos(this.caso.caso);
              }
          );

            }
            this.caso.casoChange.subscribe(this.updateDataFormatos.bind(this));
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
        this.cargaArchivosOffline(this,"",DocumentoEntrevista,{idEntrevista:this.object['id']});
  	}

  }



  public setData(_object){
      Logger.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }
  public updateDataFormatos(_object){
    this.formatos.formatos.setDataF1008(_object, this.id);
}

}

export class DocumentoEntrevista {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
