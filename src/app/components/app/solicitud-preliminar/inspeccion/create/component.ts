import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild,EventEmitter,Output,Input} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Inspeccion } from '@models/solicitud-preliminar/inspeccion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";
import { CasoService } from '@services/caso/caso.service';
import { Yason } from '@services/utils/yason';

@Component({
    templateUrl:'./component.html',
})
export class InspeccionCreateComponent {
    public casoId: number = null;
    public breadcrumb = [];
    public solicitudId: number = null;
    public model:any=null;

	constructor(
    public casoServ: CasoService,
    private router: Router ,
    private route: ActivatedRoute){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.casoServ.find(this.casoId).then(
                    caso => {
                        if(!this.casoServ.caso.hasRelacionVictimaImputado && !this.casoServ.caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"})
                this.breadcrumb.push({path:`/caso/${this.casoId}/inspeccion`,label:"Solicitudes de inspección"})
            }
        });
        Logger.log('casoID', this.casoId);
  	}
    modelUpdate(model: any) {
      this.solicitudId= model.id;
      this.model=model
      Logger.log(model);
    }
}

@Component({
	selector: 'solicitud-inspeccion',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudInspeccionComponent extends SolicitudPreliminarGlobal {

    public apiUrl:string="/v1/base/solicitudes-pre-inspecciones";
    public casoId: number = null;
    public personas: any[] = [];
    public id: number = null;
	  @Output() modelUpdate = new EventEmitter<any>();
    public form  : FormGroup;
    public model : Inspeccion;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public precarga = true;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB
        ) { super();}


    ngOnInit(){
        this.model = new Inspeccion();

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
            'heredarSintesisHechos':  new FormControl(false, []),
            'personas': new FormArray([]),

            'fechaHoraInspeccion': new FormControl(new Date()),
            'adscripcion' : new FormControl(this.model.adscripcion),
            'descripcion' : new FormControl(this.model.descripcion)
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
                Logger.log('casoId', this.casoId);
            if(params['id']){
                this.id = +params['id'];
                this.precarga = false;
                Logger.log('id', this.id);
                this.http.get(this.apiUrl+'/'+this.id).subscribe(response =>{
                        var fechaCompleta:Date= new Date(response.fechaHoraInspeccion);
                        response.fechaHoraInspeccion=fechaCompleta;
                        var horas: string=(String(fechaCompleta.getHours()).length==1)?'0'+fechaCompleta.getHours():String(fechaCompleta.getHours());
                        var minutos: string=(String(fechaCompleta.getMinutes()).length==1)?'0'+fechaCompleta.getMinutes():String(fechaCompleta.getMinutes());;
                        response.horaInspeccion=horas+':'+minutos;
                        this.modelUpdate.emit(response);
                        this.personas = response.personas;
                        this.fillForm(response);
                        this.form.disable();
                    });
            }
        });
    }

    public save(valid : any, _model : any){
            if(valid){
              Object.assign(this.model, _model);
              this.model.caso.id = this.casoId;
              Logger.log('-> Inspeccion@save()', this.model);

              var fechaCompleta = new Date (this.model.fechaHoraInspeccion);
              if(this.model['horaInspeccion'])
              {fechaCompleta.setMinutes(parseInt(this.model['horaInspeccion'].split(':')[1]));
              fechaCompleta.setHours(parseInt(this.model['horaInspeccion'].split(':')[0]));
               }
              var mes:number=fechaCompleta.getMonth()+1;
              this.model.fechaHoraInspeccion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
              Logger.log('lo que envio: '+  this.model.fechaHoraInspeccion);

          return new Promise<any>(
              (resolve, reject) => {
                  this.http.post(this.apiUrl, this.model).subscribe(

                      (response) => {
                          //Logger.log(response);
                        //Logger.log('lo que recibo: '+ new Date(response.fechaHoraInspeccion));
                        if(this.casoId!=null){
      					this.id=response.id;
                          this.router.navigate(['/caso/'+this.casoId+'/inspeccion/'+this.id+'/edit' ]);
                        }
                        else {
                          this.router.navigate(['/inspecciones/'+this.casoId+'/edit' ]);
                        }
                        resolve('Solicitud de inspección creada con éxito');
                      },
                      (error) => {
                          Logger.error('Error', error);
                          reject(error);
                      }
                  );
              }
          );
        }else{
            console.error('El formulario no pasó la validación D:')
        }
    }

    public edit(_valid : any, _model : any){
        Object.assign(this.model, _model);
        Logger.log('-> Inspeccion@edit()', this.model);

        var fechaCompleta = new Date (this.model.fechaHoraInspeccion);
        fechaCompleta.setMinutes(this.model['horaInspeccion'].split(':')[1]);
        fechaCompleta.setHours(this.model['horaInspeccion'].split(':')[0]);
        Logger.log();
        var mes:number=fechaCompleta.getMonth()+1;
        this.model.fechaHoraInspeccion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
        Logger.log('lo que envio: '+  this.model.fechaHoraInspeccion);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl+'/'+this.id, this.model).subscribe((response) => {
                    Logger.log('lo que recibo: '+ new Date(response.fechaHoraInspeccion));
                    if(this.id){
                        this.router.navigate(['/caso/'+this.casoId+'/inspeccion']);
                    }
                    resolve('Solicitud de inspección actualizada con éxito');
                });
            }
        );
     }

    public fillForm(_data){
        Yason.eliminaNulos(_data);
        this.form.patchValue(_data);
        Logger.log(_data);
    }

}

@Component({
	selector: 'documento-inspeccion',
    templateUrl:'./documento.component.html',
})
export class DocumentoInspeccionComponent extends FormatosGlobal{


  displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
  @Input() tipo:string=null;
  @Input() id:number=null;
  tipo_options= [{'label':'FORMATO DE INSPECCIÓN GENERAL','value':'F1_018'}]
  @Input()
  object: any;
  dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoInspeccion[] = [];
  public subject:BehaviorSubject<DocumentoInspeccion[]> = new BehaviorSubject<DocumentoInspeccion[]>([]);
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
          if (params['casoId']) {
            this.casoId = +params['casoId'];
            this.urlUpload = '/v1/documentos/solicitudes-pre-inspecciones/save/'+params['casoId'];
          }

      });

      this.formData.append('solicitudPreInspeccion.id', this.object.id.toString());
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

export interface DocumentoInspeccion {
	id: number
    nameEcm: string;
    procedimiento: string;
    created: Date;
}
