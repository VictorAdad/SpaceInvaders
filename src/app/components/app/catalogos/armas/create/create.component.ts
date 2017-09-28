import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    templateUrl: './create.component.html'
})

export class CreateArmaComponent implements OnInit {
    public form: FormGroup;
    public tipo: boolean = false;
    public calibre: boolean = false;
    public mecanismo: boolean = false;
    public isEdit: boolean = false;
    public model1: Calibre;
    public model2: TipoArma;
    public model3: MecanismoAccion;
    private sub: any;
    private nombre: string = '';
    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.nombre = params['nombre'];
        });

        if (this.nombre == '') {
            console.log(this.nombre);
            switch (this.router.url) {
                case '/calibre-arma/create': {
                    this.calibre = true;
                    this.model1 = new Calibre();
                    this.form = new FormGroup({
                        'calibre': new FormControl(this.model1.calibre, [Validators.required])
                    });
                    break;
                }
                case '/tipo-arma/create': {
                    this.tipo = true
                    this.model2 = new TipoArma();
                    this.form = new FormGroup({
                        'nombreArma': new FormControl(this.model2.nombreArma, [Validators.required])
                    });
                    break;
                }
                case '/mecanismo-accion/create': {
                    this.mecanismo = true
                    this.model3 = new MecanismoAccion();
                    this.form = new FormGroup({
                        'mecanismoAccion': new FormControl(this.model3.mecanismoAccion, [Validators.required])
                    });
                    break;
                }
            }
        } else {
            this.isEdit = true;
            console.log(this.route);
            
            this.tipo = true
            this.model2 = new TipoArma();
            this.form = new FormGroup({
                'nombreArma': new FormControl(this.model2.nombreArma, [Validators.required])
            });

        }
    }

    save(valid: any, model: any): void {
        console.log('-> Submit', valid, model);
    }

    return() {
        switch (this.router.url) {
            case '/calibre-arma/create': {
                this.router.navigate(['/calibre-arma']);
                break;
            }
            case '/tipo-arma/create': {
                this.router.navigate(['/tipo-arma']);
                break;
            }
            case '/mecanismo-accion/create': {
                this.router.navigate(['/mecanismo-accion']);
                break;
            }
        }
    }
}

export class TipoArma {
    id: Number;
    nombreArma: string;
}

export class Calibre {
    id: Number;
    calibre: string;
}

export class MecanismoAccion {
    id: Number;
    mecanismoAccion: string;
}