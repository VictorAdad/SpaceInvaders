import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Inspeccion } from '@models/solicitud-preliminar/inspeccion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class InspeccionCreateComponent {
    public casoId: number = null;
    public breadcrumb = [];
	constructor(private route: ActivatedRoute){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"})
            }
        });
        console.log('casoID', this.casoId);
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
    public form  : FormGroup;
    public model : Inspeccion;
    dataSource: TableService | null;
    @ViewChild(MdPaginator) paginator: MdPaginator;

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
                        this.fillForm(response);
                    });
            }
        });
    }

    public save(valid : any, _model : any):void{

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
        
            this.http.post(this.apiUrl, this.model).subscribe(

                (response) => {
                    //console.log(response);
                    //console.log('lo que recibo: '+ new Date(response.fechaHoraInspeccion));
                  if(this.casoId!=null){
                    this.router.navigate(['/caso/'+this.casoId+'/inspeccion' ]);      
                  }
                  else {
                    this.router.navigate(['/inspecciones' ]);      
                  }
                },
                (error) => {
                    console.error('Error', error);
                }
            );

    }

    public edit(_valid : any, _model : any):void{
        Object.assign(this.model, _model);
        console.log('-> Inspeccion@edit()', this.model);

        var fechaCompleta = new Date (this.model.fechaHoraInspeccion);
        fechaCompleta.setMinutes(this.model['horaInspeccion'].split(':')[1]);
        fechaCompleta.setHours(this.model['horaInspeccion'].split(':')[0]);
        console.log();
        var mes:number=fechaCompleta.getMonth()+1;
        this.model.fechaHoraInspeccion=fechaCompleta.getFullYear()+'-'+mes+'-'+fechaCompleta.getDate()+' '+fechaCompleta.getHours()+':'+fechaCompleta.getMinutes()+':00.000';
        console.log('lo que envio: '+  this.model.fechaHoraInspeccion);
    
            this.http.put(this.apiUrl+'/'+this.id, this.model).subscribe((response) => {
                console.log('lo que recibo: '+ new Date(response.fechaHoraInspeccion));
                if(this.id){
                    this.router.navigate(['/caso/'+this.casoId+'/inspeccion']);
                }
            });
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
export class DocumentoInspeccionComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoInspeccion[] = [
		{id : 1, nombre: 'Entrevista.pdf',  	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 2, nombre: 'Nota.pdf',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 3, nombre: 'Fase.png',        	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id : 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id : 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


	ngOnInit() {
    	this.dataSource = new TableService(this.paginator, this.data);
  	}
}

export interface DocumentoInspeccion {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
