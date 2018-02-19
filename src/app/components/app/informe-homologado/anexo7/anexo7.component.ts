import {Component, OnInit, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo7',
  templateUrl: './anexo7.component.html'
})

export class Anexo7Component extends InformeBaseComponent implements OnInit {

  public breadcrumb = [];
  columns = ['nombre', 'traslado', 'entrega', 'recibe', 'ubicacion', 'accion'];
  dataSource: TableService | null;
  formId: number;
  form: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();
  }

  ngOnInit() {
    this.fillTable();
  }

  saveTable(form) {
    console.log('@saveTable');
    console.log('@this. formID ' + this.formId);
    const formPR = [];
    let jsn;
    let indx = 0;

    if (localStorage.getItem('Table_Anexo7_') != null) {
      console.log('Table_Anexo7_ temp found...');
      for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo7_')).length; i++) {
        indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo7_'))[i].indx, 10);
        formPR.push(JSON.parse(localStorage.getItem('Table_Anexo7_'))[i]);
      }
      localStorage.removeItem('Table_Anexo7_');
    }
    // Si al editar un form (con formId) se quiere agregar otro row
    if (localStorage.getItem('Table_Anexo7_' + this.formId) != null) {
      console.log('Table_Anexo7_ with id found...');
      for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId)).length; i++) {
        indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId))[i].indx, 10);
        formPR.push(JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId))[i]);
      }
      localStorage.removeItem('Table_Anexo7_' + this.formId);
    }
    // creando el objeto para guardar el row en local
    console.log('Creating local row for Table_Anexo7_ ...');
    jsn = {
      'indx': indx + 1,
      'nombre': form.nombresTraslado + ' ' + form.paternoTraslado + ' ' + form.maternoTraslado,
      'traslado': form.trasladoA,
      'entrega': form.nombreEntregaTraslado + ' ' + form.paternoEntregaTraslado + ' ' + form.maternoEntregaTraslado,
      'recibe': form.nombreRecibeTraslado + ' ' + form.paternoRecibeTraslado + ' ' + form.maternoRecibeTraslado,
      'ubicacion': form.municipioAgenciaTraslado + ', ' + form.estadoAgenciaTraslado
    };
    formPR.push(jsn);
    if (this.formId) {
      localStorage.setItem('Table_Anexo7_' + this.formId, JSON.stringify(formPR));
      // Actualizando la tabla
      const array = JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    } else {
      localStorage.setItem('Table_Anexo7_', JSON.stringify(formPR));
      // Actualizando la tabla
      const array = JSON.parse(localStorage.getItem('Table_Anexo7_'));
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
      ls = JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId));
      for (let i = 0; i < ls.length; i++) {
        if (ls[i].indx !== id) {
          formPI.push(ls[i]);
        }
      }
      localStorage.removeItem('Table_Anexo7_' + this.formId);
      localStorage.setItem('Table_Anexo7_' + this.formId, JSON.stringify(formPI));
      const array = JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    } else {
      console.log('Deleting Row NO ID for Table_Anexo7_ ...');
      ls = JSON.parse(localStorage.getItem('Table_Anexo7_'));
      for (let i = 0; i < ls.length; i++) {
        if (ls[i].indx !== id) {
          formPI.push(ls[i]);
        }
      }
      if (formPI.length > 0) {
        console.log('Table_Anexo7_ length > 0');
        localStorage.setItem('Table_Anexo7_', JSON.stringify(formPI));
      } else {
        console.log('Table_Anexo7_ length < 0');
        localStorage.removeItem('Table_Anexo7_');
      }
      const array = JSON.parse(localStorage.getItem('Table_Anexo7_'));
      this.dataSource = new TableService(this.paginator, array);
    }
  }

  fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo7_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }

  cleanFields() {
    this.form.controls.nombresTraslado.setValue('');
    this.form.controls.paternoTraslado.setValue('');
    this.form.controls.maternoTraslado.setValue('');
    this.form.controls.trasladoA.setValue('');

    this.form.controls.nombreEntregaTraslado.setValue('');
    this.form.controls.paternoEntregaTraslado.setValue('');
    this.form.controls.maternoEntregaTraslado.setValue('');

    this.form.controls.nombreRecibeTraslado.setValue('');
    this.form.controls.paternoRecibeTraslado.setValue('');
    this.form.controls.maternoRecibeTraslado.setValue('');

    this.form.controls.municipioAgenciaTraslado.setValue('');
    this.form.controls.estadoAgenciaTraslado.setValue('');
  }

}
