import {Component, OnInit, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute, Params } from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'anexo1',
  templateUrl: './anexo1.component.html',
  styleUrls: ['./anexo1.component.css'],
})

export class Anexo1Component extends InformeBaseComponent {

  public breadcrumb = [];
  columns = ['detenido', 'comprendio', 'primer','accion'];
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
        const formAn1 = [];
        let jsn;
        let indx = 0;
            if (localStorage.getItem('Table_Anexo1_') != null) {
                console.log('Table_Anexo1_ temp found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo1_')).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo1_'))[i].indx, 10);
                    formAn1.push(JSON.parse(localStorage.getItem('Table_Anexo1_'))[i]);
                }
                localStorage.removeItem('Table_Anexo1_');
            }
            // Si al editar un form (con formId) se quiere agregar otro row
            if (localStorage.getItem('Table_Anexo1_' + this.formId) != null) {
                console.log('Table_Anexo1_ with id found...');
                for (let i = 0; i < JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId )).length; i++) {
                    indx = parseInt(JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId ))[i].indx, 10);
                    formAn1.push(JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId ))[i]);
                }
                localStorage.removeItem('Table_Anexo1_' + this.formId);
            }
            // creando el objeto para guardar el row en local
            console.log('Creating local row for Table_Anexo1_ ...');
            jsn = {
                'indx': indx + 1,
                'detenido': form.detenido,
                'comprendio': form.comprendioDerechos,
                'primer': form.nombreDetenido + ' ' + form.paternoDetenido + ' ' + form.maternoDetenido
            };
            formAn1.push(jsn);
             if (this.formId) {
              localStorage.setItem('Table_Anexo1_' + this.formId, JSON.stringify(formAn1));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
              } else {
              localStorage.setItem('Table_Anexo1_', JSON.stringify(formAn1));
              // Actualizando la tabla
              const array = JSON.parse(localStorage.getItem('Table_Anexo1_'));
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
            ls = JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId));
            for (let i = 0; i < ls.length; i++) {
            if (ls[i].indx !== id) {
            formPI.push(ls[i]);
            }
           }    
              localStorage.removeItem('Table_Anexo1_' + this.formId);
              localStorage.setItem('Table_Anexo1_' + this.formId, JSON.stringify(formPI));
              const array = JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId));
              this.dataSource = new TableService(this.paginator, array);
            } else {
              console.log('Deleting Row NO ID for Table_Anexo1_ ...');
              ls = JSON.parse(localStorage.getItem('Table_Anexo1_'));
              for (let i = 0; i < ls.length; i++) {
                   if (ls[i].indx !== id) {
                      formPI.push(ls[i]);
            }
          }
               if (formPI.length > 0) {
                console.log('Table_Anexo1_ length > 0');
                localStorage.setItem('Table_Anexo1_', JSON.stringify(formPI));
               } else {
                console.log('Table_Anexo1_ length < 0');
                localStorage.removeItem('Table_Anexo1_');
              }
              const array = JSON.parse(localStorage.getItem('Table_Anexo1_'));
              this.dataSource = new TableService(this.paginator, array);
    }
  }

//clearAFields() {
        //console.log('Clearing A fields...');
       // this.form.controls.apoyo.setValue('');}
  //showTable(){
    //if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)
      //|| navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)
      //|| navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
      //|| navigator.userAgent.match(/Windows Phone/i))
    //{
      //this.divTableM = true;
    //} else {
      //this.divTable = true;
    //}
    fillTable() {
    this.route.params.subscribe((params: Params) => {
      this.formId = params['informeId'];
    });
    if (this.formId != null && this.formId !== undefined) {
      const array = JSON.parse(localStorage.getItem('Table_Anexo1_' + this.formId));
      this.dataSource = new TableService(this.paginator, array);
    }
  }
  cleanFields() {
    this.form.controls.detenido.setValue('');
    this.form.controls.comprendioDerechos.setValue('');
    this.form.controls.cuipDetenido.setValue('');
    this.form.controls.paternoDetenido.setValue('');

    this.form.controls.maternoDetenido.setValue('');
    this.form.controls.nombreDetenido.setValue('');
    this.form.controls.adscripcionDetenido.setValue('');

  }
}
   

  


