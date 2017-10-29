import { FormatosGlobal } from './../../../solicitud-preliminar/formatos';
import { Component, ViewChild,Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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

@Component({
    templateUrl: './create.component.html',
})
export class FacultadNoInvestigarCreateComponent {
    public casoId: number = null;
    public breadcrumb = [];
    constructor(private route: ActivatedRoute) { }
    public determinacionId: number = null;
    public model:any=null;


    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
                this.breadcrumb.push({path:`/caso/${this.casoId}/facultad-no-investigar`,label:"Facultad de no investigar"});
            }

        });
    }
    modelUpdate(model: any) {
      this.determinacionId= model.id;
      this.model=model
    console.log(model);
    }
}

@Component({
    selector: 'facultad-no-investigar',
    templateUrl: './facultad-no-investigar.component.html',
})
export class FacultadNoInvestigarComponent extends DeterminacionGlobal {
    public apiUrl = '/v1/base/facultades-no-investigar';
    public casoId: number = null;
    public id: number = null;
    @Output() modelUpdate=new EventEmitter<any>();
    public form: FormGroup;
    public model: FacultadNoInvestigar;
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
        this.model = new FacultadNoInvestigar();
        this.form = new FormGroup({
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
        });

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.casoId = +params['casoId'];
            if (params['id']) {
                this.id = +params['id'];
                this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                        console.log('response',response),
                        this.fillForm(response);
                        this.modelUpdate.emit(response);

                });
            }
        });
    }

    public save(valid: any, _model: any) {
        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        console.log('->FacultadNoInvestigar@save()', this.model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, this.model).subscribe(
                    (response) => {
                      console.log('registro guardado',response);
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

    }

    public edit(_valid: any, _model: any) {
        console.log('-> FacultadNoInvestigar@edit()', _model);

        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    if(this.id!=null){
                        this.router.navigate(['/caso/' + this.casoId + '/facultad-no-investigar']);
                    }
                    resolve('Registro actualizado con éxito');
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
    selector: 'documento-facultad-no-investigar',
    templateUrl: './documento-facultad-no-investigar.component.html',
})

export class DocumentoFacultadNoInvestigarComponent extends FormatosGlobal{


  @Input() id:number=null;
  displayedColumns = ['nombre', 'fechaCreacion'];
  @Input()
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoFacultadNoInvestigar[] = [];
  public subject:BehaviorSubject<DocumentoFacultadNoInvestigar[]> = new BehaviorSubject<DocumentoFacultadNoInvestigar[]>([]);
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

export class DocumentoFacultadNoInvestigar {
    id: number
    nombre: string;
    procedimiento: string;
    fechaCreacion: string;
}
