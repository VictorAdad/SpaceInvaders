import { CasoService } from '@services/caso/caso.service';
import { FormatosService } from '@services/formatos/formatos.service';
import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SolicitudServicioPolicial } from '@models/solicitud-preliminar/solicitudServicioPolicial';
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
import { Logger } from "@services/logger.service";
import { Yason } from '@services/utils/yason';
import { AuthenticationService } from "@services/auth/authentication.service";

@Component({
    templateUrl: './component.html',
})
export class PoliciaCreateComponent {
    public casoId: number = null;
    public solicitudId: number = null;
    public breadcrumb = [];
    public model:any=null;
    constructor(
        public casoServ: CasoService,
        private router: Router , 
        private route: ActivatedRoute) { }

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
                this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
                this.breadcrumb.push({ path: `/caso/${this.casoId}/policia`, label: "Solicitudes preliminares de Policía de investigación" })
            }
        });
    }
    modelUpdate(model: any) {
        this.solicitudId= model.id;
        this.model=model
        Logger.log(model);
    }
}

@Component({
    selector: 'solicitud-policia',
    templateUrl: './solicitud.component.html',
})
export class SolicitudPoliciaComponent extends SolicitudPreliminarGlobal {
    public apiUrl = "/v1/base/solicitudes-pre-policias";
    public casoId: number = null;
    public id: number = null;
    public personas: any[] = [];
    public masDe3Dias:any;
    @Output() modelUpdate=new EventEmitter<any>();
    public form: FormGroup;
    public model: SolicitudServicioPolicial;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public precarga = true;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        public onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        private auth:AuthenticationService,
        public casoServ: CasoService,
        ) { super(); }

    ngOnInit() {
        this.auth.masDe3DiasSinConexion().then(r=>{
            let x= r as boolean;
            this.masDe3Dias=r;
        });
        this.model = new SolicitudServicioPolicial();

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

            'noOficio': new FormControl(this.model.noOficio),
            'nombreComisario': new FormControl(this.model.nombreComisario),
            'actuacionesSolicitadas': new FormControl(this.model.actuacionesSolicitadas)
        });

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.casoId = +params['casoId'];
            Logger.log('casoId', this.casoId);
            if (params['id']) {
                this.id = +params['id'];
                this.precarga = false;
                Logger.log('id', this.id);

                if(this.onLine.onLine){
                    this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                        Logger.log(response.data),
                        this.fillForm(response);
                        this.modelUpdate.emit(response);
                        this.personas = response.personas;
                        this.form.disable();
                    });
                }else{
                    this.db.get("casos", this.casoId).then(t=>{
                        let sol = t["solicitudPrePolicias"] as any[];
                        for (var i = 0; i < sol.length; ++i) {
                            if ((sol[i])["id"]==this.id){

                                console.log("------> entró al IF" );
                                this.personas = sol[i].personas;
                                this.modelUpdate.emit(sol[i]);
                                this.fillForm(sol[i]);
                                this.form.disable();
                                break;
                            }
                        }
                    });
                }
            }
        });
    }

    public save(valid: any, _model: any) {
        if(valid){
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;

            return new Promise<any>(
                (resolve, reject) => {
                    Logger.log('-> Policia@save()', this.model);
                    if (this.onLine.onLine) {
                        this.http.post(this.apiUrl, this.model).subscribe(
                            (response) => {
                                if(this.casoId!=null){
                                    this.id=response.id;
                                    this.casoServ.actualizaCaso();
                                    this.router.navigate(['/caso/' + this.casoId + '/policia/' + this.id + '/edit']);
                                }
                                resolve('Solicitud de policía creada con éxito');
                            },
                            (error) => {
                                Logger.error('Error', error);
                                reject(error);
                            }
                            );
                    } else {
                        const temId = Date.now();
                        const dato = {
                            url: this.apiUrl,
                            body: this.model,
                            options: [],
                            tipo: 'post',
                            pendiente: true,
                            dependeDe: [this.casoId],
                            temId: temId,
                            username: this.auth.user.username
                        };

                        this.db.add("sincronizar", dato).then(p => {
                            this.db.get("casos", this.casoId).then(caso => {
                                if (caso) {
                                    if (!caso["solicitudPrePolicias"]) {
                                        caso["solicitudPrePolicias"] = [];
                                    }
                                    if (_model['personas']){
                                        const personas = _model['personas'] as any[];
                                        for (let i = 0; i< personas.length; i++){
                                            personas[i]['personaCaso'] = {id: personas[i]['id']};
                                        }
                                    }
                                    this.model["id"] = temId;
                                    this.id = this.model['id'];
                                    caso["solicitudPrePolicias"].push(this.model);
                                    this.db.update("casos",caso).then(t => {
                                        resolve('Solicitud de policía creada con éxito');
                                        this.router.navigate(['/caso/' + this.casoId + '/policia/' + this.id + '/edit']);
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

    public edit(_valid: any, _model: any) {
        Logger.log('-> Policia@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe(
                    (response) => {
                        Logger.log('-> Registro acutualizado', response);
                        if(this.id!=null){
                            this.router.navigate(['/caso/' + this.casoId + '/policia']);
                        }
                        resolve('Solitud de policía actualizada con éxito');
                    },
                    (error) => {
                        Logger.error('Error', error);
                        reject(error);
                    }
                    );
            }
            );
    }

    public fillForm(_data) {
        Yason.eliminaNulos(_data);
        Logger.logColor('<<< DATA >>>','green',_data);
        this.form.patchValue(_data);
        
    }

}

@Component({
    selector: 'documento-policia',
    templateUrl: './documento.component.html',
})
export class DocumentoPoliciaComponent extends FormatosGlobal{

    @Input() id:number=null;
    displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
    @Input()
    object: any;
    dataSource: TableDataSource | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public data: DocumentoPolicia[] = [];
    public subject:BehaviorSubject<DocumentoPolicia[]> = new BehaviorSubject<DocumentoPolicia[]>([]);
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
        this.vista="policia";
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
            this.cargaArchivosOffline(this,"",DocumentoPolicia,{idPolicio:this.object['id']});
        }

        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.urlUpload = '/v1/documentos/solicitudes-pre-policias/save/'+params['casoId'];
            this.caso.find(params['casoId']).then(
                response => {
                    this.updateDataFormatos(this.caso.caso);
                }
            );
            }
        });

        this.caso.casoChange.subscribe(
			caso => {
				this.updateDataFormatos(caso);
			}
		)

        this.formData.append('solicitudPrePolicia.id', this.id.toString());
    }

    public cargaArchivos(_archivos){
        if (this.onLine.onLine){
            let archivos=_archivos.saved
              for (let object of archivos) {
                  this.data.push(object);
                  this.subject.next(this.data);
              }
        }else{
            this.cargaArchivosOffline(this,"",DocumentoPolicia,{idPolicio:this.object['id']});
        }
    }

    public setData(_object){
        
        Logger.log('setData()');
        this.data.push(_object);
        this.subject.next(this.data);
    }
    public updateDataFormatos(_object){
        this.formatos.formatos.setDataF1011(_object,this.id);
    }
}

export class DocumentoPolicia {
    id: number
    nameEcm: string;
    procedimiento: string;
    created: Date;
}
