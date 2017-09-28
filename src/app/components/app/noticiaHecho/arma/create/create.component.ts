import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/form/select2/select2.component'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Arma } from '@models/arma';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { NoticiaHechoGlobal } from '../../global';
import { _config} from '@app/app.config';

@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})
export class ArmaCreateComponent extends NoticiaHechoGlobal{

    public casoId: number = null;
    public id: number = null;

    clasesArmas:MOption[]=[
        {value:"Arma blanca", label:"Arma blanca"},
        {value:"Arma de fuego", label:"Arma de fuego"},
        {value:"Macana", label:"Macana"},
        {value:"Otra", label:"Otra"}
    ];
    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
    ];
    isArmaFuego  :boolean=false;
    isArmaBlanca :boolean=false;
    public form  : FormGroup;
    public model : Arma;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router
        ) {
        super();
    }

    ngOnInit(){
        this.model = new Arma();
        this.form  = new FormGroup({
            'clase'           : new FormControl(this.model.clase, [Validators.required,]),
            'tipo'            : new FormControl(this.model.tipo),
            'subtipo'         : new FormControl(this.model.subtipo),
            'calibre'         : new FormControl(this.model.calibre),
            'mecanismoAccion' : new FormControl(this.model.mecanismoAccion),
            'serie'           : new FormControl(this.model.serie),
            'notas'           : new FormControl(this.model.notas),
            'matricula'       : new FormControl(this.model.matricula),
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
                this.http.get('/v1/base/armas/'+this.id).subscribe(response =>{
                    this.fillForm(response);
                });
            }
        });
    }

    public save(valid : any, _model : any):void{
        if(this.onLine.onLine){
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            this.model.caso.created = null;
            this.http.post('/v1/base/armas', this.model).subscribe(
                (response) => {
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error);
                }
            );
        }
    }

    public edit(_valid : any, _model : any):void{
        console.log('-> Caso@edit()', _model);
        if(this.onLine.onLine){
            this.http.put('/v1/base/armas/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro acutualizado', response);
            });
        }
    }

    public fillForm(_data){
        this.form.patchValue(_data);
    }



    claseChange(option){
        this.model.clase=option;

        if(option=="Arma de fuego"){
        	console.log(option);
           this.isArmaFuego=true;
        }
        else{
           this.isArmaFuego=false;
        }
        if(option=="Arma blanca"){
            console.log(option);
           this.isArmaBlanca=true;
        }
        else{
           this.isArmaBlanca=false;
        }
    }

    }