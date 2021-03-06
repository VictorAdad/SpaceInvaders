import { PersonaDomicilio,PersonaNombre,PersonaOriginario } from '@pipes/persona.pipe';
import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild,Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FacultadNoInvestigar } from '@models/determinacion/facultad-no-investigar';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../../global.component';
import { Logger } from "@services/logger.service";
import { CasoService } from '@services/caso/caso.service';
import { Yason } from '../../../../../services/utils/yason';

@Component({
    templateUrl: './create.component.html',
})
export class FacultadNoInvestigarCreateComponent {
    public casoId: number = null;
    public breadcrumb = [];
    constructor(
      public casoServ: CasoService,
      private router: Router ,
      private route: ActivatedRoute) { }
    public determinacionId: number = null;
    public model:any=null;


    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.casoServ.find(this.casoId).then(
                    caso => {
                        if(!this.casoServ.caso.hasRelacionVictimaImputado && !this.casoServ.caso.hasPredenuncia)
                            this.router.navigate(['/caso/' + this.casoId + '/detalle']);

                    }
                )
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
                this.breadcrumb.push({path:`/caso/${this.casoId}/facultad-no-investigar`,label:"Facultad de no investigar"});
            }

        });
    }
    modelUpdate(model: any) {
      this.determinacionId= model.id;
      this.model=model
    Logger.log(model);
    }
}

@Component({
    selector: 'facultad-no-investigar',
    templateUrl: './facultad-no-investigar.component.html',
})
export class FacultadNoInvestigarComponent extends DeterminacionGlobal {
    public apiUrl = '/v1/base/facultades-no-investigar';
    public casoId: number = null;
    public personas: any[] = [];
    public id: number = null;
    @Output() modelUpdate=new EventEmitter<any>();
    public form: FormGroup;
    public model: FacultadNoInvestigar;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public personasHeredadas:any[]=[];
    public heredar:boolean=false;
    public heredarSintesis:boolean=false;

    public precarga = true;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        private casoService: CasoService,
        private personaDomicilio:PersonaDomicilio,
        private personaNombre:PersonaNombre,
        private personaOriginario:PersonaOriginario

    ) { super(); }

    ngOnInit() {
        this.model = new FacultadNoInvestigar();
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
            'edadDenuncianteHeredar': new FormControl(''),
            'nombreDenuncianteHeredar': new FormControl(''),
            'originarioDenuncianteHeredar': new FormControl(''),
            'domicilioDenuncianteHeredar': new FormControl(''),

            'observaciones': new FormControl(),
            'sintesisHechos': new FormControl(),
            'datosPrueba': new FormControl(),
            'motivosAbstuvoInvestigar': new FormControl(''),
            'medioAlternativoSolucion': new FormControl(''),
            'destinatarioDeterminacion': new FormControl(''),
            'superiorJerarquico': new FormControl(''),
            'nombreDenunciante': new FormControl(''),
            'originarioDenunciante': new FormControl(''),
            'edadDenunciante': new FormControl(''),
            'domicilioDenunciante': new FormControl(''),
            'fraccion': new FormControl(''),
        });

        this.route.params.subscribe(params => {
            if (params['casoId'])
                {this.casoId = +params['casoId'];
                this.casoService.find(this.casoId);
                }

            if (params['id']) {
                this.id = +params['id'];
                this.precarga = false;
                this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                        console.log(response.heredar);
                        this.personas = response.personas;
                        this.fillForm(response);
                        this.modelUpdate.emit(response);
                });
            }
        });
    }

    public heredarFlag(_event){
        this.heredarSintesis = _event;
    }


    public heredarDatos(){
      /*
              • Nombre del denunciante
              • Originario de
              • Edad
              • Domicilio
              • Síntesis de los hechos (Síntesis del caso)

      */
        this.cleanCamposHeredar();
        this.personasHeredadas.forEach((personaCaso)=> {
            // Heradar Nombre del denunciante
            let nombrePersona=this.personaNombre.transform(personaCaso);
            this.form.controls["nombreDenuncianteHeredar"].setValue( this.form.controls["nombreDenuncianteHeredar"].value?(nombrePersona?this.form.controls["nombreDenuncianteHeredar"].value+","+nombrePersona:this.form.controls["nombreDenuncianteHeredar"].value+",Sin valor"):nombrePersona)
            // Heredar edad Denunciante
            let edad=personaCaso.persona.edad
            this.form.controls["edadDenuncianteHeredar"].setValue( this.form.controls["edadDenuncianteHeredar"].value?(edad?this.form.controls["edadDenuncianteHeredar"].value+","+edad:this.form.controls["edadDenuncianteHeredar"].value+",Sin valor"):edad)
            console.log( this.form.controls["edadDenuncianteHeredar"].value);
            this.form.controls["edadDenuncianteHeredar"].updateValueAndValidity();
            let originario=this.personaOriginario.transform(personaCaso);
            // Heredar originario
            this.form.controls["originarioDenuncianteHeredar"].setValue( this.form.controls["originarioDenuncianteHeredar"].value?(originario?this.form.controls["originarioDenuncianteHeredar"].value+","+originario:this.form.controls["originarioDenuncianteHeredar"].value+",Sin valor"):originario)
            // Heredar Domicilio
            let domicilio = this.personaDomicilio.transform(personaCaso,0);
            this.form.controls["domicilioDenuncianteHeredar"].setValue( this.form.controls["domicilioDenuncianteHeredar"].value?(domicilio?this.form.controls["domicilioDenuncianteHeredar"].value+","+domicilio:this.form.controls["domicilioDenuncianteHeredar"].value+",Sin valor"):domicilio)
        });
        // Heredar Síntesis de los hechos (Síntesis del caso)
        if (this.heredarSintesis) {
            this.form.controls['sintesisHechos'].setValue(this.casoService.caso.descripcion);
        }
    }


    public  personasChanged(_personasHeredadas) {
        this.personasHeredadas = _personasHeredadas;
    }

    public heredarChanged(_heredar) {
        this.heredar = _heredar;
    }

    public cleanCamposHeredar() {
        this.form.controls['nombreDenuncianteHeredar'].setValue('');
        this.form.controls['edadDenuncianteHeredar'].setValue('');
        this.form.controls['originarioDenuncianteHeredar'].setValue('');
        this.form.controls['domicilioDenuncianteHeredar'].setValue('');
        this.form.controls['sintesisHechos'].setValue('');
    }


    public save(valid: any, _model: any) {
        if(valid){
          Object.assign(this.model, _model);
          this.model.caso.id = this.casoId;
          Logger.log('->FacultadNoInvestigar@save()', this.model);

          return new Promise<any>(
              (resolve, reject) => {
                  this.http.post(this.apiUrl, this.model).subscribe(
                      (response) => {
                        Logger.log('registro guardado',response);
          				       this.id= response.id;
                          if (this.casoId!=null) {
                              this.router.navigate(['/caso/' + this.casoId + '/facultad-no-investigar/'+this.id+'/edit']);
                          }
                          resolve('Registro creado con éxito');
                      },
                      (error) => {
                          reject(error);
                      }
                  );
              }
          );
        }else{
            console.error('El formulario no pasó la validación D:')
        }

    }

    public edit(_valid: any, _model: any) {
        Logger.log('-> FacultadNoInvestigar@edit()', _model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
                    Logger.log('-> Registro acutualizado', response);
                    if(this.id!=null){
                        this.router.navigate(['/caso/' + this.casoId + '/facultad-no-investigar']);
                    }
                    resolve('Registro actualizado con éxito');
                });
            }
        );
    }

    public fillForm(_data) {
        Yason.eliminaNulos(_data);
        this.heredarChanged(_data.heredar);
        this.form.patchValue(_data);
        const timer = Observable.timer(100);
        Logger.log('-> fillForm()', _data);
        timer.subscribe(t => {
            this.form.controls['nombreDenuncianteHeredar'].setValue(_data.nombreDenuncianteHeredar);
            this.form.controls['edadDenuncianteHeredar'].setValue(_data.edadDenuncianteHeredar);
            this.form.controls['originarioDenuncianteHeredar'].setValue(_data.originarioDenuncianteHeredar);
            this.form.controls['domicilioDenuncianteHeredar'].setValue(_data.domicilioDenuncianteHeredar);
        });

        this.form.disable();
    }

}

@Component({
    selector: 'documento-facultad-no-investigar',
    templateUrl: './documento-facultad-no-investigar.component.html',
})

export class DocumentoFacultadNoInvestigarComponent extends FormatosGlobal{


  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion', 'acciones'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoFacultadNoInvestigar[] = [];
  public subject:BehaviorSubject<DocumentoFacultadNoInvestigar[]> = new BehaviorSubject<DocumentoFacultadNoInvestigar[]>([]);
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
          if (params['casoId']) {
            this.casoId = +params['casoId'];
            this.urlUpload = '/v1/documentos/facultades-no-investigar/save/'+params['casoId'];
          }

      });

      this.formData.append('facultadNoInvestigar.id', this.id.toString());
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

export class DocumentoFacultadNoInvestigar {

	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;

}
