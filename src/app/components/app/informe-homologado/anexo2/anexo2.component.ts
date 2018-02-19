import {Component, OnInit, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Params } from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo2',
  templateUrl: './anexo2.component.html'
})

export class Anexo2Component extends InformeBaseComponent {

  public breadcrumb = [];
  columns = ['detenido', "edad", "direccion", "accion"];
  dataSource: TableService | null;
  form: FormGroup;
  formId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  public lat: number = 19.4968732;
  public lng: number = -99.7232673;
  public latMarker: number = 19.4968732;
  public lngMarker: number = -99.7232673;
  public zoom: number = 10;

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
        const formAn2 = [];
        let jsn;
        let indx = 0;
            if (localStorage.getItem('Table_Anexo2_') != null) {
                console.log('Table_Anexo2_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo2_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo2_'))[i].indx, 10);
                    formAn2.push(JSON.parse(localStorage.getItem('Table_Anexo2_'))[i]);
                }
                localStorage.removeItem('Table_Anexo2_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_Anexo2_' + this.formId) != null) {
                console.log('Table_Anexo2_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId ))[i].indx, 10);
                    formAn2.push(JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo2_' + this.formId);
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo2_ ...');
            jsn = {
                'indx': indx + 1,
                'detenido': form.nombreDetencion + '  ' + form.paternoDetecion + '  ' + form.maternoDetecion,
                'edad': form.edadRefeDetencion,
                'direccion': form.calleDetenido + ' ' + form.numExtDetenido + ' Ext.' + form.numIntDetenido
            };
            formAn2.push(jsn);
             if (this.formId) {
              localStorage.setItem('Table_Anexo2_' + this.formId, JSON.stringify(formAn2));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
              } else {
              localStorage.setItem('Table_Anexo2_', JSON.stringify(formAn2));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo2_'));
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
            ls = JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId));
            for (let i = 0; i < ls.length; i++) {
            if (ls[i].indx !== id) {
            formPI.push(ls[i]);
            }
           }    
              localStorage.removeItem('Table_Anexo2_' + this.formId);
              localStorage.setItem('Table_Anexo2_' + this.formId, JSON.stringify(formPI));
              const array = JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
            } else {
              console.log('Deleting Row NO ID for Table_Anexo2_ ...');
              ls = JSON.parse(localStorage.getItem('Table_Anexo2_'));
              for (let i = 0; i < ls.length; i++) {
                   if (ls[i].indx !== id) {
                      formPI.push(ls[i]);
            }
          }
               if (formPI.length > 0) {
                console.log('Table_Anexo2_ length > 0');
                localStorage.setItem('Table_Anexo2_', JSON.stringify(formPI));
               } else {
                console.log('Table_Anexo2_ length < 0');
                localStorage.removeItem('Table_Anexo2_');
              }
              const array = JSON.parse(localStorage.getItem('Table_Anexo2_'));
              this.dataSource = new TableService(this.paginator, array);
    }
  }

  public changeLocation(_e) {
    this.latMarker = _e.coords.lat;
    this.lngMarker = _e.coords.lng;
  }


  fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo2_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
  cleanFields() {
    this.form.controls.paternoDetecion.setValue('');
    this.form.controls.maternoDetecion.setValue('');
    this.form.controls.nombreDetencion.setValue('');
    this.form.controls.edadRefeDetencion.setValue('');

    this.form.controls.calleDetenido.setValue('');
    this.form.controls.numExtDetenido.setValue('');
    this.form.controls.numIntDetenido.setValue('');

  }

}
