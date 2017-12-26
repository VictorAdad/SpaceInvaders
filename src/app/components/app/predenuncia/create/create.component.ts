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
        public db: CIndexedDB){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"});

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
    public isUserX: boolean=false;// cambiar aquí la lógica del usuario
    public casoId: number = null;
    public hasPredenuncia:boolean=false;
    public apiUrl:string="/v1/base/predenuncias/casos/";
    @Output() idEmitter = new EventEmitter<any>();

    constructor(
        private _fbuilder: FormBuilder,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private route: ActivatedRoute,
        public authen: AuthenticationService,
        public optionsServ: SelectsService,
        public db: CIndexedDB) {
            super();
        }

    ngOnInit(){
        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                Logger.log(this.casoId);
                if(this.onLine.onLine){
                    Logger.log('OnLine------------>',);
                    this.http.get(this.apiUrl+this.casoId+'/page').subscribe(response => {
                         if(parseInt(response.totalCount) !== 0){
                            this.hasPredenuncia = true;
                            Logger.log("Dont have predenuncia");
                            this.form.disable();
                            this.model= response.data[0] as Predenuncia;
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
                                this.form.disable();
                                let model = caso['predenuncias'];
                                var fechaCompleta: Date = new Date(model.fechaHoraInspeccion);
                                this.model.fechaCanalizacion=fechaCompleta;
                                var horas: string=(String(fechaCompleta.getHours()).length==1)?'0'+fechaCompleta.getHours():String(fechaCompleta.getHours());
                                var minutos: string=(String(fechaCompleta.getMinutes()).length==1)?'0'+fechaCompleta.getMinutes():String(fechaCompleta.getMinutes());;
                                this.model.horaConlcusionLlamada=horas+':'+minutos;
                                Logger.log("Emitiendo id..",this.model.id)
                                this.idEmitter.emit({id: this.model.id});
                                Logger.log('4.- OffLine------------>', model);
                                this.fillForm(model);
                            }
                        }
                    });
                }
            }

        });

        this.model = new Predenuncia();
        let timer = Observable.timer(1);
        //timer.subscribe(t => {
            //if (this.authen.user.hasRoles(this.authen.roles.callCenter)) {
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
                  'personas': new FormArray([]),

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
                'fechaCanalizacion'          :  new FormControl(this.model.fechaCanalizacion),
                'horaCanalizacion'          :  new FormControl(this.model.horaCanalizacion),
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

            //}
        //});
    }

    concatDate(fechaCanalizacion, horaCanalizacion){
        return fechaCanalizacion = new Date(fechaCanalizacion+' '+horaCanalizacion)
    }

    public save(valid : any, _model : any){
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
                            Logger.log(response);

                            resolve('Predenuncia creada con éxito');
                            this.router.navigate(['/caso/'+this.casoId+'/detalle' ]);
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
                    let dato = {
                        url:'/v1/base/predenuncias',
                        body:_model,
                        options:[],
                        tipo:"post",
                        pendiente:true,
                        dependeDe:[this.casoId],
                        temId: temId
                    }
                    this.db.add("sincronizar", dato).then(p=>{
                        this.db.get("casos",this.casoId).then(caso=>{
                            if (caso){
                                if(!caso["predenuncias"]){
                                    caso["predenuncias"];
                                }
                                _model["id"]=temId;
                                caso["predenuncias"] = _model;
                                Logger.log("caso arma", caso["predenuncia"]);
                                this.db.update("casos",caso).then(t=>{
                                    Logger.log("caso arma", t["arma"]);
                                    resolve("Se agregó la arma de manera local");
                                    this.router.navigate(['/caso/'+this.casoId+'/detalle']);
                                });
                            }
                        });
                    });
                }
                Logger.log('--------------->', this.model.fechaCanalizacion);
            }
        );
    }

    public fillForm(_data) {
        for (var propName in _data) {
            if (_data[propName] === null || _data[propName] === undefined) {
              delete (_data)[propName];
            }
        }
        _data.fechaCanalizacion = new Date(_data.fechaCanalizacion);


        var time = _data.fechaCanalizacion.getHours()+':'+_data.fechaCanalizacion.getMinutes();

        Logger.log('HH----------------->', time)

        this.form.patchValue(_data);
        this.form.controls.horaCanalizacion.setValue(time);

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
        this.vista="predenuncia";
    }

    ngOnInit() {
        var obj=this;
        if(this.onLine.onLine){
            if(this.object.data)
                this.object=this.object.data[0];
                Logger.log('1. ----------->', this.object);
            if(this.object.documentos){
                this.dataSource = this.source;
                for (let object of this.object.documentos) {
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
        Logger.log('setData()');
        this.data.push(_object);
        this.subject.next(this.data);
    }

    public updateDataFormatos(_object){
        this.formatos.formatos.setDataF1004(_object);
        this.formatos.formatos.setDataF1003(_object);
        this.formatos.formatos.setDataF1005(_object);
    }

}

export class DocumentoPredenuncia {
	id:number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}


