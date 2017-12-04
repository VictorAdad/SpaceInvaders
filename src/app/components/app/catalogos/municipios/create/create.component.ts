import { Catalogos } from './../../catalogos';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { _catalogos } from '../../catalogos';
import { SelectsService} from '@services/selects.service';
import 'rxjs/add/observable/of';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl: 'create.component.html'
})
export class municipioCreateComponent extends Catalogos{
    public catalogo: any;
    public form: FormGroup;
    public tipo: string;
    public id: number = null;
    public url:string='/v1/catalogos/municipio'

    constructor(
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB,
        public options: SelectsService,

        ) {
          super();
    }

    ngOnInit() {
        this.form = new FormGroup({

            'nombre': new FormControl('', [Validators.required]),
            'pais'  : new FormGroup({
                'id' : new FormControl('',[Validators.required]),
            }),
            'estado'  : new FormGroup({
              'id' : new FormControl('',[Validators.required]),
            }),

          /*  'base' : new FormGroup({
                'id' : new FormControl(''),
            }),
            'agencia' : new FormGroup({
                'id' : new FormControl(''),
            }),*/
        })
        this._activeRoute.params.subscribe(
            params => {
                if(params['id']){
                    this.id = params['id']
                    this.http.get(this.url+'/'+this.id).subscribe(response =>{
                       this.fillForm(response);
                        Logger.log(response)
                    });
                }
            }
        );
    }

    public fillForm(_data){
      this.form.patchValue(_data)
      let timer = Observable.timer(1);
      this.form.patchValue({
          'pais': _data.estado.pais
      });
      timer.subscribe(t => {
          this.form.patchValue({
          'estado': _data.estado,
          'nombre': _data.nombre,
          })

      });

  }
    public save(_valid: boolean, _form:any){
      return new Promise<any>((resolve, reject) => {
        if(_valid)
            this.http.post(this.url, _form).subscribe(
                response => {
                    Logger.log('MUNICIPIO SALVADO->',response);
                    resolve("Se actualizó la información del arma");
                    this.router.navigate(['/catalogos/municipios']);
                },
                error => {
                    Logger.error('Error', error);
                }
            );
          });
    }

    public edit(_valid: boolean, _form:any){
      return new Promise<any>((resolve, reject) => {
      if(_valid)
            this.http.put(this.url+'/'+this.id, _form).subscribe(
                response => {
                  resolve("Se actualizó la información del arma");
                    this.router.navigate(['/catalogos/municipios']);
                },
                error => {
                    Logger.error('Error', error);
                }
            );
          });
    }
    changePais(id){
      if(id!=null && typeof id !='undefined'){
            this.options.getEstadoByPais(id);
            Logger.log('FIltrando estados',id);
      }
    }



}
