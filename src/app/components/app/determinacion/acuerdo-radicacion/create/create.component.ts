import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild, Output,Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AcuerdoRadicacion } from '@models/determinacion/acuerdoRadicacion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl:'./create.component.html',
})
export class AcuerdoRadicacionCreateComponent {
  public breadcrumb = [];
  public acuerdoId: number = null;
  public casoId: number = null;
  public model:any=null;

	constructor(private route: ActivatedRoute){}
	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
                this.breadcrumb.push({path:`/caso/${this.casoId}/acuerdo-radicacion`,label:"Acuerdos de Radicación"});
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
	selector: 'acuerdo-radicacion',
    templateUrl:'./acuerdo-radicacion.component.html',
})
export class AcuerdoRadicacionComponent extends DeterminacionGlobal{

    public apiUrl:string="/v1/base/acuerdos";
    public casoId: number = null;
    public id: number = null;
    public personas: any[] = [];
    @Output() modelUpdate=new EventEmitter<any>();
    public form  : FormGroup;
    public model : AcuerdoRadicacion;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB
        ) { super();}


    ngOnInit(){
        this.model = new AcuerdoRadicacion();
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
          'heredarSintesisHechos':  new FormControl("", []),
          'personas': new FormArray([]),


            'observaciones': new FormControl(this.model.observaciones),
            'tipo': new FormControl('Acuerdo Radicación')
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
                this.http.get(this.apiUrl+'/'+this.id).subscribe(response =>{
                    Logger.log(response.data),
                        this.fillForm(response);
                        this.modelUpdate.emit(response);
                        this.personas = response.personas;
                      });
            }
        });
    }

    public save(valid : any, _model : any){
        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        Logger.log('-> AcuerdoRadicacion@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, this.model).subscribe(
                    (response) => {
                        Logger.log(response);
                       this.id=response.id;
                      if(this.casoId!=null){
                        this.router.navigate(['/caso/'+this.casoId+'/acuerdo-radicacion/'+this.id+'/edit' ]);
                      }
                      resolve('Acuerdo de radicación creado con éxito')
                    },
                    (error) => {
                        Logger.error('Error', error);
                        reject(error);
                    }
                );
            }
        );

    }

    public edit(_valid : any, _model : any){
        Logger.log('-> AcuerdoRadicacion@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl+'/'+this.id, _model).subscribe((response) => {
                    Logger.log('-> Registro acutualizado', response);
                    resolve('Acuerdo de radicación actualizado con éxito');
                });
            }
        );
     }

    public fillForm(_data){
        this.form.patchValue(_data);
        this.form.controls.observaciones.disable();
        Logger.log(_data);
    }



}

@Component({
	selector: 'documento-acuerdo-radicacion',
    templateUrl:'./documento-acuerdo-radicacion.component.html',
})

export class DocumentoAcuerdoRadicacionComponent extends FormatosGlobal{


  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoAcuerdoRadicación[] = [];
  public subject:BehaviorSubject<DocumentoAcuerdoRadicación[]> = new BehaviorSubject<DocumentoAcuerdoRadicación[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);
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
              this.urlUpload = '/v1/documentos/acuerdos/save/'+params['casoId'];

      });

      this.formData.append('acuerdo.id', this.id.toString());
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

export class DocumentoAcuerdoRadicación {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
