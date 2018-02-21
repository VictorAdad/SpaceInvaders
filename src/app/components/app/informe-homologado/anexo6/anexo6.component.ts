import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params } from '@angular/router';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo6',
  templateUrl: './anexo6.component.html',
  styleUrls: ['./anexo6.component.css']
})

export class Anexo6Component extends InformeBaseComponent {

  public breadcrumb = [];
  columns = ['victima', 'responsable', 'accion'];
  dataSource: TableService | null;
  form: FormGroup;
  formId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
        const formAn6 = [];
        let jsn;
        let indx = 0;
            if (localStorage.getItem('Table_Anexo6_') != null) {
                console.log('Table_Anexo6_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo6_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo6_'))[i].indx, 10);
                    formAn6.push(JSON.parse(localStorage.getItem('Table_Anexo6_'))[i]);
                }
                localStorage.removeItem('Table_Anexo6_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_Anexo6_' + this.formId) != null) {
                console.log('Table_Anexo1_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId ))[i].indx, 10);
                    formAn6.push(JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo6_' + this.formId);
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo6_ ...');
            jsn = {
                'indx': indx + 1,
                'victima': form.nombrePrimerVictima + ' ' + form.paternoPrimerVictima + ' ' +  form.maternoPrimerVictima,
                'responsable': form.nombreRespondiente + ' ' + form.paternoRespondiente + ' ' + form.maternoRespondiente
            };
            formAn6.push(jsn);
             if (this.formId) {
              localStorage.setItem('Table_Anexo6_' + this.formId, JSON.stringify(formAn6));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
              } else {
              localStorage.setItem('Table_Anexo6_', JSON.stringify(formAn6));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo6_'));
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
            ls = JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId));
            for (let i = 0; i < ls.length; i++) {
            if (ls[i].indx !== id) {
            formPI.push(ls[i]);
            }
           }    
              localStorage.removeItem('Table_Anexo6_' + this.formId);
              localStorage.setItem('Table_Anexo6_' + this.formId, JSON.stringify(formPI));
              const array = JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
            } else {
              console.log('Deleting Row NO ID for Table_Anexo6_ ...');
              ls = JSON.parse(localStorage.getItem('Table_Anexo6_'));
              for (let i = 0; i < ls.length; i++) {
                   if (ls[i].indx !== id) {
                      formPI.push(ls[i]);
            }
          }
               if (formPI.length > 0) {
                console.log('Table_Anexo6_ length > 0');
                localStorage.setItem('Table_Anexo6_', JSON.stringify(formPI));
               } else {
                console.log('Table_Anexo1_ length < 0');
                localStorage.removeItem('Table_Anexo6_');
              }
              const array = JSON.parse(localStorage.getItem('Table_Anexo6_'));
              this.dataSource = new TableService(this.paginator, array);
    }
  }
fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo6_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
  cleanFields() {
    this.form.controls.nombrePrimerVictima.setValue('');
    this.form.controls.paternoPrimerVictima.setValue('');
    this.form.controls.maternoPrimerVictima.setValue('');

    this.form.controls.nombreRespondiente.setValue('');
    this.form.controls.paternoRespondiente.setValue('');
    this.form.controls.maternoRespondiente.setValue('');
 

  }
}
