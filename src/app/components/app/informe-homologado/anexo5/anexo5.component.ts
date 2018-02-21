import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params } from '@angular/router';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo5',
  templateUrl: './anexo5.component.html',
  styleUrls: ['./anexo5.component.css'],
})

export class Anexo5Component extends InformeBaseComponent {

    public breadcrumb = [];
    columns = ['detenido', 'descripcion', 'cantidad', 'accion'];
    dataSource: TableService | null;
    form: FormGroup;
    formId: number;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private http: HttpService) 
    {
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
        const formAn5 = [];
        let jsn;
        let indx = 0;
            if (localStorage.getItem('Table_Anexo5_') != null) {
                console.log('Table_Anexo5_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo5_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo5_'))[i].indx, 10);
                    formAn5.push(JSON.parse(localStorage.getItem('Table_Anexo5_'))[i]);
                }
                localStorage.removeItem('Table_Anexo5_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_Anexo5_' + this.formId) != null) {
                console.log('Table_Anexo5_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId ))[i].indx, 10);
                    formAn5.push(JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo5_' + this.formId);
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo5_ ...');
            jsn = {
                'indx': indx + 1,
                'detenido': form.detenidoPertenencia,
                'descripcion': form.objeto,
                'cantidad': form.cantidadObjeto
            };
            formAn5.push(jsn);
             if (this.formId) {
              localStorage.setItem('Table_Anexo5_' + this.formId, JSON.stringify(formAn5));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
              } else {
              localStorage.setItem('Table_Anexo5_', JSON.stringify(formAn5));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo5_'));
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
            ls = JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId));
            for (let i = 0; i < ls.length; i++) {
            if (ls[i].indx !== id) {
            formPI.push(ls[i]);
            }
           }    
              localStorage.removeItem('Table_Anexo5_' + this.formId);
              localStorage.setItem('Table_Anexo5_' + this.formId, JSON.stringify(formPI));
              const array = JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
            } else {
              console.log('Deleting Row NO ID for Table_Anexo5_ ...');
              ls = JSON.parse(localStorage.getItem('Table_Anexo5_'));
              for (let i = 0; i < ls.length; i++) {
                   if (ls[i].indx !== id) {
                      formPI.push(ls[i]);
            }
          }
               if (formPI.length > 0) {
                console.log('Table_Anexo5_ length > 0');
                localStorage.setItem('Table_Anexo5_', JSON.stringify(formPI));
               } else {
                console.log('Table_Anexo5_ length < 0');
                localStorage.removeItem('Table_Anexo5_');
              }
              const array = JSON.parse(localStorage.getItem('Table_Anexo5    _'));
              this.dataSource = new TableService(this.paginator, array);
    }
  }
    fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo5_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
  cleanFields(){
    this.form.controls.detenidoPertenencia.setValue('');
    this.form.controls.objeto.setValue('');
    this.form.controls.cantidadObjeto.setValue('');
  }
}
