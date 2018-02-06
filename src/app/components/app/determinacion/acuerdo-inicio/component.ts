import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { FormatosService } from '@services/formatos/formatos.service';
import { Component, ViewChild , Output, Input,EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AcuerdoInicio } from '@models/determinacion/acuerdoInicio';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { AuthenticationService } from '@services/auth/authentication.service';
import { Observable }  from 'rxjs/Observable';
import { DeterminacionGlobal } from '../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../global.component';
import { Options } from './option';
import { Logger } from "@services/logger.service";
import { Yason } from "@services/utils/yason";
import { CasoService } from '@services/caso/caso.service';
import { PersonaNombre } from '@pipes/persona.pipe';


@Component({
    templateUrl: './component.html',
})
export class AcuerdoInicioComponent {
    public casoId: number = null;
    public acuerdoId: number = null;
    public model:any=null;
    public breadcrumb = [];
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']) {
                this.casoId = +params['casoId'];
                this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle de caso" });
            }
        });
    }
    modelUpdate(model: any) {
      this.acuerdoId= model.id;
      this.model=model
    Logger.log(model);
    }

}

@Component({
    selector: 'acuerdo-acuerdo-inicio',
    templateUrl: './acuerdo.component.html',
})
export class AcuerdoAcuerdoInicioComponent extends DeterminacionGlobal {

    public apiUrl: string = "/v1/base/acuerdos";
    public casoId: number = null;
    public hasAcuerdoInicio: boolean = false;
    public id: number = null;
    public personas: any[] = [];
    @Output() modelUpdate=new EventEmitter<any>();
    public form: FormGroup;
    public model: AcuerdoInicio;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public personasHeredadas:any[]=[];
    public options: Options;

    public precarga = true;

    public heredarSintesis = false;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        private auth: AuthenticationService,
        private casoService: CasoService,
        private personaNombre: PersonaNombre

    ) { super();
        this.options = new Options(http, db, onLine);
    }


    ngOnInit() {
        this.model = new AcuerdoInicio();
        this.options.getData();

        this.form = new FormGroup({
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

            'nombrePersonaAcepta': new FormControl(this.model.nombrePersonaAcepta),
            'presentoLlamada': new FormGroup({
                'id': new FormControl(this.model.presentoLlamada)
            }),
            'manifesto': new FormControl(this.model.manifesto),
            'sintesisHechos': new FormControl(this.model.sintesisHechos),
            'observaciones': new FormControl(this.model.observaciones),
            'tipo': new FormControl('Acuerdo Inicio'),
            'caso': new FormGroup({
                'nuc': new FormControl('')
            })
        });

        this.route.params.subscribe(params => {
            if (params['casoId']){
                let tipo = 'Acuerdo Inicio';
                this.casoId = +params['casoId'];
                this.casoService.find(this.casoId).then(
                    caso => {
                        if(!caso.hasRelacionVictimaImputado && !caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                        if (this.onLine.onLine) {
                        this.apiUrl=this.apiUrl.replace("{id}",String(this.casoId));
                         this.http.get(`/v1/base/acuerdos/casos/${this.casoId}/tipos?tipo=${tipo}`).subscribe(response => {
                            if(response.length!=0){
                              this.precarga = false;
                              this.hasAcuerdoInicio = true;
                              this.form.disable();
                              this.fillForm(response[0]);
                              this.personas = response[0].personas;
                              this.modelUpdate.emit(response[0]);
                            }
                            if(params['id']){
                              this.id=params['id'];
                              this.modelUpdate.emit(response[0]);
                              this.hasAcuerdoInicio = true;
                              this.form.disable();
                              this.personas = response[0].personas;
                              this.fillForm(response[0]);
                            }
                        });                  
                      } else {
                        if(params['id']){
                              this.id=params['id'];
                        }
                        if (caso.hasAcuerdoInicio) {
                           this.hasAcuerdoInicio = true;
                           this.fillForm(caso['acuerdoInicio']);  
                           this.form.disable();
                           this.modelUpdate.emit(caso['acuerdoInicio']);
                        }else{
                          this.hasAcuerdoInicio = false;  
                        }
                      }

                    }
                )
                
            }

        });
    }

    public heredarDatos() {
        /*
        • Narración de los hechos (Hecho narrados de Predenuncia))

        */
        this.cleanCamposHeredar();
        this.personasHeredadas.forEach((personaCaso) => {
            // Heradar Nombre del denunciante
            const nombrePersona = this.personaNombre.transform(personaCaso);
            this.form.controls["nombrePersonaAcepta"].setValue( this.form.controls["nombrePersonaAcepta"].value?(nombrePersona?this.form.controls["nombrePersonaAcepta"].value+","+nombrePersona:this.form.controls["nombrePersonaAcepta"].value+",Sin valor"):nombrePersona);
        });

        if (this.heredarSintesis) {
            this.form.controls['sintesisHechos'].setValue(this.casoService.caso.predenuncias.hechosNarrados);
        }
    }

    public heredarSintesisChange(_event) {
        this.heredarSintesis = _event;
    }

    public cleanCamposHeredar() {
        this.form.controls['nombrePersonaAcepta'].setValue('');
        this.form.controls['sintesisHechos'].setValue('');
    }

    public  personasChanged(_personasHeredadas) {
        this.personasHeredadas = _personasHeredadas;
    }

    public save(valid: any, _model: any) {

        _model.personas = this.cleanPersonasRepetidas(_model.personas);
        Object.assign(this.model, _model);
        this.model.caso.id  = this.casoId;
        this.model.caso.nuc = this.generateNUC();
        Logger.log('-> AcuerdoInicio@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
              if (this.onLine.onLine) {
                this.http.post(this.apiUrl, this.model).subscribe(

                    (response) => {
        				this.id=response.id;
                        Logger.log(response);
                        if (this.casoId!=null) {
                            this.casoService.addAcuerdoInicio(response).then(t => {
                                this.router.navigate(['/caso/' + this.casoId + '/acuerdo-inicio/'+this.id+'/view']);
                            });                            
                        }
                        else {
                            this.router.navigate(['/acuerdos-inicio'+this.id+'/view']);
                        }
                        resolve('Acuerdo de inicio creado con éxito');
                    },
                    (error) => {
                        Logger.error('Error', error);
                        reject(error);
                    }
                );
              } else {
                let temId = Date.now();
                _model.caso.id = this.casoId;

                Object.assign(this.model, _model);
                  Logger.logColor('MODEL@SAVE', 'green', _model, this.model);
                  let dato = {
                      url:this.apiUrl,
                      body:this.model,
                      options:[],
                      tipo:"post",
                      pendiente:true,
                      dependeDe:[this.casoId, this.id],
                      temId: temId,
                      username: this.auth.user.username
                  }
                  this.db.add("sincronizar", dato).then(p=>{
                      this.db.get("casos",this.casoId).then(caso=>{
                          if (caso){
                              if(!caso["acuerdoInicio"]){
                                  caso["acuerdoInicio"];
                              }
                              if (_model['personas']){
                                const personas = _model['personas'] as any[];
                                for (let i = 0; i< personas.length; i++){
                                    personas[i]['personaCaso'] = {id: personas[i]['id']};
                                }
                              }
                              this.db.get("catalogos", "presento_llamada").then(    presentoLlamada => {
                                if (Number.isInteger(_model['presentoLlamada']['id']))
                                    Logger.log(presentoLlamada["arreglo"][_model['presentoLlamada']['id']]);
                                _model['presentoLlamada']['nombre'] = presentoLlamada["arreglo"][_model['presentoLlamada']['id'] ];
                                _model["id"]=temId;
                                caso["acuerdoInicio"] = _model;
                                caso['hasAcuerdoInicio'] = true;
                                Logger.log("caso arma", caso["acuerdoInicio"]);
                                this.db.update("casos",caso).then(t=>{
                                    Logger.log("caso arma", t["arma"]);
                                    resolve("Se agregó el acuerdo de inicio de manera local");
                                    this.casoService.actualizaCasoOffline(t);
                                    this.router.navigate(['/caso/' + this.casoId + '/acuerdo-inicio/'+temId+'/view']);
                                });
                              });
                          }
                      });
                  });
              }
            }
        );

    }

    public edit(_valid: any, _model: any) {
        Logger.log('-> AcuerdoInicio@edit()', _model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
                    Logger.log('-> Registro acutualizado', response);
                    resolve('Acuerdo de inicio actualizado con éxito');
                });
            }
        );
    }

    public fillForm(_data) {
        Yason.eliminaNulos(_data);
        this.form.patchValue(_data);
        this.form.controls.presentoLlamada.patchValue(parseInt(_data.presentoLlamada));
    }

    public generateNUC(): string{
        let nuc: string = '';
        const user = this.auth.user;

        nuc = `${user.distrito}/${user.fiscalia}/${user.agencia}/${user.municipioId}/${this.pad(this.casoId, 6)}/${(new Date()).getFullYear().toString().substr(-2)}/${this.pad((new Date()).getMonth()+1, 2)}`

        return nuc;
    }

    private pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

}

@Component({
    selector: 'documento-acuerdo-inicio',
    templateUrl: './documento.component.html',
})
export class DocumentoAcuerdoInicioComponent extends FormatosGlobal{

  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
  @Input()
  object: any;
  public dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoAcuerdoInicio[] = [];
  public subject:BehaviorSubject<DocumentoAcuerdoInicio[]> = new BehaviorSubject<DocumentoAcuerdoInicio[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);
  public formData:FormData = new FormData();
  public urlUpload: string;
  public pageSize:number=10;
  public pageIndex:number=0;
  public isShowAll:boolean=false;
  public pag: number = 0;
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
      ){
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

        this.vista="acuerdoInicio";
    }

  ngOnInit() {
      Logger.log('-> Object ', this.object);
    var obj=this;
    this.route.params.subscribe(params => {
        if (params['casoId']) {
            this.casoId=+params['casoId'];
            this.urlUpload = '/v1/documentos/acuerdos/save/'+params['casoId'];
            this.caso.find(params['casoId']).then(
            response => {
                this.updateDataFormatos(this.caso.caso);
                if(this.onLine.onLine){
                    if(this.object.documentos){
                        this.dataSource = this.source;
                        for (let object of this.object.documentos) {
                            this.data.push(object);
                            this.subject.next(this.data);
                        }
                    }
                }else{
                    this.cargaArchivosOffline(this,"",DocumentoAcuerdoInicio);
                }
            }
            );
        }

      });

      this.formData.append('acuerdo.id', this.id.toString());
  }

    download(row){
        Logger.log(row);
        if (!this.onLine.onLine){
          this.db.get("blobs",row.blob).then(t=>{
            var b=Yason.dataURItoBlob(t["blob"].split(',')[1], row.contentType );
            var a = document.createElement('a');
            a.download = row.nameEcm;
            a.href=window.URL.createObjectURL( b );;
            a.click();
            a.remove();
          });
        }
    }

  public cargaArchivos(_archivos){
    if (this.onLine.onLine){
        let archivos=_archivos.saved
          for (let object of archivos) {
              this.data.push(object);
              this.subject.next(this.data);
          }
      }else{
        this.cargaArchivosOffline(this,"",DocumentoAcuerdoInicio);
    }
  }

  public setData(_object){
      Logger.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }

  public updateDataFormatos(_object){
    this.formatos.formatos.setDataF1007(_object);
    this.formatos.formatos.setDataF1516(_object);
    this.formatos.formatos.setDataF2117(_object);

  }

}

export class DocumentoAcuerdoInicio {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
