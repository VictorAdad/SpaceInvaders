import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { Predenuncia } from '@models/predenuncia';
import { Component, ViewChild,Output,Input,EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SelectsService } from "@services/selects.service";
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GlobalService } from "@services/global.service";
import { TableDataSource } from './../../global.component';


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

    constructor(private route: ActivatedRoute, private http: HttpService){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
            }
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.http.get(this.apiUrl+params['casoId']+'/page').subscribe(response => {
                    if(parseInt(response.totalCount) !== 0){
                        this.hasPredenuncia = true;
                        this.object = response;
                    }
                });
            }

        });
    }


    idUpdate(event: any) {
      this.solicitudId = event.id;
      console.log("Recibiendo id emitido", event.id);
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
        public optionsServ: SelectsService) {
            super();
        }

    ngOnInit(){
        this.route.params.subscribe(params => {
            if (params['casoId'])
              {  this.casoId = +params['casoId'];
                 console.log(this.casoId);
                 this.http.get(this.apiUrl+this.casoId+'/page').subscribe(response => {
                 if(parseInt(response.totalCount) !== 0){
                    this.hasPredenuncia = true;
                    console.log("Dont have predenuncia");
                    this.form.disable();
                    this.model= response.data[0] as Predenuncia;
                    var fechaCompleta:Date= new Date(response.fechaHoraInspeccion);
                    this.model.fechaCanalizacion=fechaCompleta;
                    var horas: string=(String(fechaCompleta.getHours()).length==1)?'0'+fechaCompleta.getHours():String(fechaCompleta.getHours());
                    var minutos: string=(String(fechaCompleta.getMinutes()).length==1)?'0'+fechaCompleta.getMinutes():String(fechaCompleta.getMinutes());;
                    this.model.horaConlcusionLlamada=horas+':'+minutos;

                    console.log("Emitiendo id..",this.model.id)
                    this.idEmitter.emit({id: this.model.id});
                    this.fillForm(this.model);
                }
             });
            }

        });

        this.model = new Predenuncia();
        if (this.isUserX) {
            this.form  = new FormGroup({
            'calidadUsuario'        :  new FormControl(this.model.calidadUsuario),
            'numeroTelefono'        :  new FormControl(this.model.numeroTelefono),
            'tipoLineaTelefonica'   :  new FormControl(this.model.tipoLineaTelefonica),
            'lugarLlamada'          :  new FormControl(this.model.lugarLlamada),
            'hechosNarrados'        :  new FormControl(this.model.hechosNarrados),
            'usuario'               :  new FormControl(this.model.usuario),
            'horaConlcusionLlamada' :  new FormControl(this.model.horaConlcusionLlamada),
            'duracionLlamada'       :  new FormControl(this.model.duracionLlamada),
            'nombreServidorPublico' :  new FormControl(this.model.nombreServidorPublico),
            'observaciones'         :  new FormControl(this.model.observaciones),

          });
        } else {
            this.form  = new FormGroup({
            //Constancia de lectura de Derechos
            'numeroFoli'                    :  new FormControl(this.model.numeroFolio),
            'hablaEspanol'                   :  new FormControl(this.model.hablaEspanol),
            'idioma'                         :  new FormControl(this.model.idioma),
            'nombreInterprete'               :  new FormControl(this.model.nombreInterprete),
            'comprendioDerechos'             :  new FormControl(this.model.comprendioDerechos),
            'copiaDerechos'                  :  new FormControl(this.model.copiaDerechos),
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
            'hechosNarrados'        :  new FormControl(this.model.hechosNarrados),
            'conclusionHechos'          :  new FormControl(this.model.conclusionHechos),
            'canalizacion'          :  new FormControl(this.model.canalizacion),
            'institucionCanalizacion'          :  new FormControl(this.model.institucionCanalizacion),
            'motivoCanalizacion'          :  new FormControl(this.model.motivocanalizacion),
            'fechaCanalizacion'          :  new FormControl(this.model.fechaCanalizacion),
            'horaCanalizacion'          :  new FormControl(this.model.horaCanalizacion),
            'personaCausohecho'          :  new FormControl(this.model.personaCausohecho),
            'domicilioQuienCauso'          :  new FormControl(this.model.domicilioQuienCauso),
            'personaRegistro'          :  new FormControl(this.model.personaRegistro),
             // Oficio Ayuda atencion victima

            'oficio'                         :  new FormControl(this.model.victimaOfendidoQuerellante),
            'nombreAutoridadDirigeOficio'    :  new FormControl(this.model.victimaOfendidoQuerellante),
            'necesidadesCubrir'              :  new FormControl(this.model.victimaOfendidoQuerellante),
            'ubicacionUnidadInmediataVictima':  new FormControl(this.model.victimaOfendidoQuerellante),
            'cargoAutoridadVictima'          :  new FormControl(this.model.victimaOfendidoQuerellante),
            'observaciones'         :  new FormControl(this.model.observaciones),
          });

        }

    }

    public save(valid : any, _model : any){
        return new Promise<any>(
            (resolve, reject) => {
                if(this.onLine.onLine){
                    Object.assign(this.model, _model);
                    this.model.caso.id = this.casoId;
                    console.log(this.model);
                    this.model.tipo="Predenuncia";// temporalmente
                    if(this.model.fechaCanalizacion){
                      var fechaCompleta = new Date (this.model.fechaCanalizacion);
                      if(this.model.horaConlcusionLlamada)
                      { fechaCompleta.setMinutes(parseInt(this.model.horaConlcusionLlamada.split(':')[1]));
                        fechaCompleta.setHours(parseInt(this.model.horaConlcusionLlamada.split(':')[0]));
                      }
                      var mes:number=fechaCompleta.getMonth()+1;
                      this.model.fechaCanalizacion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
                      console.log('lo que envio: '+  this.model.fechaCanalizacion);
                     }



                    this.http.post('/v1/base/predenuncias', this.model).subscribe(
                        (response) => {
                            console.log(response);

                            resolve('Predenuncia creada con éxito');
                            this.router.navigate(['/caso/'+this.casoId+'/detalle' ]);
                         },
                        (error) => {
                            console.error('Error', error);
                            reject(error);
                        }
                    );
                }
            }
        );
    }

    public fillForm(_data) {
        _data.fechaCanalizacion = new Date(_data.fechaCanalizacion);
        this.form.patchValue(_data);
        console.log(_data);
    }

}

@Component({
	selector: 'documento-predenuncia',
    templateUrl:'./documento-predenuncia.component.html',
})

export class DocumentoPredenunciaComponent extends FormatosGlobal {
    displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
    @Input() id:number=null;
    @Input()
    object: any;
    dataSource: TableDataSource | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public data: DocumentoPredenuncia[] = [];
    public subject:BehaviorSubject<DocumentoPredenuncia[]> = new BehaviorSubject<DocumentoPredenuncia[]>([]);
    public source:TableDataSource = new TableDataSource(this.subject);

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService,
      public dialog: MatDialog
      ){
      super(http, confirmationService, globalService, dialog);
  }

    ngOnInit() {
      console.log('-> Object ', this.object);
        if(this.object.data[0].documentos){
            this.dataSource = this.source;
            for (let object of this.object.data[0].documentos) {
                this.data.push(object);
                this.subject.next(this.data);
            }

        }
    }

  public setData(_object){
      console.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }
}

export class DocumentoPredenuncia {
	id:number
	nameEcm: string;
	contentType: string;
	uuidEcm: string;
}


