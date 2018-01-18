import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
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

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        private auth: AuthenticationService,
        private casoService:CasoService,
        private personaNombre:PersonaNombre

    ) { super();
      this.options = new Options(http,db,onLine);
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
                        if(!this.casoService.caso.hasRelacionVictimaImputado && !this.casoService.caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )
                this.casoService.find(this.casoId);
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
            }

        });
    }
    public heredarDatos(){
      console.log("Heredar en facultad de no investigar")
      /*
         • Narración de los hechos (Hecho narrados de Predenuncia))

      */
      this.personasHeredadas.forEach((personaCaso)=> {
        // Heradar Nombre del denunciante
        console.log(personaCaso)
        let nombrePersona=this.personaNombre.transform(personaCaso);
        this.form.controls["nombrePersonaAcepta"].setValue( this.form.controls["nombrePersonaAcepta"].value?(nombrePersona?this.form.controls["nombrePersonaAcepta"].value+","+nombrePersona:this.form.controls["nombrePersonaAcepta"].value+",Sin valor"):nombrePersona)
       });
      this.form.controls["sintesisHechos"].setValue(this.casoService.caso.predenuncias.hechosNarrados)
    }
    public  personasChanged(_personasHeredadas){
      this.personasHeredadas=_personasHeredadas;
    }

    public save(valid: any, _model: any) {

        Object.assign(this.model, _model);
        this.model.caso.id  = this.casoId;
        this.model.caso.nuc = this.generateNUC();
        Logger.log('-> AcuerdoInicio@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, this.model).subscribe(

                    (response) => {
        				this.id=response.id;
                        Logger.log(response);
                        if (this.casoId!=null) {
                            this.router.navigate(['/caso/' + this.casoId + '/acuerdo-inicio/'+this.id+'/view']);
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
        let user = this.auth.user;
        nuc=`${user.distrito}/${user.fiscalia}/${user.agencia}/${user.municipio}/${this.pad(this.casoId, 6)}/${(new Date()).getFullYear().toString().substr(-2)}/${this.pad((new Date()).getMonth(), 2)}`

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
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoAcuerdoInicio[] = [];
  public subject:BehaviorSubject<DocumentoAcuerdoInicio[]> = new BehaviorSubject<DocumentoAcuerdoInicio[]>([]);
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

export class DocumentoAcuerdoInicio {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
