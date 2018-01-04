import { Caso } from './../../../../../models/personaCaso';
import { DenunciaQuerella, VictimaQuerellante } from './../../../../../models/solicitud-preliminar/acuerdoGeneral';
import { Component, ViewChild , Output,Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AcuerdoGeneral } from '@models/solicitud-preliminar/acuerdoGeneral';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { FormatosGlobal } from '../../formatos';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService} from '@services/selects.service';
import { Observable } from 'rxjs/Observable';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";


@Component({
    templateUrl: './component.html',
})
export class AcuerdoGeneralCreateComponent {
    public casoId: number = null;
    public solicitudId: number = null;
    public breadcrumb = [];
    tipo:string=null;
    model:any=null;


    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']) {
                this.casoId = +params['casoId'];
                this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })
                this.breadcrumb.push({ path: `/caso/${this.casoId}/acuerdo-general`, label: "Solicitudes de acuerdos generales" })
            }

        });
    }
    modelUpdate(model: any) {
      this.solicitudId= model.id;
      this.tipo = model.tipo;
      this.model=model
    Logger.log(model);
    }
}

@Component({
    selector: 'solicitud-acuerdo-general',
    templateUrl: './solicitud.component.html',
})
export class SolicitudAcuerdoGeneralComponent extends SolicitudPreliminarGlobal {
    public apiUrl = "/v1/base/solicitudes-pre-acuerdos";
    public casoId: number = null;
    public id: number = null;
    @Output() modelUpdate=new EventEmitter<any>();
    public form: FormGroup;
    public model: AcuerdoGeneral;
    public isAcuerdoGral: boolean = false;
    public isAtencion: boolean = false;
    public isJuridico: boolean = false;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        private options: SelectsService
    ) { super(); }


    ngOnInit() {
        this.model = new AcuerdoGeneral();
        this.form = this.createForm();

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.casoId = +params['casoId'];
            if (params['id']) {
                this.id = +params['id'];
                this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                    Logger.log(response)
                    this.fillForm(response);
                    this.isAcuerdoGral = (this.form.controls.tipo.value==='Acuerdo General');
                    this.isJuridico = (this.form.controls.tipo.value==='Asignación de asesor jurídico');
                    this.isAtencion = (this.form.controls.tipo.value==='Ayuda y atención a víctimas');
                    this.model = response as AcuerdoGeneral;
                    this.modelUpdate.emit(response);
                    this.form.disable();
                });
            }
        });
    }

    public createForm(){
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

            'tipo': new FormControl(this.model.tipo),
            'fundamentoLegal': new FormControl(this.model.fundamentoLegal),
            'contenidoAcuerdo': new FormControl(this.model.contenidoAcuerdo),
            'finalidad': new FormControl(this.model.finalidad),
            'apercibimiento': new FormControl(this.model.apercibimiento),
            'plazo': new FormControl(this.model.plazo),
            'senialar': new FormControl(this.model.senialar),
            'observaciones': new FormControl(this.model.observaciones),
            'noOficioAtencion': new FormControl(this.model.noOficioAtencion),
            'autoridadAtencion': new FormControl(this.model.autoridadAtencion),
            'cargoAdscripcionAtencion': new FormControl(this.model.cargoAdscripcionAtencion),
            'necesidades': new FormControl(this.model.necesidades),
            'ubicacionAtencion': new FormControl(this.model.ubicacionAtencion),
            'ubicacionJuridico': new FormControl(this.model.ubicacionJuridico),
            'autoridadJuridico': new FormControl(this.model.autoridadJuridico),
            'cargoAdscripcionJuridico': new FormControl(this.model.cargoAdscripcionJuridico),
            'denunciaQuerella': new FormGroup({
                'id': new FormControl("",[])
            }),
            'victimaQuerellante': new FormGroup({
                'id': new FormControl("",[])
            }),
            'caso': new FormGroup({
                'id': new FormControl("",[])
            })
        });
    }

    public save(valid: any, _model: any) {

        _model.caso.id = this.casoId;
        Logger.log('-> AcuerdoGeneral@save()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, _model).subscribe(
                    (response) => {
                        this.id=response.id;
                        if(this.casoId!=null){
                            this.router.navigate(['/caso/' + this.casoId + '/acuerdo-general/'+this.id+'/edit']);
                            Logger.log('-> registro guardado',response);
                       }else{
                            Logger.log('-> registro guardado',response);
                            this.router.navigate(['/acuerdos'+this.id+'/edit' ]);
                        }
                        resolve('Solicitud de acuerdo general creada con éxito');
                    },
                    (error) => {
                        Logger.error('Error', error);
                        reject(error);
                    }
                );
            }
        );

    }

    public edit(_valid: any, _model: any) {
        Logger.log('-> AcuerdoGeneral@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
                    Logger.log('-> Registro acutualizado', response);
                    if(this.id!=null){
                        this.router.navigate(['/caso/' + this.casoId + '/acuerdo-general']);
                    }
                    resolve('Solicitud de acuerdo general actualizada con éxito');
                });
            }
        );
    }

    public fillForm(model) {
        this.form.patchValue(
        {
          'tipo':model.tipo,
      });
      let timer = Observable.timer(1);
      timer.subscribe(t => {
        this.form.patchValue(
          {
           'fundamentoLegal':model.fundamentoLegal,
           'contenidoAcuerdo':model.contenidoAcuerdo,
           'finalidad':model.finalidad,
           'apercibimiento': model.apercibimiento,
           'plazo': model.plazo,
           'senialar': model.senialar,
           'observaciones': model.observaciones,
           'noOficioAtencion': model.noOficioAtencion,
           'autoridadAtencion': model.autoridadAtencion,
           'cargoAdscripcionAtencion': model.cargoAdscripcionAtencion,
           'necesidades': model.necesidades,
           'ubicacionAtencion': model.ubicacionAtencion,
           'ubicacionJuridico': model.ubicacionJuridico,
           'autoridadJuridico': model.autoridadJuridico,
           'cargoAdscripcionJuridico':model.cargoAdscripcionJuridico,
           'denunciaQuerella': model.denunciaQuerella?model.denunciaQuerella:new DenunciaQuerella(),
           'victimaQuerellante': model.victimaQuerellante?model.victimaQuerellante:new VictimaQuerellante(),
           'caso':model.caso?model.caso:new Caso()
          }
         );

      });

        Logger.log();


    }

    public tipoChange(_tipo): void{
        this.isAcuerdoGral = (_tipo==='Acuerdo General');
        this.isJuridico = (_tipo==='Asignación de asesor jurídico');
        this.isAtencion = (_tipo==='Ayuda y atención a víctimas');
    }

}

@Component({
    selector: 'documento-acuerdo-general',
    templateUrl: './documento.component.html',
})
export class DocumentoAcuerdoGeneralComponent extends FormatosGlobal{

    displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
    @Input() tipo:string=null;
    @Input() id:number=null;
    tipo_options={
      'Acuerdo General':[{'label':'ACUERDO GENERAL','value':'F1_006'},{'label':'ACUERDO GENERAL SIN APERCIBIMIENTO','value':'F1_019'}],
      'Asignación de asesor jurídico':[{'label':'SOLICITUD DE ASESOR JURIDICO','value':'F1_002'}],
      'Ayuda y atención a víctimas':[{'label':'OFICIO PARA AYUDA Y ATENCIÓN A VÍCTIMA','value':'F1_001'}]
    }
    @Input()
    object: any;
    dataSource: TableDataSource | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public data: DocumentoAcuerdoGeneral[] = [];
    public subject:BehaviorSubject<DocumentoAcuerdoGeneral[]> = new BehaviorSubject<DocumentoAcuerdoGeneral[]>([]);
    public source:TableDataSource = new TableDataSource(this.subject);
    public casoId: number = null;
    public formData:FormData = new FormData();
    public urlUpload: string;

    constructor(
        public http: HttpService,
        public confirmationService:ConfirmationService,
        public globalService:GlobalService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        ){
        super(http, confirmationService, globalService, dialog);
    }

    ngOnInit() {
        Logger.log('-> Object ', this.object);
        if(this.object.documentos){
            this.dataSource = this.source;
            for (let object of this.object.documentos) {
                this.data.push(object);
                this.subject.next(this.data);
            }

        }

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.urlUpload = '/v1/documentos/solicitudes-pre-acuerdos/save/'+params['casoId'];
        });

        this.formData.append('solicitudPreAcuerdo.id', this.id.toString());
    }

    public cargaArchivos(_archivos){
      let archivos=_archivos.saved
        for (let object of archivos) {
            this.data.push(object);
            this.subject.next(this.data);
        }
    }

    public setData(_object){
        Logger.log('setData()');
        this.data.push(_object);
        this.subject.next(this.data);
    }
}

export interface DocumentoAcuerdoGeneral {
    id: number
    nameEcm: string;
    procedimiento: string;
    created: Date;
}
