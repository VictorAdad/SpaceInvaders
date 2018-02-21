import {Component, OnInit, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
  selector: 'anexo11',
  templateUrl: './anexo11.component.html',
  styleUrls: ['./../principal/principal.component.css'],
})

export class Anexo11Component extends InformeBaseComponent implements OnInit {

  public breadcrumb = [];
  public formId: number;
  columns = ['entrevistado', 'entrevistador', 'fechaHora', 'accion'];
  dataSource: TableService | null;

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

    if (localStorage.getItem('Table_Anexo11_') != null) {
      console.log('Table_Anexo11_ temp found...');
      for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo11_')).length; i++) {
        indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo11_'))[i].indx, 10);
        formPR.push(JSON.parse(localStorage.getItem('Table_Anexo11_'))[i]);
      }
      localStorage.removeItem('Table_Anexo11_');
    }
    // Si al editar un form (con formId) se quiere agregar otro row
    if (localStorage.getItem('Table_Anexo11_' + this.formId) != null) {
      console.log('Table_Anexo11_ with id found...');
      for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId)).length; i++) {
        indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId))[i].indx, 10);
        formPR.push(JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId))[i]);
      }
      localStorage.removeItem('Table_Anexo11_' + this.formId);
    }
    // creando el objeto para guardar el row en local
    console.log('Creating local row for Table_Anexo11_ ...');
    jsn = {
      'indx': indx + 1,
      'entrevistado': form.datosEntrevistadoNombres + ' ' + form.datosEntrevistadoPaterno  + ' ' + form.datosEntrevistadoMaterno,
      'entrevistador': form.datosEntrevistadorNombres + ' ' + form.datosEntrevistadorApellidoPaterno + ' ' + form.datosEntrevistadorApellidoMaterno,
      'fechaHora': form.lugarFechaEntrevistaFecha,
      'hora': form.lugarFechaEntrevistaHora
    };
    formPR.push(jsn);
    if (this.formId) {
      localStorage.setItem('Table_Anexo11_' + this.formId, JSON.stringify(formPR));
      // Actualizando la tabla
      const array = JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    } else {
      localStorage.setItem('Table_Anexo11_', JSON.stringify(formPR));
      // Actualizando la tabla
      const array = JSON.parse(localStorage.getItem('Table_Anexo11_'));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
  deleteRow(id: number) {
    console.log('this.formID: ', this.formId);
    console.log('id: ', id);
    const formPI = [];
    let ls;
    if (this.formId != null && this.formId !== undefined) {
      ls = JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId));
      for (let i = 0; i < ls.length; i++) {
        if (ls[i].indx !== id) {
          formPI.push(ls[i]);
        }
      }
      localStorage.removeItem('Table_Anexo11_' + this.formId);
      localStorage.setItem('Table_Anexo11_' + this.formId, JSON.stringify(formPI));
      const array = JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    } else {
      console.log('Deleting Row NO ID for Table_Anexo11_ ...');
      ls = JSON.parse(localStorage.getItem('Table_Anexo11_'));
      for (let i = 0; i < ls.length; i++) {
        if (ls[i].indx !== id) {
          formPI.push(ls[i]);
        }
      }
      if (formPI.length > 0) {
        console.log('Table_Anexo11_ length > 0');
        localStorage.setItem('Table_Anexo11_', JSON.stringify(formPI));
      } else {
        console.log('Table_Anexo11_ length < 0');
        localStorage.removeItem('Table_Anexo11_');
      }
      const array = JSON.parse(localStorage.getItem('Table_Anexo11_'));
      this.dataSource = new TableService(this.paginator, array);
    }
  }

  fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo11_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
}
