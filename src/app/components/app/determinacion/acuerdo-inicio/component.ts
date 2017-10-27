import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { Component, ViewChild , Output, Input,EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AcuerdoInicio } from '@models/determinacion/acuerdoInicio';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { Observable }  from 'rxjs/Observable';
import { DeterminacionGlobal } from '../global';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../global.component';

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
    console.log(model);
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
    @Output() modelUpdate=new EventEmitter<any>();
    public form: FormGroup;
    public model: AcuerdoInicio;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB
    ) { super(); }


    ngOnInit() {
        this.model = new AcuerdoInicio();

        this.form = new FormGroup({
            'nombrePersonaAcepta': new FormControl(this.model.nombrePersonaAcepta),
            'presentoLlamada': new FormControl(this.model.presentoLlamada),
            'manifesto': new FormControl(this.model.manifesto),
            'sintesisHechos': new FormControl(this.model.sintesisHechos),
            'observaciones': new FormControl(this.model.observaciones),
            'tipo': new FormControl('Acuerdo Inicio'),
        });

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.casoId = +params['casoId'];
                this.apiUrl=this.apiUrl.replace("{id}",String(this.casoId));
                 this.http.get(this.apiUrl).subscribe(response => {
                if(response.totalCount!=0){
				          	this.hasAcuerdoInicio = true;
                    this.form.disable();
                    this.fillForm(response.data[0]);
                    this.modelUpdate.emit(response.data[0]);

			         	}
                if(params['id']){
					      this.id=params['id'];
                this.modelUpdate.emit(response.data[0]);
                this.hasAcuerdoInicio = true;
                    this.form.disable();
                    this.fillForm(response.data[0]);
                }
            });

        });
    }

    public save(valid: any, _model: any) {

        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        console.log('-> AcuerdoInicio@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, this.model).subscribe(

                    (response) => {
        				this.id=response.id;
                        console.log(response);
                        if (this.casoId!=null) {
                            this.router.navigate(['/caso/' + this.casoId + '/acuerdo-inicio/'+this.id+'/view']);
                        }
                        else {
                            this.router.navigate(['/acuerdos-inicio'+this.id+'/view']);
                        }
                        resolve('Acuerdo de inicip creado con éxito');
                    },
                    (error) => {
                        console.error('Error', error);
                        reject(error);
                    }
                );
            }
        );

    }

    public edit(_valid: any, _model: any) {
        console.log('-> AcuerdoInicio@edit()', _model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    resolve('Acuerdo de inicio actualizado con éxito');
                });
            }
        );
    }

    public fillForm(_data) {
        this.form.patchValue(_data);
        console.log(_data);
    }

}

@Component({
    selector: 'documento-acuerdo-inicio',
    templateUrl: './documento.component.html',
})
export class DocumentoAcuerdoInicioComponent extends FormatosGlobal{

  @Input() id:number=null;
  displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoAcuerdoInicio[] = [];
  public subject:BehaviorSubject<DocumentoAcuerdoInicio[]> = new BehaviorSubject<DocumentoAcuerdoInicio[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService
      ){
      super(http, confirmationService, globalService);
  }

  ngOnInit() {
    console.log('-> Object ', this.object);
      if(this.object.documentos){
          this.dataSource = this.source;
          for (let object of this.object.documentos) {
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

export class DocumentoAcuerdoInicio {
    id: number
    nombre: string;
    procedimiento: string;
    fechaCreacion: string;
}
