import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params } from '@angular/router';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo8',
  templateUrl: './anexo8.component.html'
})

export class Anexo8Component extends InformeBaseComponent implements OnInit{

  public breadcrumb = [];
  columns1 = ['nombre', 'objeto', 'accion'];
  columns2 = ['nombre', 'tipo','objeto', 'accion'];
  dataSource: TableService | null;
  dataSource2: TableService | null;
  form: FormGroup;
  formId: number;

  public divEncontroObjetos = false;
  public divTipoArma = false;
  public divDinero = false;
  public divPersona = false;
  public divCadaver = false;
  public divRestosHumanos = false;
  public divDocumentos = false;
  public divOtro = false;
  public divCaracteristicas = false;
  public divInspeccion = false;
  public divObjeto = false;
  public divArmaObjeto = false;
  public divDineroObjeto = false;
  public divCaracteristicasObjeto = false;
  public divDocumentosObjeto = false;
  public divOtroObjeto = false;
  public divMedioTransporte = false;
  public divTransportesEncontrados = false;
  public divArmasEncontrados = false;
  public divEncontrados = false;
  public divCargadoresEncontrados = false;
  public divCartuchosEncontrados = false;
  public divCasquillosEncontrados = false;
  public divDineroEncontrado = false;
  public divNarcoticosEncontrados = false;
  public divDocumentosEncontrados = false;
  public divPersonasEncontrados = false;
  public divCadaverEncontrado = false;
  public divRestosEncontrados = false;
  public divSustanciaEncontrado = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      private route: ActivatedRoute,
          private http: HttpService) {
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

saveTable(form, tabla: String) {
        console.log('@saveTable');
        console.log('@this. formID ' + this.formId);
        const An8 = [];
        let jsn;
        let indx = 0;
        if (tabla === 'Table_Anexo8.1_') {
            if (localStorage.getItem('Table_Anexo8.1_') != null) {
                console.log('Table_Anexo8.1_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo8.1_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo8.1_'))[i].indx, 10);
                    An8.push(JSON.parse(localStorage.getItem('Table_Anexo8.1_'))[i]);
                }
                localStorage.removeItem('Table_Anexo8.1_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_Anexo8.1_' + this.formId) != null) {
                console.log('Table_Anexo8.1_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId ))[i].indx, 10);
                    An8.push(JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo8.1_' + this.formId );
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo8.1_ ...');
            jsn = {
                'indx': indx + 1,
                'nombre': form.inspeccionesPersonasNombres + ' ' + form.inspeccionesPersonasPaterno + ' ' + form.inspeccionesPersonasMaterno,
                'objeto': form.objetosEncontradosArmasTipo
            };
            
            An8.push(jsn);
            if (this.formId) {
                localStorage.setItem('Table_Anexo8.1_' + this.formId, JSON.stringify(An8));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId));
                this.dataSource = new TableService(this.paginator, array);
            } else {
                localStorage.setItem('Table_Anexo8.1_', JSON.stringify(An8));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.1_'));
                this.dataSource = new TableService(this.paginator, array);
            }
            // Limpiando los campos
            this.clearfillAn81Table();
        }
        if (tabla === 'Table_Anexo8.2_') {
            console.log('@Save Anexo8.1');
            if (localStorage.getItem('Table_Anexo8.2_') != null) {
                console.log('Table_Anexo8.2_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo8.2_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo8.2_'))[i].indx, 10);
                    An8.push(JSON.parse(localStorage.getItem('Table_Anexo8.2_'))[i]);
                }
                localStorage.removeItem('Table_Anexo8.2_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (this.formId != null && this.formId !== undefined) {
                console.log('Table_Anexo8.2_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId ))[i].indx, 10);
                    An8.push(JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo8.2_' + this.formId );
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo8.2_ ...');
            jsn = {
                'indx': indx + 1,
                'nombre': form.inspeccionesMedioTransporteNombres + ' ' +  form.inspeccionesMedioTransportePaterno + ' ' + form.inspeccionesMedioTransporteMaterno,
                'tipo': form.objetosEncontradosMedioTransporteTipo,
                'objeto': form.armasObjetosEncontradosArmaTipo
            };
            
            An8.push(jsn);
            console.log('pushed Table_Anexo8.2_ jsn');
            if (this.formId) {
                localStorage.setItem('Table_Anexo8.2_' + this.formId, JSON.stringify(An8));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId));
                this.dataSource2 = new TableService(this.paginator, array);
            } else {
                localStorage.setItem('Table_Anexo8.2_', JSON.stringify(An8));
                // Actualizando la tabla
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.2_'));
                this.dataSource2 = new TableService(this.paginator, array);
            }
            // Limpiando los campos
            this.clearfillAn82Table();
        }
     }
     deleteRow(id: number, tabla: string) {
        console.log(id);
        console.log('this.formID: ', this.formId);
        const formPI = [];
        let ls;
        if (this.formId != null && this.formId !== undefined) {
            if (tabla === 'Table_Anexo8.1_') {
                console.log('Deleting row with Id for Table_ ...Anexo8.1');
                ls = JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_Anexo8.1_' + this.formId);
                localStorage.setItem('Table_Anexo8.1_' + this.formId, JSON.stringify(formPI));
                // this.fillPRTable();
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId));
                this.dataSource = new TableService(this.paginator, array);
            }
            if (tabla === 'Table_Anexo8.2_') {
                console.log('Deleting row with Id for Table_ ...Anexo8.2');
                ls = JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_Anexo8.2_' + this.formId);
                localStorage.setItem('Table_Anexo8.2_' + this.formId, JSON.stringify(formPI));
                // this.fillRTable();
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId));
                this.dataSource2 = new TableService(this.paginator, array);
            }
        } else {
            if (tabla === 'Table_Anexo8.1_') {
                console.log('Deleting Row NO ID for Table_Anexo8.1_ ...');
                ls = JSON.parse(localStorage.getItem('Table_Anexo8.1_'));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                if (formPI.length > 0) {
                    console.log('Table_Anexo8.1_ length > 0');
                    localStorage.setItem('Table_Anexo8.1_', JSON.stringify(formPI));
                } else {
                    console.log('Table_Anexo8.1_ length < 0');
                    localStorage.removeItem('Table_Anexo8.1_');
                }
                // this.fillPRTable();
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.1_'));
                this.dataSource = new TableService(this.paginator, array);
            }
            if (tabla === 'Table_Anexo8.2_') {
                console.log('Deleting Row NO ID for Table_Anexo8.2_ ...');
                ls = JSON.parse(localStorage.getItem('Table_Anexo8.2_'));
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i].indx !== id) {
                        formPI.push(ls[i]);
                    }
                }
                localStorage.removeItem('Table_Anexo8.2_');
                if (formPI.length > 0) {
                    console.log('Table_Anexo8.2_ length > 0');
                    localStorage.setItem('Table_Anexo8.2_', JSON.stringify(formPI));
                } else {
                    console.log('Table_Anexo8.2_ length < 0');
                    localStorage.removeItem('Table_Anexo8.2_');
                }
                // this.fillRTable();
                const array = JSON.parse(localStorage.getItem('Table_Anexo8.2_'));
                this.dataSource2 = new TableService(this.paginator, array);
            }
        }
    }

     fillAn81Table() {
        this.route.params.subscribe((params: Params) => {
            this.formId = params['informeId'];
        });
        if (this.formId != null && this.formId !== undefined) {
            const array = JSON.parse(localStorage.getItem('Table_Anexo8.1_' + this.formId));
            this.dataSource = new TableService(this.paginator, array);
        }
        // this.formId = null;
    }

    fillAn82Table() {
        this.route.params.subscribe((params: Params) => {
            this.formId = params['informeId'];
        });
        if (this.formId != null && this.formId !== undefined) {
            const array = JSON.parse(localStorage.getItem('Table_Anexo8.2_' + this.formId));
            this.dataSource2 = new TableService(this.paginator, array);
        }
        // this.formId = null;
    }
    
    fillAllTables() {
        this.fillAn81Table();
        this.fillAn82Table();
        
    }
   clearfillAn81Table() {
        this.form.controls.inspeccionesPersonasNombres.setValue('');
        this.form.controls.inspeccionesPersonasPaterno.setValue('');
        this.form.controls.inspeccionesPersonasMaterno.setValue('');
        this.form.controls.objetosEncontradosArmasTipo.setValue('');

    }
    clearfillAn82Table() {
        this.form.controls.inspeccionesMedioTransporteNombres.setValue('');
        this.form.controls.inspeccionesMedioTransportePaterno.setValue('');
        this.form.controls.inspeccionesMedioTransporteMaterno.setValue('');
        this.form.controls.objetosEncontradosMedioTransporteTipo.setValue('');
        this.form.controls.armasObjetosEncontradosArmaTipo.setValue('');
        // this.form.controls.especificiqueRiesgo.setValue('');
    }

  showEncontroObjetos(value) {
    (value == 'true') ? this.divEncontroObjetos = true : this.divEncontroObjetos = false;
  }

  showTipoArma(value) {
    (value == 'true') ? this.divTipoArma = true : this.divTipoArma = false;
  }

  showDinero(value) {
    (value == 'true') ? this.divDinero = true : this.divDinero = false;
  }

  showPersona(value) {
    (value == 'true') ? this.divPersona = true : this.divPersona = false;
  }

  showCadaver(value) {
    (value == 'true') ? this.divCadaver = true : this.divCadaver = false;
  }

  showRestosHumanos(value) {
    (value == 'true') ? this.divRestosHumanos = true : this.divRestosHumanos = false;
  }

  showDocumentos(value) {
    (value == 'true') ? this.divDocumentos = true : this.divDocumentos = false;
  }

  showOtro(value) {
    (value == 'true') ? this.divOtro = true : this.divOtro = false;
  }

  showCaracteristicas(value) {
    (value == 'true') ? this.divCaracteristicas = true : this.divCaracteristicas = false;
  }

  showInspeccion(value) {
    (value == 'true') ? this.divInspeccion = true : this.divInspeccion = false;
  }

  showObjeto(value) {
    (value == 'true') ? this.divObjeto = true : this.divObjeto = false;
  }

  showArmaObjeto(value) {
    (value == 'true') ? this.divArmaObjeto = true : this.divArmaObjeto = false;
  }

  showDineroObjeto(value) {
    (value == 'true') ? this.divDineroObjeto = true : this.divDineroObjeto = false;
  }

  showCaracteristicasObjeto(value) {
    (value == 'true') ? this.divCaracteristicasObjeto = true : this.divCaracteristicasObjeto = false;
  }

  showDocumentosObjeto(value) {
    (value == 'true') ? this.divDocumentosObjeto = true : this.divDocumentosObjeto = false;
  }

  showOtroObjeto(value) {
    (value == 'true') ? this.divOtroObjeto = true : this.divOtroObjeto = false;
  }

  showMedioTransporte(value) {
    (value == 'true') ? this.divMedioTransporte = true : this.divMedioTransporte = false;
  }

  showTransportesEncontrados(value) {
    (value == 'true') ? this.divTransportesEncontrados = true : this.divTransportesEncontrados = false;
  }

  showArmasEncontrados(value) {
    (value == 'true') ? this.divArmasEncontrados = true : this.divArmasEncontrados = false;
  }

  showCargadoresEncontrados(value) {
    (value == 'true') ? this.divCargadoresEncontrados = true : this.divCargadoresEncontrados = false;
  }

  showCartuchosEncontrados(value) {
    (value == 'true') ? this.divCartuchosEncontrados = true : this.divCartuchosEncontrados = false;
  }

  showCasquillosEncontrados(value) {
    (value == 'true') ? this.divCasquillosEncontrados = true : this.divCasquillosEncontrados = false;
  }

  showDineroEncontrado(value) {
    (value == 'true') ? this.divDineroEncontrado = true : this.divDineroEncontrado = false;
  }

  showNarcoticosEncontrados(value) {
    (value == 'true') ? this.divNarcoticosEncontrados = true : this.divNarcoticosEncontrados = false;
  }

  showDocumentosEncontrados(value) {
    (value == 'true') ? this.divDocumentosEncontrados = true : this.divDocumentosEncontrados = false;
  }

  showPersonasEncontrados(value) {
    (value == 'true') ? this.divPersonasEncontrados = true : this.divPersonasEncontrados = false;
  }

  showCadaverEncontrado(value) {
    (value == 'true') ? this.divCadaverEncontrado = true : this.divCadaverEncontrado = false;
  }

  showRestosEncontrados(value) {
    (value == 'true') ? this.divRestosEncontrados = true : this.divRestosEncontrados = false;
  }

  showSustanciaEncontrado(value) {
    (value == 'true') ? this.divSustanciaEncontrado = true : this.divSustanciaEncontrado = false;
  }


}
