import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import {Persona} from '@models/persona';
import {Router} from '@angular/router';
import {Caso} from '@models/caso'

@Component({
    templateUrl : './persona-fisica-imputado.component.html',
    styles: ['']
})
export class PersonaFisicaImputadoComponent{

    public form  : FormGroup;
    public casoId: number = null;


    persona:Persona;
    caso:Caso;

    tipoPersona: string="";
    tipoInterviniente: string;
    detenido: boolean = false;
    tabla: CIndexedDB;

    constructor(
        private _fbuilder: FormBuilder,
        private router:Router,
        private _tabla: CIndexedDB,
        private route: ActivatedRoute) {
        this.tabla = _tabla;
    }

    muestraDatos(){
        return true;
    }

    changeDetenido(e){
        this.detenido=e.checked;
        this.persona.detenido=e.checked;
        console.log(this.detenido);
    }

    ngOnInit(){
        this.form  = new FormGroup({
            'tipoPersona'   : new FormControl("", [Validators.required,]),
            'tipoInterviniente': new FormControl("", [Validators.required,]),
            'razonSocial': new FormControl("",[Validators.required,Validators.minLength(4)]),
        });
        this.form.controls.razonSocial.disable();
        this.persona=new Persona();
        this.persona.tipoPersona="";
        this.persona.tipoInterviniente="";
        this.persona.detenido=false;

        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
            if (!isNaN(this.casoId)){
                this.tabla.get("casos",this.casoId).then(
                    casoR=>{
                        this.caso=casoR as Caso;
                    });
            }    
        });
    }

    activaRazonSocial(value){
        if (value=="Moral")
            this.form.controls.razonSocial.enable();
        else
            this.form.controls.razonSocial.disable();
    }

    save(valid : any, model : any):void{
        
        this.tabla.add('personas', this.persona).then(
            p => {
                this.caso.personas.push({id:p["id"]});
                this.tabla.update("casos",this.caso).then(
                    response=>{
                        console.log("Se actualizo registro");

                });
                console.log('-> Persona Guardada',p);
                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);
            });
        console.log('-> Submit', valid, model);
        
    }
}