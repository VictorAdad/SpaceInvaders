import { LugarService } from '@services/noticia-hecho/lugar.service';
import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { Predenuncia } from '@models/predenuncia';
import { Component, ViewChild,Output,Input,EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SelectsService } from "@services/selects.service";
import { FormatosService } from '@services/formatos/formatos.service';
import { CasoService } from '@services/caso/caso.service';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GlobalService } from "@services/global.service";
import { TableDataSource } from './../../global.component';
import { AuthenticationService } from '@services/auth/authentication.service.ts';
import { Logger } from "@services/logger.service";
import { Yason } from '../../../../services/utils/yason';
import * as moment from 'moment'


export class PredenunciaGlobal{
  public validateMsg(form: FormGroup){
        return !form.valid ? 'No se han llenado los campos requeridos' : '';
    }
	public validateForm(form: FormGroup) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateForm(control);
            }
        });
    }

}

@Component({
    templateUrl:'./create.component.html',
})
export class PredenunciaCreateComponent {
    public casoId: number = null;
    public hasPredenuncia:boolean = false;
    public apiUrl:string="/v1/base/predenuncias/casos/";
    public breadcrumb = [];
    public object: any;
    solicitudId:number=null

    constructor(
        private route: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private router: Router,
        public db: CIndexedDB,
        public casoServ: CasoService,

      ){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"});

                this.casoServ.find(this.casoId).then(
                    caso => {
                        if(!this.casoServ.caso.hasRelacionVictimaImputado)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )

                if(this.onLine.onLine){
                    this.http.get(this.apiUrl+params['casoId']+'/page').subscribe(response => {
                        if(parseInt(response.totalCount) !== 0){
                            this.hasPredenuncia = true;
                            this.object = response;
                        }
                    });
                }else{
                    this.db.get("casos",this.casoId).then(caso=>{
                        if (caso){
                            if(caso["predenuncias"]){
                                this.hasPredenuncia = true;
                                this.object = caso["predenuncias"];
                            }
                        }
                    });
                }
            }
            //
        });
    }


    idUpdate(event: any) {
      this.solicitudId = event.id;
      Logger.log("Recibiendo id emitido", event.id);
    }

}

@Component({
	selector: 'predenuncia',
    templateUrl:'./predenuncia.component.html',
})
export class PredenunciaComponent  extends PredenunciaGlobal{
	public form : FormGroup;
    public model : Predenuncia;
    public personas: any[] = [];
    public masDe3Dias:any;
    public isUserX: boolean=false;// cambiar aquí la lógica del usuario
    public casoId: number = null;
    public hasPredenuncia:boolean=false;
    public apiUrl:string="/v1/base/predenuncias/casos/";
    @Output() idEmitter = new EventEmitter<any>();
    public personasHeredadas:any[]=[];
    public heredar:boolean=false;
    public heredarSintesis:boolean=false;

    public precarga = true;

    constructor(
        private _fbuilder: FormBuilder,
        public onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private route: ActivatedRoute,
        public authen: AuthenticationService,
        public optionsServ: SelectsService,
        public lugarServ:LugarService,
        private casoService:CasoService,
        public db: CIndexedDB) {
            super();
        }

    ngOnInit(){
        this.authen.masDe3DiasSinConexion().then(r=>{
            let x= r as boolean;
            this.masDe3Dias=r;
        });
        this.model = new Predenuncia();
        this.form  = new FormGroup({
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
            'heredarSintesisHechos': new FormControl(false,[]),
            'personas': new FormArray([]),
            'calidadPersonaHeredar': new FormControl("",[]),
            'tipoPersonaHeredar': new FormControl('',[]),
            'lugarHechosHeredar': new FormControl('',[]),
            'caso': new FormGroup({
                'id': new FormControl()
            }),
            // 'calidadUsuario'        :  new FormControl(this.model.calidadUsuario),
            'noTelefonico'        :  new FormControl(this.model.numeroTelefono),
            'tipoLinea'   :  new FormGroup({
                'id': new FormControl(null),
            }),
            'lugarLlamada'          :  new FormControl(this.model.lugarLlamada),
            'hechosNarrados'        :  new FormControl(this.model.hechosNarrados),
            'comunicado'               :  new FormControl(this.model.usuario),
            'horaConlcusionLlamada' :  new FormControl(this.model.horaConlcusionLlamada),
            'duracionLlamada'       :  new FormControl(this.model.duracionLlamada),
            'nombreServidorPublico' :  new FormControl(this.model.nombreServidorPublico),
            'observaciones'         :  new FormControl(this.model.observaciones),
            //Constancia de lectura de Derechos
            'noFolioConstancia'              :  new FormControl(this.model.numeroFolio),
            'hablaEspaniol'                   :  new FormControl(this.model.hablaEspanol),
            'lenguaIdioma'                         :  new FormControl(this.model.idioma),
            'nombreInterprete'               :  new FormControl(this.model.nombreInterprete),
            'compredioDerechos'             :  new FormControl(this.model.comprendioDerechos),
            'proporcionoCopia'                  :  new FormControl(this.model.copiaDerechos),
            //Oficio de asignación de asesor jurídico
            'autoridadOficioAsignacion'      :  new FormControl(this.model.autoridadOficioAsignacion),
            'denunciaQuerella'               :  new FormControl(this.model.denunciaQuerella),
            'ubicacionUnidadInmediata'       :  new FormControl(this.model.ubicacionUnidadInmediata),
            'victimaOfendidoQuerellante'     :  new FormControl(this.model.victimaOfendidoQuerellante),
            'cargoAutoridadOficioAsignacion' :  new FormControl(this.model.cargoAutoridadOficioAsignacion),
            // Registro presenial
            'calidadPersona'          :  new FormControl(this.model.calidadPersona),
            'tipoPersona'          :  new FormGroup({
                'id' : new FormControl(''),
            }),
            'lugarHechos'          :  new FormControl(this.model.lugarHechos),
            'conclusion'          :  new FormControl(this.model.conclusionHechos),
            'canalizacion'          :  new FormControl(this.model.canalizacion),
            'institucion'          :  new FormControl(this.model.institucionCanalizacion),
            'motivoCanalizacion'          :  new FormControl(this.model.motivocanalizacion),
            'fechaCanalizacion'          :  new FormControl(),
            'horaCanalizacion'          :  new FormControl(),
            'horaConclusionLlamada'          :  new FormControl(''),
            'nombreCausante'          :  new FormControl(this.model.personaCausohecho),
            'domicilioCausante'          :  new FormControl(this.model.domicilioQuienCauso),
            'quienRegistro'          :  new FormControl(''),
            // Oficio Ayuda atencion victima

            'oficio'                         :  new FormControl(this.model.victimaOfendidoQuerellante),
            'nombreAutoridadDirigeOficio'    :  new FormControl(this.model.victimaOfendidoQuerellante),
            'necesidadesCubrir'              :  new FormControl(this.model.victimaOfendidoQuerellante),
            'ubicacionUnidadInmediataVictima':  new FormControl(this.model.victimaOfendidoQuerellante),
            'cargoAutoridadVictima'          :  new FormControl(this.model.victimaOfendidoQuerellante),
            // 'observaciones'         :  new FormControl(this.model.observaciones),
        });

        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.casoService.find(this.casoId);
                Logger.log(this.casoId);
                if(this.onLine.onLine){
                    Logger.log('OnLine------------>',);
                    this.http.get(this.apiUrl+this.casoId+'/page').subscribe(response => {
                         if(parseInt(response.totalCount) !== 0){
                            this.precarga = false;
                            this.hasPredenuncia = true;
                            Logger.log("Dont have predenuncia");
                            this.model= response.data[0] as Predenuncia;
                            let x=response.data[0].heredar;
                            const timer = Observable.timer(1000);
                            timer.subscribe(t=>{
                                console.log("RESPONSE HEREDAR ->>>>>>>><",x, this.form,response.data[0].tipoPersonaHeredar);
                                this.heredar = x;
                                const timer2 = Observable.timer(100);

                                timer2.subscribe( t => {
                                    if (x && response.data[0].tipoPersonaHeredar != null && response.data[0].tipoPersonaHeredar != undefined){
                                        this.form.controls.tipoPersonaHeredar.setValue(response.data[0].tipoPersonaHeredar);
                                    }
                                    if (x && response.data[0].calidadPersonaHeredar != null && response.data[0].calidadPersonaHeredar != undefined){
                                        this.form.controls.calidadPersonaHeredar.setValue(response.data[0].calidadPersonaHeredar);
                                    }
                                    if (x && response.data[0].lugarHechosHeredar != null && response.data[0].lugarHechosHeredar != undefined){
                                        this.form.controls.lugarHechosHeredar.setValue(response.data[0].lugarHechosHeredar);
                                    }
                                    this.form.disable();
                                });

                            })
                            Logger.logColor('<<< model >>>','red', this.model);
                            this.personas = response.data[0].personas;
                            Logger.logColor('<<< personas >>>','purple', this.personas);
                            var fechaCompleta:Date= new Date(response.fechaHoraInspeccion);
                            // this.model.fechaCanalizacion=fechaCompleta;
                            var horas: string=(String(fechaCompleta.getHours()).length==1)?'0'+fechaCompleta.getHours():String(fechaCompleta.getHours());
                            var minutos: string=(String(fechaCompleta.getMinutes()).length==1)?'0'+fechaCompleta.getMinutes():String(fechaCompleta.getMinutes());;
                            this.model.horaConlcusionLlamada=horas+':'+minutos;
                            Logger.log("Emitiendo id..",this.model.id)
                            this.idEmitter.emit({id: this.model.id});
                            Logger.log('PP----------->',this.model);
                            this.fillForm(this.model);
                        }
                    });
                }else{
                    Logger.log('1.-OffLine------------>');
                    this.db.get("casos", this.casoId).then(caso=>{
                        Logger.log("Caso en armas ->",caso);
                        if (caso){
                            if(caso["predenuncias"]){
                                this.hasPredenuncia = true;
                                Logger.log("Have predenuncias");
                                let model = caso['predenuncias'];
                                var fechaCompleta: Date = new Date(model.fechaHoraInspeccion);
                                this.model.fechaCanalizacion=fechaCompleta;
                                let x=model.heredar;
                                const timer = Observable.timer(1000);
                                timer.subscribe(t=>{
                                    console.log("RESPONSE HEREDAR ->>>>>>>><",x, this.form,model.tipoPersonaHeredar);
                                    this.heredar = x;
                                    this.heredarChanged(x,model.tipoPersonaHeredar);
                                    const timer2 = Observable.timer(100);
                                    timer2.subscribe( t => {
                                        if (model.tipoPersonaHeredar != null && model.tipoPersonaHeredar != undefined){
                                            this.form.controls.tipoPersonaHeredar.setValue(model.tipoPersonaHeredar);
                                        }
                                        if (model.calidadPersonaHeredar != null && model.calidadPersonaHeredar != undefined){
                                            this.form.controls.calidadPersonaHeredar.setValue(model.calidadPersonaHeredar);
                                        }
                                        
                                        console.log('############', this.form.controls.tipoPersonaHeredar,this.form.controls.calidadPersonaHeredar );
                                        this.form.disable();
                                    });

                                })
                                var horas: string=(String(fechaCompleta.getHours()).length==1)?'0'+fechaCompleta.getHours():String(fechaCompleta.getHours());
                                var minutos: string=(String(fechaCompleta.getMinutes()).length==1)?'0'+fechaCompleta.getMinutes():String(fechaCompleta.getMinutes());;
                                this.model.horaConlcusionLlamada=horas+':'+minutos;
                                Logger.log("Emitiendo id..",this.model.id)
                                this.idEmitter.emit({id: this.model.id});
                                Logger.log('4.- OffLine------------>', model);
                                this.personas = model.personas;
                                Logger.log('4.- OffLine------------>', this.personas);
                                this.fillForm(model);
                            }
                        }
                    });
                }
            }

        });
    }

    concatDate(fechaCanalizacion, horaCanalizacion){
        return fechaCanalizacion = new Date(fechaCanalizacion+' '+horaCanalizacion)
    }

    public heredarSistesisChange(_event){
        this.heredarSintesis = _event;
    }

    public heredarDatos() {

        if (this.form.controls['lugar'].value) {
            let lugar='';

            for(let i=0;i<this.casoService.caso.lugares.length;i++){
                if(this.casoService.caso.lugares[i].id === this.form.controls["lugar"].value.id){
                    lugar=(this.casoService.caso.lugares[i].calle?this.casoService.caso.lugares[i].calle:"")+" "+
                    (this.casoService.caso.lugares[i].noExterior?this.casoService.caso.lugares[i].noExterior:"")+" "+
                    (this.casoService.caso.lugares[i].noInterior?this.casoService.caso.lugares[i].noInterior:"")+" "+
                    (this.casoService.caso.lugares[i].colonia?this.casoService.caso.lugares[i].colonia.nombre:(this.casoService.caso.lugares[i].coloniaOtro?this.casoService.caso.lugares[i].coloniaOtro:""))+" "+
                    (this.casoService.caso.lugares[i].municipio?this.casoService.caso.lugares[i].municipio.nombre:(this.casoService.caso.lugares[i].municipioOtro?this.casoService.caso.lugares[i].municipioOtro:""))+" "+
                    (this.casoService.caso.lugares[i].estado?this.casoService.caso.lugares[i].estado.nombre:(this.casoService.caso.lugares[i].estadoOtro?this.casoService.caso.lugares[i].estadoOtro:""))+" "+
                    (this.casoService.caso.lugares[i].pais?this.casoService.caso.lugares[i].pais.nombre:"");
                    break;
                }

            }

            this.form.controls['lugarHechosHeredar'].setValue(lugar);
            this.form.controls['tipoPersonaHeredar'].setValue('');
            this.form.controls['calidadPersonaHeredar'].setValue('');

            if (this.casoService.caso && this.heredarSintesis)  {
                this.form.controls['hechosNarrados'].setValue(this.casoService.caso.descripcion);
            } else {
                this.form.controls['hechosNarrados'].setValue('');
            }


        }

        this.personasHeredadas.forEach((personaCaso)=> {
            this.form.controls["tipoPersonaHeredar"].setValue(this.form.controls["tipoPersonaHeredar"].value?(personaCaso.persona.tipoPersona?this.form.controls["tipoPersonaHeredar"].value+","+personaCaso.persona.tipoPersona:"Sin valor"):personaCaso.persona.tipoPersona?personaCaso.persona.tipoPersona:"Sin valor")
            this.form.controls["calidadPersonaHeredar"].setValue(this.form.controls["calidadPersonaHeredar"].value?(personaCaso.tipoInterviniente?this.form.controls["calidadPersonaHeredar"].value+","+personaCaso.tipoInterviniente.tipo:"Sin valor"):personaCaso.tipoInterviniente.tipo?personaCaso.tipoInterviniente.tipo:"Sin valor")
        });

    }

    public heredarChanged(_heredar, _tipoPersonaHeredar='') {
        this.heredar = _heredar;
    }

    public  personasChanged(_personasHeredadas){
        Logger.logColor('PERSONAS HEREDADAS','orange',_personasHeredadas);
      this.personasHeredadas=_personasHeredadas;
    }
    public save(valid : any, _model : any){
        if(valid){
            _model.personas = this.cleanPersonasRepetidas(_model.personas);
            return new Promise<any>(
                (resolve, reject) => {
                    if(this.onLine.onLine){
                        Logger.log('--------------->', this.model.fechaCanalizacion);
                        this.model.fechaCanalizacion = this.concatDate(this.model.fechaCanalizacion, this.model.horaCanalizacion);
                        Object.assign(this.model, _model);
                        this.model.caso.id = this.casoId;
                        Logger.log(this.model);
                        this.model.tipo="Predenuncia";// temporalmente
                        if(this.model.fechaCanalizacion){
                            var fechaCompleta = new Date (this.model.fechaCanalizacion);
                            if(this.model.horaCanalizacion)
                            { fechaCompleta.setMinutes(parseInt(this.model.horaCanalizacion.split(':')[1]));
                                fechaCompleta.setHours(parseInt(this.model.horaCanalizacion.split(':')[0]));
                            }
                            var mes:number=fechaCompleta.getMonth()+1;
                            this.model.fechaCanalizacion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
                            Logger.log('lo que envio: '+  this.model.fechaCanalizacion);
                        }
                        this.http.post('/v1/base/predenuncias', this.model).subscribe(
                            (response) => {
                                Logger.logColor('<<< RESPONSE >>>','RED',response);
                                this.casoService.addPredenuncia(response).then( t =>{
                                    resolve('Predenuncia creada con éxito');
                                    this.router.navigate(['/caso/'+this.casoId+'/detalle' ]);
                                });
                             },
                            (error) => {
                                Logger.error('Error', error);
                                reject(error);
                            }
                        );
                    }else{
                        let temId = Date.now();
                        _model.caso.id = this.casoId;

                        if(_model.fechaCanalizacion){
                            Logger.log('1.-  -------->',_model.fechaCanalizacion);
                            var fechaCompletaOff = new Date (_model.fechaCanalizacion);
                            Logger.log('2.-  -------->',fechaCompletaOff);
                            if(_model.horaCanalizacion){
                                fechaCompletaOff.setMinutes(parseInt(_model.horaCanalizacion.split(':')[1]));
                                fechaCompletaOff.setHours(parseInt(_model.horaCanalizacion.split(':')[0]));
                            }
                            var mes:number=fechaCompletaOff.getMonth()+1;
                            _model.fechaCanalizacion=fechaCompletaOff.getFullYear()+'-'+mes+'-'+fechaCompletaOff.getDate()+' '+fechaCompletaOff.getHours()+':'+fechaCompletaOff.getMinutes()+':00.000';
                            Logger.log('lo que envio: '+  _model.fechaCanalizacion);
                        }
                        Object.assign(this.model, _model);
                        Logger.logColor('MODEL@SAVE', 'green', _model, this.model);
                        let dato = {
                            url:'/v1/base/predenuncias',
                            body:this.model,
                            options:[],
                            tipo:"post",
                            pendiente:true,
                            dependeDe:[this.casoId],
                            temId: temId,
                            username: this.authen.user.username
                        }
                        this.db.add("sincronizar", dato).then(p=>{
                            this.db.get("casos",this.casoId).then(caso=>{
                                if (caso){
                                    if(!caso["predenuncias"]){
                                        caso["predenuncias"];
                                    }
                                    if (_model['personas']){
                                        const personas = _model['personas'] as any[];
                                        for (let i = 0; i< personas.length; i++){
                                            personas[i]['personaCaso'] = {id: personas[i]['id']};
                                        }
                                    }
                                    _model["id"]=temId;
                                    caso["predenuncias"] = _model;
                                    Logger.logDarkColor('      PERSONAS     ','cyan',caso["predenuncias"]);
                                    this.db.update("casos",caso).then(t=>{
                                        Logger.log("caso arma", t["arma"]);
                                        resolve("Se agregó la predenuncia de manera local");
                                        this.casoService.actualizaCasoOffline(t);
                                        this.router.navigate(['/caso/'+this.casoId+'/detalle']);
                                    });
                                }
                            });
                        });
                    }
                    Logger.log('--------------->', this.model.fechaCanalizacion);
                }
            );
        }else{
            console.error('El formulario no pasó la validación D:')
        }

    }

    public fillForm(_data) {
        if (_data['fechaCanalizacion']) {
            _data.fechaCanalizacion = new Date(_data.fechaCanalizacion);
        }
        Yason.eliminaNulos(_data);
        Logger.log('Predenuncia@fillForm()', _data);
        this.form.patchValue(_data);
        if (_data['fechaCanalizacion']) {
            const time = _data.fechaCanalizacion.getHours()+':'+_data.fechaCanalizacion.getMinutes();
            this.form.controls.horaCanalizacion.setValue(time);
            Logger.log('HH----------------->', time, _data)
        }
        
        const timer = Observable.timer(1000);
        timer.subscribe(t=>{
            if(_data.heredar) {
                if (_data.lugarHechos) {
                    this.form.controls.lugarHechosHeredar.setValue(_data.lugarHechos);
                }
                if (_data.lugarHechosHeredar) {
                    this.form.controls.lugarHechosHeredar.setValue(_data.lugarHechosHeredar);
                }
            }
        });
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
	selector: 'documento-predenuncia',
    templateUrl:'./documento-predenuncia.component.html',
})

export class DocumentoPredenunciaComponent extends FormatosGlobal {
    displayedColumns = ['nombre', 'fechaCreacion', 'procedimiento'];
    @Input() id:number=null;
    @Input()
    object: any;
    dataSource: TableDataSource | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public data: DocumentoPredenuncia[] = [];
    public subject:BehaviorSubject<DocumentoPredenuncia[]> = new BehaviorSubject<DocumentoPredenuncia[]>([]);
    public source:TableDataSource = new TableDataSource(this.subject);
    public isCallCenter:boolean=false;
    public formData:FormData = new FormData();
    public urlUpload: string;
    public documentClass: DocumentoPredenuncia;

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
        public authen: AuthenticationService,
        ){
        super(
            http,
            confirmationService,
            globalService,
            dialog,
            onLine,
            formatos,
            authen,
            db
            );
        this.vista="predenuncia";
    }

    ngOnInit() {
        if (this.authen.user.roles[0] === this.authen.roles.callCenter) {
            this.isCallCenter = true;
        }
        var obj=this;
        if(this.onLine.onLine){
            if(this.object.data)
                this.object=this.object.data[0];
                Logger.log('1. ----------->', this.object);
            if(this.object.documentos){
                this.dataSource = this.source;
                for (let object of this.object.documentos) {
                    object['fechaCreacion'] = moment(this.object.documentos["0"].created).format('DD/MM/YYYY');
                    this.data.push(object);
                    this.subject.next(this.data);
                }

            }
            this.formData.append('predenuncia.id', this.object.id.toString());
            obj.atributoExtraPost={nombre:"predenuncia.id",valor:this.object.id.toString()};
        }else{
            this.cargaArchivosOffline(this,"",DocumentoPredenuncia);
        }

        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.urlUpload = '/v1/documentos/predenuncias/save/'+params['casoId'];
                // if(!this.onLine.onLine){
                    this.caso.find(params['casoId']).then(
                        response => {
                            this.updateDataFormatos(this.caso.caso);
                            if(!this.onLine.onLine){
                                this.object = this.caso.caso.predenuncias;
                            }
                            this.formData.append('predenuncia.id', this.object.id.toString());
                            obj.atributoExtraPost={nombre:"predenuncia.id",valor:this.object.id.toString()};
                        }
                    );
                // }
            }

        });

    }


    public cargaArchivos(_archivos){
        if (this.onLine.onLine){
          let archivos=_archivos.saved
            for (let object of archivos) {
                this.data.push(object);
                this.subject.next(this.data);
            }
        }else{
            this.cargaArchivosOffline(this,"",DocumentoPredenuncia);
        }
    }

    public setData(_object){
        Logger.log('setData()',_object);
        _object['fechaCreacion'] = moment(_object.created).format('DD/MM/YYYY');
        this.data.push(_object);
        this.subject.next(this.data);
    }

    public updateDataFormatos(_caso){
        this.formatos.formatos.setDataF1004(_caso);
        this.formatos.formatos.setDataF1003(_caso);
        this.formatos.formatos.setDataF1005(_caso);
    }

}

export class DocumentoPredenuncia {
	id:number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
