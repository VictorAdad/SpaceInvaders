import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { _catalogos } from '../../catalogos';
import 'rxjs/add/observable/of';
import { NoticiaHechoGlobal } from '../../../noticiaHecho/global';

@Component({
    templateUrl: 'create.component.html'
})
export class TurnoCatalogosCreateComponent extends NoticiaHechoGlobal{
    public catalogo: any;
    public form: FormGroup;
    public tipo: string;
    public id: number = null;

    constructor(
        private router: Router,
        private _activeRoute: ActivatedRoute,
        private http: HttpService,
        private onLine: OnLineService
        ) {
        super();
    }

    ngOnInit() {
        this.form = new FormGroup({
            'id': new FormControl(null,[]),
            'clave' : new FormControl('',[]),
            'nombre': new FormControl('', [Validators.required]),
        });
        this.tipo = "turno";
        this.catalogo = _catalogos[this.tipo];
        console.log(this);
        this._activeRoute.params.subscribe(
            params => {
                
                if(params['id']){
                    this.id = params['id']
                    this.http.get(this.catalogo.url+'/'+this.id).subscribe(response =>{                      
                        this.form.patchValue(response);
                    });
                }
            }
        );
    }

    public save(_valid: boolean, _form:any){
        return new Promise((resolve,reject)=>{
            if(_valid)
            this.http.post(this.catalogo.url, _form).subscribe(
                response => {
                    this.router.navigate(['/catalogos/'+this.tipo]);
                    resolve("Se creó con éxito el turno");
                },
                error => {
                    reject(error);
                }
            );
        });
        
    }

    public edit(_valid: boolean, _form:any){
        return new Promise((resolve,reject)=>{
            if(_valid)
            this.http.put(this.catalogo.url+'/'+this.id, _form).subscribe(
                response => {
                    this.router.navigate(['/catalogos/'+this.tipo]);
                    resolve("Se editó con éxito el turno");
                },
                error => {
                    reject(error);
                }
            );
        });
        
    }


}
