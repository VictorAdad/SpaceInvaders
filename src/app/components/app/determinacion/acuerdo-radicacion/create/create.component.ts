import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild, Output,Input, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AcuerdoRadicacion } from '@models/determinacion/acuerdoRadicacion';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl:'./create.component.html',
})
export class AcuerdoRadicacionCreateComponent {
    public breadcrumb = [];
    public acuerdoId: number = null;
	public casoId: number = null;
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
  idUpdate(event: any) {
    this.acuerdoId = event.id;
	console.log(event.id);
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
	@Output() idUpdate = new EventEmitter<any>();
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
            'observaciones': new FormControl(this.model.observaciones),
            'tipo': new FormControl('Acuerdo Radicación')
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
				this.idUpdate.emit({id: this.id});
                this.http.get(this.apiUrl+'/'+this.id).subscribe(response =>{
                    console.log(response.data),
                        this.fillForm(response);
                    });
            }
        });
    }

    public save(valid : any, _model : any){
        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        console.log('-> AcuerdoRadicacion@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, this.model).subscribe(
                    (response) => {
                        console.log(response);
                       this.id=response.id;
                      if(this.casoId!=null){
                        this.router.navigate(['/caso/'+this.casoId+'/acuerdo-radicacion/'+this.id+'/edit' ]);
                      }
                      resolve('Acuerdo de radicación creado con éxito')
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
        console.log('-> AcuerdoRadicacion@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl+'/'+this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    resolve('Acuerdo de radicación actualizado con éxito');
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
	selector: 'documento-acuerdo-radicacion',
    templateUrl:'./documento-acuerdo-radicacion.component.html',
})

export class DocumentoAcuerdoRadicacionComponent extends FormatosGlobal{

  @Input() id:number=null;
	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoAcuerdoRadicación[] = [
		{id: 1, nombre: 'Entrevista.pdf',    	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 2, nombre: 'Nota.pdf',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 3, nombre: 'Fase.png',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id: 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

  dataSource: TableService | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      public http: HttpService,
      public confirmation: ConfirmationService
      ){
      super(http, confirmation);
  }

  ngOnInit() {
      this.dataSource = new TableService(this.paginator, this.data);
  }
}

export class DocumentoAcuerdoRadicación {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
