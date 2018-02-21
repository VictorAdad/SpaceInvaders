import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo9',
  templateUrl: './anexo9.component.html',
  styleUrls: ['./../principal/principal.component.css'],
  
})

export class Anexo9Component extends InformeBaseComponent implements OnInit {

  columns = ['tipo', "cantidad", "especificacion", "accion"];
  dataSource: TableService | null;
  formId: number;
  public form: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public breadcrumb = [];

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

    if (localStorage.getItem('Table_Anexo9_') != null) {
      console.log('Table_Anexo9_ temp found...');
      for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo9_')).length; i++) {
        indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo9_'))[i].indx, 10);
        formPR.push(JSON.parse(localStorage.getItem('Table_Anexo9_'))[i]);
      }
      localStorage.removeItem('Table_Anexo9_');
    }
    // Si al editar un form (con formId) se quiere agregar otro row
    if (localStorage.getItem('Table_Anexo9_' + this.formId) != null) {
      console.log('Table_Anexo9_ with id found...');
      for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId)).length; i++) {
        indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId))[i].indx, 10);
        formPR.push(JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId))[i]);
      }
      localStorage.removeItem('Table_Anexo9_' + this.formId);
    }
    // creando el objeto para guardar el row en local
    console.log('Creating local row for Table_Anexo9_ ...');
    jsn = {
      'indx': indx + 1,
      'tipo': form.inventarioTipoObjeto,
      'cantidad': form.inventarioCantidad,
      'especificacion': form.inventarioEspecificacion
    };
    formPR.push(jsn);
    if (this.formId) {
      localStorage.setItem('Table_Anexo9_' + this.formId, JSON.stringify(formPR));
      // Actualizando la tabla
      const array = JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    } else {
      localStorage.setItem('Table_Anexo9_', JSON.stringify(formPR));
      // Actualizando la tabla
      const array = JSON.parse(localStorage.getItem('Table_Anexo9_'));
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
      ls = JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId));
      for (let i = 0; i < ls.length; i++) {
        if (ls[i].indx !== id) {
          formPI.push(ls[i]);
        }
      }
      localStorage.removeItem('Table_Anexo9_' + this.formId);
      localStorage.setItem('Table_Anexo9_' + this.formId, JSON.stringify(formPI));
      const array = JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    } else {
      console.log('Deleting Row NO ID for Table_Anexo9_ ...');
      ls = JSON.parse(localStorage.getItem('Table_Anexo9_'));
      for (let i = 0; i < ls.length; i++) {
        if (ls[i].indx !== id) {
          formPI.push(ls[i]);
        }
      }
      if (formPI.length > 0) {
        console.log('Table_Anexo9_ length > 0');
        localStorage.setItem('Table_Anexo9_', JSON.stringify(formPI));
      } else {
        console.log('Table_Anexo9_ length < 0');
        localStorage.removeItem('Table_Anexo9_');
      }
      const array = JSON.parse(localStorage.getItem('Table_Anexo9_'));
      this.dataSource = new TableService(this.paginator, array);
    }
  }

  fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo9_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }

  cleanFields() {
    this.form.controls.inventarioTipoObjeto.setValue('');
    this.form.controls.inventarioCantidad.setValue('');
    this.form.controls.inventarioEspecificacion.setValue('');
  }
}
