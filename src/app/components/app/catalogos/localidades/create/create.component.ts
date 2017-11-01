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
import { NoticiaHechoGlobal } from '../../../noticiaHecho/global';
import { _config} from '@app/app.config';
import { _catalogos } from '../../catalogos';
import { SelectsService} from '@services/selects.service';
import 'rxjs/add/observable/of';

@Component({
    templateUrl: 'create.component.html'
})
export class LocalidadCreateComponent extends NoticiaHechoGlobal{
    public catalogo: any;
    public form: FormGroup;
    public tipo: string = 'localidades';
    public url: string = '/v1/catalogos/localidad';
    public id: number = null;

    constructor(
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB,
        public optionsServ: SelectsService,
        ) {
        super();
    }

    ngOnInit() {
        this.form = new FormGroup({
            'nombre': new FormControl('', [Validators.required]),
            'pais': new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),
            'estado': new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),
            'municipio': new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),
        })
        this._activeRoute.params.subscribe(
            params => {
                if(params['id']){
                    this.id = params['id']
                    this.http.get(this.url+'/'+this.id).subscribe(response =>{                      
                        this.form.patchValue(response);
                    });
                }
            }
        );
    }

    public save(_valid: boolean, _form:any){
        return new Promise( (resolve, reject) => {
            if(_valid)
                this.http.post(this.url, _form).subscribe(
                    response => {
                        this.router.navigate(['/catalogos/'+this.tipo]);
                        resolve('Registro creado con éxito');
                    },
                    error => {
                        console.error('Error', error);
                        reject('Ocurrió un error al guardar la información');
                    }
                );
            else
                reject('El formulario no pasó la validación');
        });
    }

    public edit(_valid: boolean, _form:any){
        return new Promise( (resolve, reject) => {
            if(_valid)
                this.http.put(this.url+'/'+this.id, _form).subscribe(
                    response => {
                        this.router.navigate(['/catalogos/'+this.tipo]);
                        resolve('Registro editado con éxito');
                    },
                    error => {
                        console.error('Error', error);
                        reject('Ocurrió un error al guardar la información');
                    }
                );
            else
                reject('El formulario no pasó la validación');
        });
    }

    public changePais(_event){
        if(_event)
            this.optionsServ.getEstadoByPais(_event);
    }

    public changeEstado(_event){
        if(_event)
            this.optionsServ.getMunicipiosByEstado(_event);
    }
}
