import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { Persona} from '@models/persona';
import { Router} from '@angular/router';
import { Caso} from '@models/caso'
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { SelectsService} from '@services/selects.service';
import { NoticiaHechoGlobal } from '../../global';

@Component({
    templateUrl : './persona-fisica-imputado.component.html',
    styles: ['']
})
export class PersonaFisicaImputadoComponent extends NoticiaHechoGlobal{

    public form  : FormGroup;
    public casoId: number = null;
    public globals: PersonaGlobals;
    persona:Persona;
    caso:Caso;
    tabla: CIndexedDB;

    forma=[{label:"Redonda", value:"Redonda"},{label:"Eliptica",value:"Eliptica"}];
    helixOriginal=[{label:"Si", value:"Si"},{label:"No",value:"No"}];
    helixSuperior=[{label:"Si",value:"Si"},{label:"No",value:"No"}];
    helixPosterior=[{label:"Si",value:"Si"},{label:"No",value:"No"}];
    helixAdherencia=[{label:"Si", value:"Si"},{label:"No",value:"No"}];
    lobuloContorno=[{label:"Si", value:"Si"},{label:"No",value:"No"}];
    lobuloAdherencia=[{label:"Si", value:"Si"},{label:"No",value:"No"}];
    lobuloParticular=[{label:"Si", value:"Si"},{label:"No",value:"No"}];
    lobuloDimension=[{label:"chico",value:"chico"},{label:"Mediano",value:"Mediano"},{label:"Grande",value:"Grande"}];

    constructor(
        private _fbuilder: FormBuilder,
        private router:Router,
        private _tabla: CIndexedDB,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private options: SelectsService
        ) {
        super();
        this.tabla = _tabla;
    }

    muestraDatos(){
        return true;
    }

    changeDetenido(e){
        this.globals.detenido=e.checked;
        // this.persona.detenido=e.checked;
    }

    ngOnInit(){
        this.form  = new FormGroup({
            'tipoPersona'      : new FormControl("", [Validators.required,]),
            'tipoInterviniente': new FormControl("", [Validators.required,]),
            'nombre'           : new FormControl("", [Validators.required,]),
            'paterno'          : new FormControl("", [Validators.required,]),
            'materno'          : new FormControl("", [Validators.required,]),
            'razonSocial'      : new FormControl("",[Validators.required,Validators.minLength(4)]),
            'fechaNacimiento'  : new FormControl("",[]),
        });
        this.form.controls.razonSocial.disable();
        this.globals = new PersonaGlobals(this.form);
        this.persona=new Persona();
        // this.persona.tipoPersona="";
        // this.persona.tipoInterviniente="";
        // this.persona.detenido=false;

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(!this.onLine.onLine){
                if (!isNaN(this.casoId)){
                    this.tabla.get("casos",this.casoId).then(
                        casoR=>{
                            this.caso=casoR as Caso;
                        });
                }
            }
        });
    }

    activaRazonSocial(value){
        if (value=="Moral")
            this.form.controls.razonSocial.enable();
        else
            this.form.controls.razonSocial.disable();
    }

    save(valid : any, _model : any):void{

        // this.tabla.get("catalagos","oreja").then(t=>{
        //     var lista=t["arreglo"] as any[];
        //     var p = _model as Persona;
        //     for (var i = 0; i < lista.length; ++i) {
        //         var item=lista[i];
        //         var c=(item["forma"]==p.orejaDerechaForma)
        //                 && (item["helixOriginal"]==p.orejaDerechaHelixOriginal)
        //                 && (item["helixAdherencia"]==p.orejaDerechaHelixAdherencia)
        //                 && (item["helixPosterior"]==p.orejaDerechaHelixPosterior)
        //                 && (item["helixSuperior"]==p.orejaDerechaHelixSuperior)
        //                 && (item["lobuloAdherencia"]==p.orejaDerechaLobuloAdherencia)
        //                 && (item["lobuloContorno"]==p.orejaDerechaLobuloContorno)
        //                 && (item["lobuloParticular"]==p.orejaDerechaLobuloParticular)
        //                 && (item["lobuloDimension"]==p.orejaDerechaLobuloDimensional);

        //         if (c){
        //             console.log(item);
        //         }

        //     }
        // })
        
        if(this.onLine.onLine){
            console.log('_model', _model);
            Object.assign(_model, this.persona,);
            _model.personaCaso.caso.id = this.casoId;
            this.http.post('/v1/base/personas', _model).subscribe(
                (response) => this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]),
                (error) => console.error('Error', error)
            );

        }else{
            this.tabla.add('personas', this.persona).then( p => {
                this.caso.personas.push({id:p["id"]});
                this.tabla.update("casos",this.caso).then(
                    response=>{
                        console.log("Se actualizo registro");

                });
                console.log('-> Persona Guardada',p);
                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);
            });
        }
    }
}

@Component({
    selector: 'identidad',
    templateUrl : './identidad.component.html'
})
export class IdentidadComponent{ 

    @Input()
    globals: PersonaGlobals;
    @Input()
    options: any[];
}

@Component({
    selector: 'identificacion',
    templateUrl : './identificacion.component.html'
})
export class IdentificacionComponent{ 

    @Input()
    globals: PersonaGlobals;
    @Input()
    options: any[];
}

@Component({
    selector: 'localizacion',
    templateUrl : './localizacion.component.html'
})
export class LocalizacionComponent{ 
    @Input()
    globals: PersonaGlobals;
    @Input()
    options: any[];
}

@Component({
    selector: 'media-filacion',
    templateUrl : './media-filacion.component.html'
})
export class MediaFilacionComponent{ 
    @Input()
    globals: PersonaGlobals;
    @Input()
    options: any[];
}


export class PersonaGlobals{
    public form  : FormGroup;
    public tipoPersona: string="";
    public tipoInterviniente: string;
    public detenido: boolean = false;

    constructor(
        _form: FormGroup
        ){
        this.form = _form;
    }
}