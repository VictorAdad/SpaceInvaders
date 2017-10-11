import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { Persona} from '@models/persona';
import { Pais} from '@models/catalogo/pais';
import { Estado} from '@models/catalogo/estado';

import { Router} from '@angular/router';
import { Caso} from '@models/caso'
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { SelectsService} from '@services/selects.service';
import { PersonaService} from '@services/noticia-hecho/persona/persona.service';
import { NoticiaHechoGlobal } from '../../global';

@Component({
    templateUrl : './persona-fisica-imputado.component.html',
    styles: ['']
})
export class PersonaFisicaImputadoComponent extends NoticiaHechoGlobal{

    public form  : FormGroup;
    public casoId: number = null;
    public id: number = null;
    public globals: PersonaGlobals;
    public isMexico: boolean=false;
    persona:Persona;
    caso:Caso;
    tabla: CIndexedDB;
    public breadcrumb = [];

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
        private options: SelectsService,
        private personaServ: PersonaService
        ) {
        super();
        this.tabla = _tabla;
    }

    muestraDatos(){
        return true;
    }

    public changeTipoInterviniente(tipoInterviniente){
        this.globals.tipoInterviniente=tipoInterviniente;
    }


    ngOnInit(){
        this.form  = this.createForm();
        this.persona= new Persona();
        this.globals = new PersonaGlobals(this.form,this.persona);
        this.globals.form.controls.razonSocial.disable();
        this.globals.formLocalizacion = this.formLocalizacion();
        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"})
            }
            if(!this.onLine.onLine){
                if (!isNaN(this.casoId)){
                    this.tabla.get("casos",this.casoId).then(
                        casoR=>{
                            this.caso=casoR as Caso;
                        });
                }
            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/personas/'+this.id).subscribe(response =>{
                        this.fillForm(response);
                    });
                }else{
                    this._tabla.get("casos",this.casoId).then(t=>{
                        let armas=t["arma"] as any[];
                        for (var i = 0; i < armas.length; ++i) {
                            if ((armas[i])["id"]==this.id){
                                this.fillForm(armas[i]);
                                break;
                            }
                        }
                    });
                }
            }
        });
        console.log('Form', this.globals.form);
    }

    public createForm(){

        return new FormGroup({
            'tipoPersona'      : new FormControl("", [Validators.required,]),
            'nombre'           : new FormControl("", [Validators.required,]),
            'paterno'          : new FormControl("", [Validators.required,]),
            'materno'          : new FormControl("", [Validators.required,]),
            'razonSocial'      : new FormControl("",[Validators.required,Validators.minLength(4)]),
            'fechaNacimiento'  : new FormControl("",[]),
            'edad'             : new FormControl("",[]),
            'curp'             : new FormControl("",[]),
            'rfc'              : new FormControl("",[]),
            'numHijos'         : new FormControl("",[]),
            'lugarTrabajo'     : new FormControl("",[]),
            'ingresoMensual'   : new FormControl("",[]),
            'detenido'         : new FormControl("",[]),
            'nacionalidad'     : new FormControl(),
            'religion'         : new FormControl(),
            'hablaEspaniol'    : new FormControl(),
            'identificacion'   : new FormControl(),
            'autoridadEmisora' : new FormControl(),
            'folioIdentificacion' : new FormControl(),
            'localizacionPersona': new FormArray([
                this.formLocalizacion(),
            ]),
            'mediaFiliacion': new FormGroup({
                'orejaDerecha': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'orejaIzquierda': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'complexionPielSangre': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'caraNariz': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'frenteMenton': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'cejaBoca': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'cabello': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'labioOjo': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'usaAnteojos': new FormControl("",[]),
                'cicatrices': new FormControl("",[]),
                'tatuajes': new FormControl("",[]),
                'lunares': new FormControl("",[]),
                'disminucionesFisicas': new FormControl("",[]),
                'protesis': new FormControl("",[]),
                'otras': new FormControl("",[]),
                'estatura': new FormControl("",[]),
                'peso': new FormControl("",[]),
            }),
            'sexo': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'pais': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'estado': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'municipio': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'escolaridad': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'ocupacion': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'grupoEtnico': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'alfabetismo': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'interprete': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'adiccion': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'estadoCivil': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'personaCaso': new FormGroup({
                'caso': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'tipoInterviniente': new FormGroup({
                    'id': new FormControl()
                }),
                'detalleDetenido': new FormGroup({
                    'fechaDetencion'   : new FormControl(),
                    'fechaDeclaracion' : new FormControl(),
                    'tipoDetenido' : new FormGroup({
                        'id' : new FormControl(),
                    })
                }),
            }),
            'aliasNombrePersona' : new FormArray([
                new FormGroup({
                    'nombre' : new FormControl(),
                    'tipo'   : new FormControl()
                })]
            ),
        });
    }

    activaRazonSocial(value){
        if (value=="Moral")
            this.form.controls.razonSocial.enable();
        else
            this.form.controls.razonSocial.disable();
    }

    save(valid : any, _model : any):void{
        console.log('-> Form', this.form);
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
            _model.personaCaso.caso.id = this.casoId;
            console.log('Model', _model);
            this.http.post('/v1/base/personas', _model).subscribe(
                (response) => //this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]),
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

    public fillForm(_data){
        _data.fechaNacimiento = new Date(_data.fechaNacimiento);
        for (var propName in _data) { 
            if (_data[propName] === null || _data[propName] === undefined) {
              delete _data[propName];
            }
          }
         for (var propName in _data.localizacionPersona) { 
            if (_data.localizacionPersona[propName] === null || _data.localizacionPersona[propName] === undefined) {
              delete _data.localizacionPersona[propName];
            }
          }
        this.form.patchValue(_data);
        console.log('After patch', this.form);
    }

    public formLocalizacion(){
        return new FormGroup({
            'pais': new FormGroup({
                'id': new FormControl(),
            }),
            'estado': new FormGroup({
                'id': new FormControl(),
            }),
            'municipio': new FormGroup({
                'id': new FormControl(),
            }),
            'colonia': new FormGroup({
                'id': new FormControl(),
            }),
            'localidad': new FormGroup({
                'id': new FormControl(),
            }),
            'tipoDomicilio': new FormGroup({
                'id': new FormControl(),
            }),
            'calle': new FormControl(),
            'noExterior': new FormControl(),
            'noInterior': new FormControl(),
            'cp': new FormControl("",[]),
            'referencias': new FormControl(),
            'telParticular': new FormControl(),
            'telTrabajo': new FormControl(),
            'extension': new FormControl(),
            'telMovil': new FormControl(),
            'fax': new FormControl(),
            'otroMedioContacto': new FormControl(),
            'correo': new FormControl("",[]),
            'tipoResidencia': new FormControl(),
            'estadoOtro': new FormControl(),
            'municipioOtro': new FormControl(),
            'coloniaOtro': new FormControl(),
            'localidadOtro': new FormControl(),
        });
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
    @Input()
    options: SelectsService;
    isMexico:boolean=false;

    constructor(private personaServ: PersonaService){
        
    }

    changePais(id){
      if(id)
      { this.options.getEstadoByPais(id);
        this.isMexico=false;
        for (var i = 0; i < this.options.paises.length; ++i) {
            var pais=this.options.paises[i]
            if(pais.value==id && pais.label=="MEXICO"){
                this.isMexico=true;

            }
        }   
      }
    } 

    changeEstado(id){
        if(id)
            this.options.getMunicipiosByEstado(id);
    }

    changeMunicipio(id){
        if(id)
            this.options.getColoniasByMunicipio(id);
    }

    changeDetenido(checked){
        this.globals.detenido=checked;
    }
}

@Component({
    selector: 'identificacion',
    templateUrl : './identificacion.component.html'
})
export class IdentificacionComponent{ 

    @Input()
    globals: PersonaGlobals;
    @Input()
    options: SelectsService;
    public otrosNombres:string[]=[];
    public alias:string[]=[];
    public nombres: number = 0;

    constructor(private personaServ: PersonaService){

    }


    public addOtroNombre(_tipo: string){
        this.nombres++;
        if(_tipo === 'otroNombre'){
            let form = this.nombreForm('Otro nombre');
            this.otrosNombres.unshift(null);
            form.patchValue({tipo:'Otro nombre'});
            let otrosNombres = this.globals.form.get('aliasNombrePersona') as FormArray;
            otrosNombres.push(form);
        }
        else{
            let form = this.nombreForm('Alias');
            this.alias.unshift(null);
            form.patchValue({tipo:'Alias'});
            let otrosNombres = this.globals.form.get('aliasNombrePersona') as FormArray;
            otrosNombres.push(form);
        }
    }

    public nombreForm(_tipo: string){
        return new FormGroup({
            'nombre' : new FormControl(),
            'tipo'   : new FormControl(_tipo)
        });
    }

}

@Component({
    selector: 'localizacion',
    templateUrl : './localizacion.component.html'
})
export class LocalizacionComponent{ 
    @Input()
    globals: PersonaGlobals;
    @Input()
    options: SelectsService;
    isMexico:boolean=false;
    public localizaciones: string[] = [];
    public localizacionIndex: number = 0;

    constructor(private personaServ: PersonaService){
        this.localizaciones.unshift(null);
    }

    changePais(id){
      if(id){
      this.options.getEstadoByPais(id);
      this.isMexico=false;
        for (var i = 0; i < this.options.paises.length; ++i) {
            var pais=this.options.paises[i];
            if(pais.value==id && pais.label=="MEXICO"){
                this.isMexico=true;
            }
        } 
       }
    }

    changeEstado(id){
        if(id)
        this.options.getMunicipiosByEstado(id);
    }

    changeMunicipio(id){
        if(id)
            this.options.getColoniasByMunicipio(id);
    }

    changeColonia(id){
        if(id)
            this.options.getLocalidadByColonias(id);
    }


    addLocalizacion(_e){
        this.localizaciones.unshift(null);

        let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
        localizaciones.push(this.globals.formLocalizacion);
    }

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

    constructor(private personaServ: PersonaService){

    }
}


export class PersonaGlobals{
    public form  : FormGroup;
    public tipoPersona: string="";
    public tipoInterviniente: string = '';
    public detenido: boolean = false;
    public persona:Persona;
    public formLocalizacion: FormGroup;

    constructor(
        _form: FormGroup,
        _persona:Persona,
        ){
        this.form = _form;
        this.persona=_persona;
    }
}