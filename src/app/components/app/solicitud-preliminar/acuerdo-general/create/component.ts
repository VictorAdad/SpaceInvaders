import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AcuerdoGeneral } from '@models/acuerdoGeneral';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./component.html',
})
export class AcuerdoGeneralCreateComponent {
	public casoId: number = null;

	constructor(private route: ActivatedRoute){}

	ngOnInit() {
    	this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
  	}

}

@Component({
	selector: 'solicitud-acuerdo-general',
    templateUrl:'./solicitud.component.html',
})
export class SolicitudAcuerdoGeneralComponent extends SolicitudPreliminarGlobal {
   
    public casoId: number = null;
    public id: number = null;
    public form  : FormGroup;
    public model : AcuerdoGeneral;
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
        this.model = new AcuerdoGeneral();

        this.form  = new FormGroup({
            'fundamentoLegal' : new FormControl(this.model.fundamentoLegal),
            'contenidoAcuerdo': new FormControl(this.model.contenidoAcuerdo),
            'finalidad'       : new FormControl(this.model.finalidad),
            'apercibimientos' : new FormControl(this.model.apercibimientos),
            'plazo'           : new FormControl(this.model.plazo),
            'solicita'        : new FormControl(this.model.solicita),
            'observaciones'   : new FormControl(this.model.observaciones),
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
                this.http.get('/v1/base/acuerdosgenerales/'+this.id).subscribe(response =>{
                        this.fillForm(response.data);
                    });
            }
        });
    }

    public save(valid : any, _model : any):void{

            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            this.model.caso.created=null;
            console.log('-> AcuerdoGeneral@save()', this.model);
            this.http.post('/v1/base/acuerdosgenerales', this.model).subscribe(

                (response) => {
                    console.log(response);
                    console.log('here')
                  if(this.casoId){
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);      
                  }
                  else {
                    this.router.navigate(['/acuerdos-generales' ]);      
                  }
                },
                (error) => {
                    console.error('Error', error);
                }
            );

    }

    public edit(_valid : any, _model : any):void{
        console.log('-> AcuerdoGeneral@edit()', _model);
            this.http.put('/v1/base/acuerdosgenerales/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro acutualizado', response);
            });
     }

    public fillForm(_data){
        this.form.patchValue(_data);
        console.log(_data);
    }
	
}

@Component({
	selector: 'documento-acuerdo-general',
    templateUrl:'./documento.component.html',
})
export class DocumentoAcuerdoGeneralComponent {

	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoAcuerdoGeneral[] = [
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

export interface DocumentoAcuerdoGeneral {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
