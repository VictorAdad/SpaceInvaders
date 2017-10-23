import { Component, ViewChild , Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AcuerdoGeneral } from '@models/solicitud-preliminar/acuerdoGeneral';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { SolicitudPreliminarGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService} from '@services/selects.service';

@Component({
    templateUrl: './component.html',
})
export class AcuerdoGeneralCreateComponent {
    public casoId: number = null;
    public solicitudId: number = null;
    public breadcrumb = [];


    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']) {
                this.casoId = +params['casoId'];
                this.breadcrumb.push({ path: `/caso/${this.casoId}/detalle`, label: "Detalle del caso" })

            }

        });
    }
  idUpdate(event: any) {
    this.solicitudId = event.id;
	console.log(event.id);
  }
}

@Component({
    selector: 'solicitud-acuerdo-general',
    templateUrl: './solicitud.component.html',
})
export class SolicitudAcuerdoGeneralComponent extends SolicitudPreliminarGlobal {
    public apiUrl = "/v1/base/solicitudes-pre-acuerdos";
    public casoId: number = null;
    public id: number = null;
	@Output() idUpdate = new EventEmitter<any>();
    public form: FormGroup;
    public model: AcuerdoGeneral;
    public isAcuerdoGral: boolean = false;
    public isAtencion: boolean = false;
    public isJuridico: boolean = false;
    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db: CIndexedDB,
        private options: SelectsService
    ) { super(); }


    ngOnInit() {
        this.model = new AcuerdoGeneral();
        this.form = this.createForm();

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.casoId = +params['casoId'];
            if (params['id']) {
                this.id = +params['id'];
				this.idUpdate.emit({id: this.id});
                this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                    this.isAcuerdoGral = (this.form.controls.tipo.value==='Acuerdo General');
                    this.isJuridico = (this.form.controls.tipo.value==='Asignación de asesor jurídico');
                    this.isAtencion = (this.form.controls.tipo.value==='Ayuda y atención a víctimas');
                    this.model = response as AcuerdoGeneral;
                    this.fillForm(response);
                });
            }
        });
    }

    public createForm(){
        return new FormGroup({
            'tipo': new FormControl(this.model.tipo),
            'fundamentoLegal': new FormControl(this.model.fundamentoLegal),
            'contenidoAcuerdo': new FormControl(this.model.contenidoAcuerdo),
            'finalidad': new FormControl(this.model.finalidad),
            'apercibimiento': new FormControl(this.model.apercibimiento),
            'plazo': new FormControl(this.model.plazo),
            'senialarSolicitud': new FormControl(this.model.senialarSolicitud),
            'observaciones': new FormControl(this.model.observaciones),
            'noOficioAtencion': new FormControl(this.model.noOficioAtencion),
            'autoridadAtencion': new FormControl(this.model.autoridadAtencion),
            'cargoAdscripcionAtencion': new FormControl(this.model.cargoAdscripcionAtencion),
            'necesidades': new FormControl(this.model.necesidades),
            'ubicacionAtencion': new FormControl(this.model.ubicacionAtencion),
            'ubicacionJuridico': new FormControl(this.model.ubicacionJuridico),
            'autoridadJuridico': new FormControl(this.model.autoridadJuridico),
            'cargoAdscripcionJuridico': new FormControl(this.model.cargoAdscripcionJuridico),
            'denunciaQuerella': new FormGroup({
                'id': new FormControl("",[])
            }),
            'victimaQuerellante': new FormGroup({
                'id': new FormControl("",[])
            }),
            'caso': new FormGroup({
                'id': new FormControl("",[])
            })
        });
    }

    public save(valid: any, _model: any) {

        _model.caso.id = this.casoId;
        console.log('-> AcuerdoGeneral@save()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.post(this.apiUrl, _model).subscribe(
                    (response) => {
        				this.id=response.id;
                        if(this.casoId!=null){
                            this.router.navigate(['/caso/' + this.casoId + '/acuerdo-general/'+this.id+'/edit']);
        					console.log('-> registro guardado',response);               
        			   }else{
        					console.log('-> registro guardado',response);
                            this.router.navigate(['/acuerdos'+this.id+'/edit' ]);
                        }
                        resolve('Solicitud de acuerdo general creada con éxito');
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
        console.log('-> AcuerdoGeneral@edit()', _model);
        return new Promise<any>(
            (resolve, reject) => {
                this.http.put(this.apiUrl + '/' + this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    if(this.id!=null){
                        this.router.navigate(['/caso/' + this.casoId + '/acuerdo-general']);
                    }
                    resolve('Solicitud de acuerdo general actualizada con éxito');
                });
            }
        );
    }

    public fillForm(_data) {
        this.form.patchValue(_data);
        console.log(_data);
    }

    public tipoChange(_tipo): void{
        this.isAcuerdoGral = (_tipo==='Acuerdo General');
        this.isJuridico = (_tipo==='Asignación de asesor jurídico');
        this.isAtencion = (_tipo==='Ayuda y atención a víctimas');
    }

}

@Component({
    selector: 'documento-acuerdo-general',
    templateUrl: './documento.component.html',
})
export class DocumentoAcuerdoGeneralComponent {

    displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
    data: DocumentoAcuerdoGeneral[] = [
        { id: 1, nombre: 'Entrevista.pdf', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
        { id: 2, nombre: 'Nota.pdf', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
        { id: 3, nombre: 'Fase.png', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
        { id: 4, nombre: 'Entrevista1.pdf', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
        { id: 5, nombre: 'Fase1.png', procedimiento: 'N/A', fechaCreacion: '07/09/2017' },
    ];

    dataSource: TableService | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit() {
        this.dataSource = new TableService(this.paginator, this.data);
    }
}

export interface DocumentoAcuerdoGeneral {
    id: number
    nombre: string;
    procedimiento: string;
    fechaCreacion: string;
}
