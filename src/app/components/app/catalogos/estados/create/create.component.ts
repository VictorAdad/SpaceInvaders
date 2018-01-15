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
import { SelectsService} from '@services/selects.service';
import 'rxjs/add/observable/of';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl: 'create.component.html'
})
export class estadosCreateComponent extends NoticiaHechoGlobal{
    public catalogo: any;
    public form: FormGroup;
    public tipo: string;
    public id: number = null;
    public url: string = '/v1/catalogos/estado';

    constructor(
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService,
        private db:CIndexedDB,
        public options: SelectsService 
        ) {
        super();
    }

    ngOnInit() {
        this.options.getPaises();

        this.form = new FormGroup({
            'nombre': new FormControl('', [Validators.required]),
            'pais' : new FormGroup({
                'id' : new FormControl (null, [Validators.required]),
            })
        })
        this._activeRoute.params.subscribe(
            params => {
                this.tipo = 'estado';

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
        if(_valid){
            return new Promise( (resolve, reject) => {
                if(_valid)
                    this.http.post(this.url, _form).subscribe(
                        response => {
                            this.router.navigate(['/catalogos/'+this.tipo]);
                            resolve('Registro editado con éxito');
                        },
                        error => {
                            Logger.error('Error', error);
                            reject('Ocurrió un error al guardar la información');
                        }
                    );
                else{
                    reject('El formulario no pasó la validación');
                }
            });  
        }else{
            console.error('El formulario no pasó la validación D:')
        }  
    }

    public edit(_valid: boolean, _form:any){
        return new Promise( (resolve, reject) => {
            if(_valid)
                this.http.post(this.url, _form).subscribe(
                    response => {
                        this.router.navigate(['/catalogos/'+this.tipo]);
                        resolve('Registro editado con éxito');
                    },
                    error => {
                        Logger.error('Error', error);
                        reject('Ocurrió un error al editar la información');
                    }
                );
            else{
                reject('El formulario no pasó la validación');
            }
        });
    }        
}
