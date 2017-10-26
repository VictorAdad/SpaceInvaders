import { FormatosGlobal } from './../../formatos';
import { Component, ViewChild,EventEmitter,Output,Input} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Inspeccion } from '@models/solicitud-preliminar/inspeccion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';

@Component({
    templateUrl:'./component.html',
})
export class InspeccionCreateComponent {
    public casoId: number = null;
    public breadcrumb = [];
    public solicitudId: number = null;
    public model:any=null;
	constructor(private route: ActivatedRoute){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"})
                this.breadcrumb.push({path:`/caso/${this.casoId}/inspeccion`,label:"Solicitudes de inspección"})
            }
        });
        console.log('casoID', this.casoId);
  	}
    modelUpdate(model: any) {
      this.solicitudId= model.id;
      this.model=model
      console.log(model);
    }
}

@Component({
	selector: 'solicitud-inspeccion',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudInspeccionComponent extends SolicitudPreliminarGlobal {

    public apiUrl:string="/v1/base/solicitudes-pre-inspecciones";
    public casoId: number = null;
    public id: number = null;
	  @Output() modelUpdate = new EventEmitter<any>();
    public form  : FormGroup;
    public model : Inspeccion;
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
        this.model = new Inspeccion();

        this.form  = new FormGroup({
            'fechaHoraInspeccion'  : new FormControl(this.model.fechaHoraInspeccion),
            'adscripcion' : new FormControl(this.model.adscripcion),
            'descripcion' : new FormControl(this.model.descripcion),
            'horaInspeccion': new FormControl('')
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
                console.log('casoId', this.casoId);
            if(params['id']){
                this.id = +params['id'];
                console.log('id', this.id);
                this.http.get(this.apiUrl+'/'+this.id).subscribe(response =>{
                        var fechaCompleta:Date= new Date(response.fechaHoraInspeccion);
                        response.fechaHoraInspeccion=fechaCompleta;
                        var horas: string=(String(fechaCompleta.getHours()).length==1)?'0'+fechaCompleta.getHours():String(fechaCompleta.getHours());
                        var minutos: string=(String(fechaCompleta.getMinutes()).length==1)?'0'+fechaCompleta.getMinutes():String(fechaCompleta.getMinutes());;
                        response.horaInspeccion=horas+':'+minutos;
                        this.modelUpdate.emit(response);
                        this.fillForm(response);
                    });
            }
        });
    }

    public save(valid : any, _model : any){

            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            console.log('-> Inspeccion@save()', this.model);

            var fechaCompleta = new Date (this.model.fechaHoraInspeccion);
            fechaCompleta.setMinutes(parseInt(this.model['horaInspeccion'].split(':')[1]));
            fechaCompleta.setHours(parseInt(this.model['horaInspeccion'].split(':')[0]));
            console.log();
            var mes:number=fechaCompleta.getMonth()+1;
            this.model.fechaHoraInspeccion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
            console.log('lo que envio: '+  this.model.fechaHoraInspeccion);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, this.model).subscribe(

                    (response) => {
                        //console.log(response);
                        //console.log('lo que recibo: '+ new Date(response.fechaHoraInspeccion));
                      if(this.casoId!=null){
    					this.id=response.id;
                        this.router.navigate(['/caso/'+this.casoId+'/inspeccion/'+this.casoId+'/edit' ]);
                      }
                      else {
                        this.router.navigate(['/inspecciones/'+this.casoId+'/edit' ]);
                      }
                      resolve('Solicitud de inspección creada con éxito');
                    },
                    (error) => {
                        console.error('Error', error);
                        reject(error);
                    }
                );
            }
        );

    }

    public edit(_valid : any, _model : any){
        Object.assign(this.model, _model);
        console.log('-> Inspeccion@edit()', this.model);

        var fechaCompleta = new Date (this.model.fechaHoraInspeccion);
        fechaCompleta.setMinutes(this.model['horaInspeccion'].split(':')[1]);
        fechaCompleta.setHours(this.model['horaInspeccion'].split(':')[0]);
        console.log();
        var mes:number=fechaCompleta.getMonth()+1;
        this.model.fechaHoraInspeccion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
        console.log('lo que envio: '+  this.model.fechaHoraInspeccion);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl+'/'+this.id, this.model).subscribe((response) => {
                    console.log('lo que recibo: '+ new Date(response.fechaHoraInspeccion));
                    if(this.id){
                        this.router.navigate(['/caso/'+this.casoId+'/inspeccion']);
                    }
                    resolve('Solicitud de inspección actualizada con éxito');
                });
            }
        );
     }

    public fillForm(_data){
        this.form.patchValue(_data);
        console.log(_data);
    }

}

@Component({
	selector: 'documento-inspeccion',
    templateUrl:'./documento.component.html',
})
export class DocumentoInspeccionComponent extends FormatosGlobal{

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data=[];
  dataSource: TableService | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() id:boolean=false;
  @Input() object: any;

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService
      ){
      super(http,confirmationService);
  }

  ngOnInit() {
    console.log('-> Object ', this.object);
    if(this.object.documentos)
    this.data = this.object.documentos;
    this.dataSource = new TableService(this.paginator, this.data);
}
}

export interface DocumentoInspeccion {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
