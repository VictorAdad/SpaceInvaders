import { Component, ViewChild,Output, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacultadNoInvestigar } from '@models/determinacion/facultad-no-investigar';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { DeterminacionGlobal } from '../../global';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl: './create.component.html',
})
export class FacultadNoInvestigarCreateComponent {
    public casoId: number = null;
    public breadcrumb = [];
    constructor(private route: ActivatedRoute) { }
    public determinacionId: number = null;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle de caso"});
            }
                
        });
    }
  idUpdate(event: any) {
    this.determinacionId = event.id;
	console.log(event.id);
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
	@Output() idUpdate = new EventEmitter<any>();
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
            'observaciones': new FormControl(this.model.observaciones),
            'sintesisHechos': new FormControl(this.model.sintesisHechos),
            'datosPrueba': new FormControl(this.model.datosPrueba),
            'motivosAbstuvoInvestigar': new FormControl(this.model.motivosAbstuvoInvestigar),
            'medioAlternativoSolucion': new FormControl(this.model.medioAlternativoSolucion),
            'destinatarioDeterminacion': new FormControl(this.model.destinatarioDeterminacion),
            'superiorJerarquico': new FormControl(this.model.superiorJerarquico)
        });

        this.route.params.subscribe(params => {
            if (params['casoId'])
                this.casoId = +params['casoId'];
            if (params['id']) {
                this.id = +params['id'];
				this.idUpdate.emit({id: this.id});
                this.http.get(this.apiUrl + '/' + this.id).subscribe(response => {
                    console.log(response.data),
                        this.fillForm(response);
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
                        console.log(response);
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

export class DocumentoFacultadNoInvestigarComponent {

    displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
    data: DocumentoFacultadNoInvestigar[] = [
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

export class DocumentoFacultadNoInvestigar {
    id: number
    nombre: string;
    procedimiento: string;
    fechaCreacion: string;
}
