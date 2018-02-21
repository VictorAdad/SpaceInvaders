import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo3',
  templateUrl: './anexo3.component.html',
  styleUrls: ['./anexo3.component.css']
})

export class Anexo3Component extends InformeBaseComponent {
  
  public breadcrumb = [];
  columns = ['usodelafuerza', "primerresponsable", "nivel", "accion"];
  dataSource: TableService | null;
  form: FormGroup;
  formId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  public divTraslado = false;

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();
  }

  ngOnInit() {
     this.fillTable();
  
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
    saveTable(form) {
        console.log('@saveTable');
        console.log('@this. formID ' + this.formId);
        const formAn3 = [];
        let jsn;
        let indx = 0;
            if (localStorage.getItem('Table_Anexo3_') != null) {
                console.log('Table_Anexo3_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo3_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo3_'))[i].indx, 10);
                    formAn3.push(JSON.parse(localStorage.getItem('Table_Anexo3_'))[i]);
                }
                localStorage.removeItem('Table_Anexo3_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_Anexo3_' + this.formId) != null) {
                console.log('Table_Anexo3_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId ))[i].indx, 10);
                    formAn3.push(JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo3_' + this.formId);
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo3_ ...');
            jsn = {
                'indx': indx + 1,
                'usodelafuerza': form.detenidoFuerza || form.nombreFuerza + ' ' + form.paternoFuerza + ' ' + form.maternoFuerza,
                'primerresponsable': form.primerResponsableFuerza || form.nombrePrimerFuerza + ' ' + form.paternoPrimerFuerza + ' ' + form.maternoPrimerFuerza,
                'nivel': form.nivelUsoFuerza
            };
            formAn3.push(jsn);
             if (this.formId) {
              localStorage.setItem('Table_Anexo3_' + this.formId, JSON.stringify(formAn3));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
              } else {
              localStorage.setItem('Table_Anexo3_', JSON.stringify(formAn3));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo3_'));
              this.dataSource = new TableService(this.paginator, array);
                } 
              this.cleanFields();
              }
     deleteRow(id: number) {
            console.log('this.formID: ', this.formId);
            console.log('id: ', id);
            const formPI = [];
            let ls;
            if (this.formId != null && this.formId !== undefined) {
            ls = JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId));
            for (let i = 0; i < ls.length; i++) {
            if (ls[i].indx !== id) {
            formPI.push(ls[i]);
            }
           }    
              localStorage.removeItem('Table_Anexo3_' + this.formId);
              localStorage.setItem('Table_Anexo3_' + this.formId, JSON.stringify(formPI));
              const array = JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
            } else {
              console.log('Deleting Row NO ID for Table_Anexo3_ ...');
              ls = JSON.parse(localStorage.getItem('Table_Anexo3_'));
              for (let i = 0; i < ls.length; i++) {
                   if (ls[i].indx !== id) {
                      formPI.push(ls[i]);
            }
          }
               if (formPI.length > 0) {
                console.log('Table_Anexo1_ length > 0');
                localStorage.setItem('Table_Anexo3_', JSON.stringify(formPI));
               } else {
                console.log('Table_Anexo1_ length < 0');
                localStorage.removeItem('Table_Anexo3_');
              }
              const array = JSON.parse(localStorage.getItem('Table_Anexo3_'));
              this.dataSource = new TableService(this.paginator, array);
    }
  }
    showTraslado(value) {
    console.log("value" + value);
    (value == 'true') ? this.divTraslado = true : this.divTraslado = false;
    }
    
    fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo3_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
  cleanFields() {
    this.form.controls.detenidoFuerza.setValue('');
    this.form.controls.nombreFuerza.setValue('');
    this.form.controls.paternoFuerza.setValue('');
    this.form.controls.maternoFuerza.setValue('');

    this.form.controls.primerResponsableFuerza.setValue('');
    this.form.controls.nombrePrimerFuerza.setValue('');
    this.form.controls.paternoPrimerFuerza.setValue('');
    this.form.controls.maternoPrimerFuerza.setValue('');
    this.form.controls.nivelUsoFuerza.setValue('');

  }
}
