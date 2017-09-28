import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './create.component.html'
})

export class CreateArmaComponent implements OnInit {
    public form: FormGroup;
    public tipo: boolean = false;
    public calibre: boolean = false;
    public mecanismo: boolean = false;
    public isEdit: boolean = false;
    public isCreate: boolean = false;
    public formValid: boolean = false;
    public model1: Calibre;
    public model2: TipoArma;
    public model3: MecanismoAccion;
    private sub: any;
    private id: Number = null;
    text: string;
    constructor(private router: Router, private route: ActivatedRoute, private url: LocationStrategy) { 
        
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            if(params['id']){
                this.id = +params['id'];
            }
        });
        
        if (this.id == null) {
            this.isCreate = true;
        } else {
            this.isEdit = true;
        }

        this.showHideComponents(this.router.url);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    showHideComponents(url: string) {
        if(url.indexOf('tipo-arma') != -1){
            this.tipo = true
            if(this.isEdit){
                this.text = data1.find(item => item.id == this.id).nombreArma;
            }
            this.model2 = new TipoArma();
            this.form = new FormGroup({
                'nombreArma': new FormControl(this.model2.nombreArma, [Validators.required])
            });
        }else if(url.indexOf('calibre-arma') != -1){
            this.calibre = true;
            if(this.isEdit){
                this.text = data2.find(item => item.id == this.id).calibre;
            }
            this.model1 = new Calibre();
            this.form = new FormGroup({
                'calibre': new FormControl(this.model1.calibre, [Validators.required])
            });
        }else if(url.indexOf('mecanismo-accion') != -1){
            this.mecanismo = true;
            if(this.isEdit){
                this.text = data3.find(item => item.id == this.id).mecanismoAccion;
            }
            this.model3 = new MecanismoAccion();
            this.form = new FormGroup({
                'mecanismoAccion': new FormControl(this.model3.mecanismoAccion, [Validators.required])
            });
        }
    }

    save(valid: any, model: any): void {
        console.log('-> Submit', valid, model);
    }

    return() {
        if(this.router.url.indexOf('tipo-arma') != -1){
            this.router.navigate(['/tipo-arma']);
        }else if(this.router.url.indexOf('calibre-arma') != -1){
            this.router.navigate(['/calibre-arma']);
        }else if(this.router.url.indexOf('mecanismo-accion') != -1){
            this.router.navigate(['/mecanismo-accion']);
        }
    }
}

export class TipoArma {
	id:number
	nombreArma: string;
	modificacion: string;
}

export class Calibre {
	id:number
	calibre: string;
	modificacion: string;
}

export class MecanismoAccion {
	id:number
	mecanismoAccion: string;
	modificacion: string;
}

const data1: TipoArma[] = [
    {id : 1, nombreArma: 'Arma blanca',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, nombreArma: 'Arma de fuego',  modificacion: 'dd/mm/aaa hh:mm'},
];

const data2: Calibre[] = [
    {id : 1, calibre: '.22 corto',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, calibre: '.22 magnum',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 3, calibre: '.223',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 4, calibre: '.25 ó 635mm',  modificacion: 'dd/mm/aaa hh:mm'},
];

const data3: MecanismoAccion[] = [
    {id : 1, mecanismoAccion: 'Automática',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 2, mecanismoAccion: 'De acción simple',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 3, mecanismoAccion: 'De bomba y corredera',  modificacion: 'dd/mm/aaa hh:mm'},
    {id : 4, mecanismoAccion: 'De cerrojo',  modificacion: 'dd/mm/aaa hh:mm'},
];