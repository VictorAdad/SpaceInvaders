import { Component, OnInit, ViewChild } from '@angular/core';
// import { BasePaginationComponent } from './../../base/pagination/component';
import { TableService } from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '@services/http.service';
import { InformeBaseComponent } from './../../informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';
import { Logger } from '../../../../services/logger.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css'],
})

// tslint:disable-next-line:component-class-suffix
export class PrincipalInformeHomologadoCreate extends InformeBaseComponent implements OnInit {

    public casoId: number = null;
    public breadcrumb = [];
    public lat = 19.4968732;
    public lng: number = -99.7232673;
    public latMarker = 19.4968732;
    public lngMarker: number = -99.7232673;
    public zoom = 10;

    public cProteccion = false;
    public cResguardo = false;
    public cTraslado = false;
    public cInspeccion = false;
    public cAcordonamiento = false;
    public cResguardo2 = false;
    public cMedicoOtraAgencia = false;
    public cMedicoParticular = false;

    public form: FormGroup;

    public formId: number;

    columns = ['cuip', 'nombre', 'institucion', 'entidadMunicipio', 'accion'];
    columns2 = ['riesgoPara', 'tipo', 'accion'];
    columns3 = ['apoyo', 'nEconomico', 'accion'];
    columns4 = ['evento', 'fecha', 'hora'];
    dataSource: TableService | null;
    dataSource2: TableService | null;
    dataSource3: TableService | null;
    dataSource4: TableService | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService
        // private paginador: BasePaginationComponent
    ) {
        super();

    }

    ngOnInit() {
        this.fillAllTables();
    }

    public hasId(): boolean {
        let hasId = false;
        this.route.parent.params.subscribe(params => {
            if (params['id']) {
                hasId = true;
            }
        });

        return hasId;
    }

    /*
    Método para salvar y mostrar en las tablas correspondientes
    @param form: Es el form completo, del que se extraerán los campos necesarios
    @param tabla: Para decirle al método cuál tabla va a guardar
    */
    saveTable(form, tabla: String) {
        Logger.log('@saveTable');
        Logger.log('@this. formID ' + this.formId);
        const formPR = [];
        let jsn;
        let indx = 0;
        if (tabla === 'PR') {
            if (localStorage.getItem('Table_PR') != null) {
                console.log('Table_ PR temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_PR')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_PR'))[i].indx, 10);
                    formPR.push(JSON.parse(localStorage.getItem('Table_PR'))[i]);
                }
                localStorage.removeItem('Table_PR');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_PR' + this.formId) != null) {
                console.log('Table_ PR with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_PR' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_PR' + this.formId ))[i].indx, 10);
                    formPR.push(JSON.parse(localStorage.getItem('Table_PR' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_PR' + this.formId );
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_PR ...');
            jsn = {
                'indx': indx + 1,
                'cuip': form.cuip,
                'nombre': form.primerResponsable,
                'institucion': form.institucion,
                'entidadMunicipio': form.municipio
            };
            formPR.push(jsn);
            if (this.formId) {
                localStorage.setItem('Table_PR' + this.formId, JSON.stringify(formPR));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_PR' + this.formId));
                this.dataSource = new TableService(this.paginator, array);
            } else {
                localStorage.setItem('Table_PR', JSON.stringify(formPR));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_PR'));
                this.dataSource = new TableService(this.paginator, array);
            }
            // Limpiando los campos
            this.clearPRFields();
        }
        if (tabla === 'Riesgos') {
            Logger.log('@Save Riesgos');
            if (localStorage.getItem('Table_R') != null) {
                console.log('Table_R temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_R')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_R'))[i].indx, 10);
                    formPR.push(JSON.parse(localStorage.getItem('Table_R'))[i]);
                }
                localStorage.removeItem('Table_R');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (this.formId != null && this.formId !== undefined) {
                console.log('Table_R with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_R' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_R' + this.formId ))[i].indx, 10);
                    formPR.push(JSON.parse(localStorage.getItem('Table_R' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_R' + this.formId );
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_R ...');
            jsn = {
                'indx': indx + 1,
                'riesgoPara': form.riesgoPara,
                'tipo': form.tipoRiesgo
            };
            formPR.push(jsn);
            indx++;
            Logger.log('pushed Riesgos jsn');
            if (this.formId) {
                localStorage.setItem('Table_R' + this.formId, JSON.stringify(formPR));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_R' + this.formId));
                this.dataSource2 = new TableService(this.paginator, array);
            } else {
                localStorage.setItem('Table_R', JSON.stringify(formPR));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_R'));
                this.dataSource2 = new TableService(this.paginator, array);
            }
            // Limpiando los campos
            this.clearRFields();
        }
        if (tabla === 'Apoyo') {
            Logger.log('@Save Apoyo');
            if (localStorage.getItem('Table_A') != null) {
                console.log('Table_A temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_A')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_A'))[i].indx, 10);
                    formPR.push(JSON.parse(localStorage.getItem('Table_A'))[i]);
                }
                localStorage.removeItem('Table_A');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (this.formId != null && this.formId !== undefined) {
                console.log('Table_ Awith id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_A' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_A' + this.formId ))[i].indx, 10);
                    formPR.push(JSON.parse(localStorage.getItem('Table_A' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_A' + this.formId );
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_A ...');
            jsn = {
                'indx': indx + 1,
                'apoyo': form.apoyo,
                'nEconomico': form.numEconomico
            };
            formPR.push(jsn);
            indx++;
            Logger.log('pushed Apoyo jsn');
            if (this.formId) {
                localStorage.setItem('Table_A' + this.formId, JSON.stringify(formPR));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_A' + this.formId));
                this.dataSource3 = new TableService(this.paginator, array);
            } else {
                localStorage.setItem('Table_A', JSON.stringify(formPR));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_A'));
                this.dataSource3 = new TableService(this.paginator, array);
            }
            // Limpiando los campos
            this.clearAFields();
        }
    }

    deleteRow(id: number, tabla: string) {
        console.log(id);
        console.log('this.formID: ', this.formId);
        const formPI = [];
        let ls;
        if (this.formId != null && this.formId !== undefined) {
            if (tabla === 'PR') {
                console.log('Deleting row with Id for Table_ ...PR');
                ls = JSON.parse(localStorage.getItem('Table_PR' + this.formId));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_PR' + this.formId);
                localStorage.setItem('Table_PR' + this.formId, JSON.stringify(formPI));
                // this.fillPRTable();
                const array = JSON.parse(localStorage.getItem('Table_PR' + this.formId));
                this.dataSource = new TableService(this.paginator, array);
            }
            if (tabla === 'Riesgos') {
                console.log('Deleting row with Id for Table_R ...');
                ls = JSON.parse(localStorage.getItem('Table_R' + this.formId));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_R' + this.formId);
                localStorage.setItem('Table_R' + this.formId, JSON.stringify(formPI));
                // this.fillRTable();
                const array = JSON.parse(localStorage.getItem('Table_R' + this.formId));
                this.dataSource2 = new TableService(this.paginator, array);
            }
            if (tabla === 'Apoyo') {
                console.log('Deleting row with Id for Table_A ...');
                console.log('***Remove Apoyo: ', localStorage.getItem('Table_A' + this.formId));
                ls = JSON.parse(localStorage.getItem('Table_A' + this.formId));
                console.log('ls:: ', ls);
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_A' + this.formId);
                localStorage.setItem('Table_A' + this.formId, JSON.stringify(formPI));
                // this.fillRTable();
                const array = JSON.parse(localStorage.getItem('Table_A' + this.formId));
                this.dataSource3 = new TableService(this.paginator, array);
            }
        } else {
            if (tabla === 'PR') {
                console.log('Deleting Row NO ID for Table_PR ...');
                ls = JSON.parse(localStorage.getItem('Table_PR'));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                if (formPI.length > 0) {
                    console.log('Table_PR length > 0');
                    localStorage.setItem('Table_PR', JSON.stringify(formPI));
                } else {
                    console.log('Table_PR length < 0');
                    localStorage.removeItem('Table_PR');
                }
                // this.fillPRTable();
                const array = JSON.parse(localStorage.getItem('Table_PR'));
                this.dataSource = new TableService(this.paginator, array);
            }
            if (tabla === 'Riesgos') {
                console.log('Deleting Row NO ID for Table_R ...');
                ls = JSON.parse(localStorage.getItem('Table_R'));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_R');
                if (formPI.length > 0) {
                    console.log('Table_R length > 0');
                    localStorage.setItem('Table_R', JSON.stringify(formPI));
                } else {
                    console.log('Table_R length < 0');
                    localStorage.removeItem('Table_R');
                }
                // this.fillRTable();
                const array = JSON.parse(localStorage.getItem('Table_R'));
                this.dataSource2 = new TableService(this.paginator, array);
            }
            if (tabla === 'Apoyo') {
                console.log('Deleting Row NO ID for Table_A ...');
                ls = JSON.parse(localStorage.getItem('Table_A'));
                console.log('apoto table: ', ls);
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                if (formPI.length > 0) {
                    console.log('Table_A length > 0');
                    localStorage.setItem('Table_A', JSON.stringify(formPI));
                } else {
                    console.log('Table_A length < 0');
                    localStorage.removeItem('Table_A');
                }
                // this.fillATable();
                const array = JSON.parse(localStorage.getItem('Table_A'));
                this.dataSource3 = new TableService(this.paginator, array);
            }
        }
    }

    fillPRTable() {
        this.route.params.subscribe((params: Params) => {
            this.formId = params['informeId'];
        });
        if (this.formId != null && this.formId !== undefined) {
            const array = JSON.parse(localStorage.getItem('Table_PR' + this.formId));
            this.dataSource = new TableService(this.paginator, array);
        }
        // this.formId = null;
    }

    fillRTable() {
        this.route.params.subscribe((params: Params) => {
            this.formId = params['informeId'];
        });
        if (this.formId != null && this.formId !== undefined) {
            const array = JSON.parse(localStorage.getItem('Table_R' + this.formId));
            this.dataSource2 = new TableService(this.paginator, array);
        }
        // this.formId = null;
    }

    fillATable() {
        this.route.params.subscribe((params: Params) => {
            this.formId = params['informeId'];
        });
        if (this.formId != null && this.formId !== undefined) {
            const array = JSON.parse(localStorage.getItem('Table_A' + this.formId));
            this.dataSource3 = new TableService(this.paginator, array);
        }
        // this.formId = null;
    }

    fillAllTables() {
        this.fillPRTable();
        this.fillRTable();
        this.fillATable();
    }

    clearPRFields() {
        this.form.controls.cuip.setValue('');
        this.form.controls.primerResponsable.setValue('');
        this.form.controls.institucion.setValue('');
        this.form.controls.municipio.setValue('');
    }
    clearRFields() {
        this.form.controls.riesgoPara.setValue('');
        this.form.controls.tipoRiesgo.setValue('');
        // this.form.controls.especificiqueRiesgo.setValue('');
    }
    clearAFields() {
        console.log('Clearing A fields...');
        this.form.controls.apoyo.setValue('');
        console.log('Cleared apoyo ...');
        this.form.controls.numEconomico.setValue('');
        console.log('Cleared numEconm ...');
    }

    showProteccion(value) {
        (value === 'Sí') ? this.cProteccion = true : this.cProteccion = false;
    }

    showResguardo(value) {
        (value === 'Sí') ? this.cResguardo = true : this.cResguardo = false;
    }

    showTraslado(value) {
        (value === 'Sí') ? this.cTraslado = true : this.cTraslado = false;
    }

    showInspeccion(value) {
        (value === 'Sí') ? this.cInspeccion = true : this.cInspeccion = false;
    }

    showAcordonamiento(value) {
        (value === 'Sí') ? this.cAcordonamiento = true : this.cAcordonamiento = false;
    }

    showResguardo2(value) {
        (value === 'Sí') ? this.cResguardo2 = true : this.cResguardo2 = false;
    }

    showMedicoOtraAgencia(value) {
        (value === 'Sí') ? this.cMedicoOtraAgencia = true : this.cMedicoOtraAgencia = false;
    }

    showMedicoParticular(value) {
        (value === 'Sí') ? this.cMedicoParticular = true : this.cMedicoParticular = false;
    }

    public changeLocation(_e) {
        this.latMarker = _e.coords.lat;
        this.lngMarker = _e.coords.lng;
    }

    // public changePage(_e) {
    //     Logger.log('changePage()', _e);
    //     this.dataSource = null;
    //     this.paginador.pageIndex = _e.pageIndex;
    //     this.paginador.pageSize = _e.pageSize;
    // }
}
