import {Component} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/form/select2/select2.component'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Arma } from '@models/arma';
@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})

export class ArmaCreateComponent{


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

    constructor(private _fbuilder: FormBuilder) { }
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
    }

    public save(valid : any, model : any):void{
        console.log('DatosGenerales@save()');
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