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
import { Logger } from "@services/logger.service";

@Component({
    templateUrl: 'create.component.html'
})
export class LocalidadCreateComponent extends NoticiaHechoGlobal{
    public catalogo: any;
    public form: FormGroup;
    public tipo: string = 'localidades';
    public url: string = '/v1/catalogos/localidad';
    public id: number = null;
    public totalCount: number = 0;
    public dataSource: TableService;

    @ViewChild(MatPaginator) paginator: MatPaginator;

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
                        this.fillForm(response);
                    });
                }
            }
        );
    }

    public fillForm(_data){
        this.form.patchValue(_data)
        let timer = Observable.timer(1);
        this.form.patchValue({
          'pais': _data.municipio.estado.pais
        });
        timer.subscribe(t => {
            this.form.patchValue({
                'estado': _data.municipio.estado
            })
            let timer2 = Observable.timer(1);
            timer2.subscribe(t2 => {
                this.form.patchValue({
                    'municipio': _data.municipio
                });
            });

        });
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
                        Logger.error('Error', error);
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
                        Logger.error('Error', error);
                        reject('Ocurrió un error al guardar la información');
                    }
                );
            else
                reject('El formulario no pasó la validación');
        });
    }

    public changePais(_event){
        if(_event){
            this.optionsServ.getEstadoByPais(_event);
            this.form.patchValue({
                    'municipio': {id:""}
                });
        }
    }

    public changeEstado(_event){
        if(_event)
            this.optionsServ.getMunicipiosByEstado(_event);
    }

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.totalCount = response.totalCount;
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }
}
