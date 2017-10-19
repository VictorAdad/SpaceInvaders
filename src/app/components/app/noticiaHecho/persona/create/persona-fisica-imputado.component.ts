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
import { Form } from './form';
import { Observable }                  from 'rxjs/Observable';
import * as moment from 'moment';

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
        this.persona= new Persona();
        this.form  = LosForm.createForm();
        this.globals = new PersonaGlobals(this.form,this.persona);
        this.globals.form.controls.razonSocial.disable();
        this.globals.formLocalizacion = LosForm.createFormLocalizacion();
        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"});
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
                    this.http.get('/v1/base/personas-casos/'+this.id).subscribe(response =>{
                        console.log("PERSONACASO->",response);
                        this.globals.personaCaso=response["persona"];
                        this.fillPersonaCaso(response);
                    });
                }else{
                    this._tabla.get("personas",this.casoId).then(t=>{
                        //falta editar
                    });
                }
            }
        });
        console.log('Form', this.globals.form);
    }


    public fillPersonaCaso(_personaCaso){
        let pcaso = this.globals.form.get('personaCaso') as FormArray;
        pcaso.controls[0].patchValue(_personaCaso);
        this.globals.tipoInterviniente=""+_personaCaso["tipoInterviniente"].id;
        
        let timer = Observable.timer(1);
        timer.subscribe(t => {
            let mediaF = this.globals.form.get('mediaFiliacion') as FormArray;
            if ( this.globals.tipoInterviniente=="5"){
                for (var propName in _personaCaso["persona"].mediaFiliacion) { 
                    if (_personaCaso["persona"].mediaFiliacion[propName] === null || _personaCaso["persona"].mediaFiliacion[propName] === undefined) {
                      delete (_personaCaso["persona"].mediaFiliacion)[propName];
                    }
                }
                mediaF.patchValue(_personaCaso["persona"].mediaFiliacion);
                this.globals.formMediaFilicion.patchValue(_personaCaso["persona"].mediaFiliacion);
            }
            this.fillForm(_personaCaso["persona"]);
            this.fillNombres(_personaCaso["persona"].aliasNombrePersona);
            var _data=_personaCaso["persona"];
            
            let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
            for (let i=0; i< _data["localizacionPersona"].length; i++) {
                let formLoc = LosForm.createFormLocalizacion();
                localizaciones.push(formLoc);
            }

            let timer2 = Observable.timer(1);
            timer2.subscribe(t => {
                let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
                for (let i=0; i< _data["localizacionPersona"].length; i++) {
                    for (var propName in (_data.localizacionPersona[i])) { 
                        if ((_data.localizacionPersona[i])[propName] === null || (_data.localizacionPersona[i])[propName] === undefined) {
                            delete (_data.localizacionPersona[i])[propName];
                        }
                    }
                    let formLoc = localizaciones.controls[i];
                    formLoc.patchValue(_data.localizacionPersona[i]);
                    
                }

            });
            
        });
           
    }

    public fillNombres(_alias:any[]){
        this.globals.indexNombres=0;
        for(var i=0;i<_alias.length;i++){
            var item=_alias[i];
            if(item["tipo"]=="Otro nombre"){
                this.globals.otrosNombres.nombres.push(item["nombre"]);
                this.globals.otrosNombres.ids.push(item["id"]);
                this.globals.otrosNombres.indices.push(this.globals.indexNombres);
                let form = LosForm.nombreForm('Otro nombre');
                form.patchValue({tipo:'Otro nombre',id:item["id"],nombre:item["nombre"]});
                let otrosNombres = this.globals.form.get('aliasNombrePersona') as FormArray;
                otrosNombres.push(form);
            }
            if(item["tipo"]=="Alias"){
                this.globals.alias.nombres.push(item["nombre"]);
                this.globals.alias.ids.push(item["id"]);
                this.globals.alias.indices.push(this.globals.indexNombres);
                let form = LosForm.nombreForm('Alias');
                form.patchValue({tipo:'Alias',id:item["id"],nombre:item["nombre"]});
                let otrosNombres = this.globals.form.get('aliasNombrePersona') as FormArray;
                otrosNombres.push(form);
            }

            this.globals.indexNombres++;
            
        }
        
    }

    
    activaRazonSocial(value){
        if (value=="Moral")
            this.form.controls.razonSocial.enable();
        else
            this.form.controls.razonSocial.disable();
    }

    searchCatalogos(datos:any[]){
        var obj= this;
        var encontrados={};
        var promesa = new Promise( 
            function(resolve,reject){
                var recursion=function(i){
                    if (i==datos.length){
                        resolve(encontrados);
                        return;
                    }
                    obj.tabla.searchInCatalogo( (datos[i])["catalogo"],(datos[i])["data"]).then(e=>{
                         encontrados[(datos[i])["name"]]=e;
                         recursion(i+1);
                    });
                }
                recursion(0);

            });

        return promesa;
    }

    buscaMediaFiliacion(_model:any){

        var buscar=[];

        buscar.push({
            catalogo:"oreja",
            name:"orejaDerecha",
            data:{
                forma:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].forma.value,
                helixOriginal:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].helixOriginal.value,
                helixPosterior:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].helixPosterior.value,
                helixAdherencia:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].helixAdherencia.value,
                helixSuperior:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].helixSuperior.value,
                lobuloContorno:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].lobuloContorno.value,
                lobuloAdherencia:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].lobuloAdherencia.value,
                lobuloParticularidad:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].lobuloParticularidad.value,
                lobuloDimension:this.globals.formMediaFilicion.controls.orejaDerecha["controls"].lobuloDimension.value
            }
        });

        buscar.push({
            catalogo:"oreja",
            name:"orejaIzquierda",
            data:{
                forma:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].forma.value,
                helixOriginal:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].helixOriginal.value,
                helixPosterior:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].helixPosterior.value,
                helixAdherencia:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].helixAdherencia.value,
                helixSuperior:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].helixSuperior.value,
                lobuloContorno:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].lobuloContorno.value,
                lobuloAdherencia:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].lobuloAdherencia.value,
                lobuloParticularidad:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].lobuloParticularidad.value,
                lobuloDimension:this.globals.formMediaFilicion.controls.orejaIzquierda["controls"].lobuloDimension.value
            }
        });

        buscar.push({
            catalogo:"complexion_piel_sangre",
            name:"complexionPielSangre",
            data:{
                tipoComplexion:this.globals.formMediaFilicion.controls.complexionPielSangre["controls"].tipoComplexion.value,
                colorPiel:this.globals.formMediaFilicion.controls.complexionPielSangre["controls"].colorPiel.value,
                tipoSangre:this.globals.formMediaFilicion.controls.complexionPielSangre["controls"].tipoSangre.value,
                factorRHSangre:this.globals.formMediaFilicion.controls.complexionPielSangre["controls"].factorRHSangre.value
            }
        });

        buscar.push({
            catalogo:"cabello",
            name:"cabello",
            data:{
                color:this.globals.formMediaFilicion.controls.cabello["controls"].color.value,
                forma:this.globals.formMediaFilicion.controls.cabello["controls"].forma.value,
                calvicie:this.globals.formMediaFilicion.controls.cabello["controls"].calvicie.value,
                implantacion:this.globals.formMediaFilicion.controls.cabello["controls"].implantacion.value
            }
        });

        buscar.push({
            catalogo:"frente_menton",
            name:"frenteMenton",
            data:{
                alturaFrente:this.globals.formMediaFilicion.controls.frenteMenton["controls"].alturaFrente.value,
                inclinacionFrente:this.globals.formMediaFilicion.controls.frenteMenton["controls"].inclinacionFrente.value,
                anchoFrente:this.globals.formMediaFilicion.controls.frenteMenton["controls"].anchoFrente.value,
                tipoMenton:this.globals.formMediaFilicion.controls.frenteMenton["controls"].tipoMenton.value,
                formaMenton:this.globals.formMediaFilicion.controls.frenteMenton["controls"].formaMenton.value,
                inclinacionMenton:this.globals.formMediaFilicion.controls.frenteMenton["controls"].inclinacionMenton.value
            }
        });

        buscar.push({
            catalogo:"ceja_boca",
            name:"cejaBoca",
            data:{
                direccionCeja:this.globals.formMediaFilicion.controls.cejaBoca["controls"].direccionCeja.value,
                implantacionCeja:this.globals.formMediaFilicion.controls.cejaBoca["controls"].implantacionCeja.value,
                formaCeja:this.globals.formMediaFilicion.controls.cejaBoca["controls"].formaCeja.value,
                tamanioCeja:this.globals.formMediaFilicion.controls.cejaBoca["controls"].tamanioCeja.value,
                tamanioBoca:this.globals.formMediaFilicion.controls.cejaBoca["controls"].tamanioBoca.value,
                comisurasBoca:this.globals.formMediaFilicion.controls.cejaBoca["controls"].comisurasBoca.value
            }
        });

        buscar.push({
            catalogo:"labio_ojo",
            name:"labioOjo",
            data:{
                colorOjo:this.globals.formMediaFilicion.controls.labioOjo["controls"].colorOjo.value,
                formaOjo:this.globals.formMediaFilicion.controls.labioOjo["controls"].formaOjo.value,
                tamanioOjo:this.globals.formMediaFilicion.controls.labioOjo["controls"].tamanioOjo.value,
                espesorLabio:this.globals.formMediaFilicion.controls.labioOjo["controls"].espesorLabio.value,
                alturaNasoLabialLabio:this.globals.formMediaFilicion.controls.labioOjo["controls"].alturaNasoLabialLabio.value,
                prominenciaLabio:this.globals.formMediaFilicion.controls.labioOjo["controls"].prominenciaLabio.value
            }
        });

        buscar.push({
            catalogo:"cara_nariz",
            name:"caraNariz",
            data:{
                raizNariz:this.globals.formMediaFilicion.controls.caraNariz["controls"].raizNariz.value,
                dorsoNariz:this.globals.formMediaFilicion.controls.caraNariz["controls"].dorsoNariz.value,
                anchoNariz:this.globals.formMediaFilicion.controls.caraNariz["controls"].anchoNariz.value,
                baseNariz:this.globals.formMediaFilicion.controls.caraNariz["controls"].baseNariz.value,
                alturaNariz:this.globals.formMediaFilicion.controls.caraNariz["controls"].alturaNariz.value,
                formaCara:this.globals.formMediaFilicion.controls.caraNariz["controls"].formaCara.value
            }
        });

        var promesa = new Promise((resolve,reject)=>{
            this.searchCatalogos(buscar).then(e=>{
                for(let key in e){
                    if (e[key]!=null){
                        (_model["mediaFiliacion"])[key]={id:e[key].id};
                    }
                }
                resolve(_model);
            });
        });

        return promesa;

        

    }

    save(valid : any, _model : any):void{
        
        // console.log('-> Form', this.form);

        var buscar=[];
        var obj=this;

        buscar.push({
            catalogo:"nacionalidad_religion",
            name:"nacionalidadReligion",
            data:{
                nacionalidad:this.form.controls.nacionalidad.value,
                religion:this.form.controls.religion.value,
            }
        });

        this.personaServ.nacionalidadReligion.find(this.form.controls.nacionalidad.value,"nacionalidad");
        this.personaServ.nacionalidadReligion.find(this.form.controls.religion.value,"religion");
        if (this.personaServ.nacionalidadReligion.finded[0])
            _model["nacionalidadReligion"]={id:this.personaServ.nacionalidadReligion.finded[0].id};

        buscar.push({
            catalogo:"idioma_identificacion",
            name:"idiomaIdentificacion",
            data:{
                hablaEspaniol:this.form.controls.hablaEspaniol.value,
                lenguaIndigena:this.form.controls.lenguaIndigena.value,
                familiaLinguistica:this.form.controls.familiaLinguistica.value
            }
        });

        this.searchCatalogos(buscar).then(e=>{
            for(let key in e){
                if (e[key]!=null){
                    _model[key]={id:e[key].id};
                }
            }
            this.buscaMediaFiliacion(_model).then(datos=>{
                console.log("Model",datos);
                obj.doSave(datos);
            });
        });
    }

    doSave(_model:any){
        if(this.onLine.onLine){
            _model.personaCaso[0].caso.id = this.casoId;
            console.log('Model', _model);
            this.http.post('/v1/base/personas', _model).subscribe(
                (response) => {
                    console.log(response);
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => console.error('Error', error)
            );

        }else{
            _model.personaCaso[0].caso.id = this.casoId;
            let temId=Date.now();
            let dato={
                url:'/v1/base/personas',
                body:_model,
                options:[],
                tipo:"post",
                pendiente:true,
                dependeDe:[this.casoId],
                temId: temId
            }
            console.log("SI");
            this.tabla.add("sincronizar",dato).then(response=>{
                this.tabla.get("casos",this.casoId).then(
                        casoR=>{
                    this.caso=casoR as Caso;

                    _model["tipoInterviniente"]={tipo:"por sincronizar"};
                    _model["persona"]={nombre:_model["nombre"]};
                    _model["alias"]=_model.aliasNombrePersona.nombre;
                    if (!_model["razonSocial"])
                        _model["razonSocial"]="";        
                    console.log("SI");
                    this.tabla.add('personas', _model).then( p => {
                        console.log("SI");
                        if (!this.caso["personas"])
                            this.caso["personas"]=[];
                        this.caso["personas"].push({id:p["id"]});
                        this.tabla.update("casos",this.caso).then(
                            ds=>{
                                console.log("Se actualizo registro");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);

                        });
                        console.log('-> Persona Guardada',p);
                        
                    });

                });
            });
        }
    }

    doEdit(_model){
        console.log('Editar -> Form', _model);
    
        if(this.onLine.onLine){
            _model.personaCaso[0].caso.id = this.casoId;
            console.log('Model', _model);
            this.http.put('/v1/base/personas/'+this.globals.personaCaso["id"], _model).subscribe(
                (response) => {
                    console.log("Editar Persona->",response);
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error)
                    console.log(this);
                }
            );

        }else{
            _model.personaCaso[0].caso.id = this.casoId;
            let temId=Date.now();
            let dato={
                url:'/v1/base/personas',
                body:_model,
                options:[],
                tipo:"post",
                pendiente:true,
                dependeDe:[this.casoId],
                temId: temId
            }
            console.log("SI");
            this.tabla.add("sincronizar",dato).then(response=>{
                this.tabla.get("casos",this.casoId).then(
                        casoR=>{
                    this.caso=casoR as Caso;

                    _model["tipoInterviniente"]={id:"por sincronizar"};
                    _model["persona"]={nombre:_model["nombre"]};
                    _model["alias"]=_model.aliasNombrePersona.nombre;
                    if (!_model["razonSocial"])
                        _model["razonSocial"]="";        
                    console.log("SI");
                    this.tabla.add('personas', _model).then( p => {
                        console.log("SI");
                        if (!this.caso["personas"])
                            this.caso["personas"]=[];
                        this.caso["personas"].push({id:p["id"]});
                        this.tabla.update("casos",this.caso).then(
                            ds=>{
                                console.log("Se actualizo registro");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);

                        });
                        console.log('-> Persona Guardada',p);
                        
                    });

                });
            });
        }
    }

    edit(valid : any, _model : any):void{

        var buscar=[];
        var obj=this;

        buscar.push({
            catalogo:"nacionalidad_religion",
            name:"nacionalidadReligion",
            data:{
                nacionalidad:this.form.controls.nacionalidad.value,
                religion:this.form.controls.religion.value,
            }
        });

        this.personaServ.nacionalidadReligion.find(this.form.controls.nacionalidad.value,"nacionalidad");
        this.personaServ.nacionalidadReligion.find(this.form.controls.religion.value,"religion");
        if (this.personaServ.nacionalidadReligion.finded[0])
            _model["nacionalidadReligion"]={id:this.personaServ.nacionalidadReligion.finded[0].id};

        buscar.push({
            catalogo:"idioma_identificacion",
            name:"idiomaIdentificacion",
            data:{
                hablaEspaniol:this.form.controls.hablaEspaniol.value,
                lenguaIndigena:this.form.controls.lenguaIndigena.value,
                familiaLinguistica:this.form.controls.familiaLinguistica.value
            }
        });

        this.searchCatalogos(buscar).then(e=>{
            for(let key in e){
                if (e[key]!=null){
                    _model[key]={id:e[key].id};
                }
            }
            this.buscaMediaFiliacion(_model).then(datos=>{
                if (this.globals.personaCaso["mediaFiliacion"].id){
                    if (this.globals.tipoInterviniente=="5"){
                        (datos["mediaFiliacion"])["id"]=this.globals.personaCaso["mediaFiliacion"].id;
                    }else{
                        delete datos["mediaFiliacion"];
                    }
                }
                if (this.globals.personaCaso["id"])
                    datos["id"]=this.globals.personaCaso["id"];
                console.log("Model",datos);
                console.log(this.globals.personaCaso);
                this.doEdit(datos);
            });
        });
    }

    public fillForm(_data){
        _data.fechaNacimiento = new Date(_data.fechaNacimiento);
        for (var propName in _data) { 
            if (_data[propName] === null || _data[propName] === undefined) {
              delete _data[propName];
            }
          }

        for (var propName in _data.mediaFiliacion) { 
            if (_data.mediaFiliacion[propName] === null || _data.mediaFiliacion[propName] === undefined) {
                delete _data.mediaFiliacion[propName];
            }
        }
        if (_data["nacionalidadReligion"]){
            _data["nacionalidad"]=(_data["nacionalidadReligion"])["nacionalidad"];
            _data["religion"]=(_data["nacionalidadReligion"])["religion"];
        }
        
        if (_data["idiomaIdentificacion"]){
            _data["familiaLinguistica"]=(_data["idiomaIdentificacion"])["familiaLinguistica"];
            _data["lenguaIndigena"]=(_data["idiomaIdentificacion"])["lenguaIndigena"];
            _data["hablaEspaniol"]=(_data["idiomaIdentificacion"])["hablaEspaniol"];
        }
        
        console.log("datos ->",_data);
        this.form.patchValue(_data);
        console.log('After patch', this.form);
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

    edad(e){
        var a=moment(e);
        var hoy=moment();
        var edad=hoy.diff(a, 'years');
        this.globals.form.patchValue({edad:edad});
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
    @Input()
    otrosNombres:{
        nombres:string[],
        ids:number[],
        indices:number[],
    }
    @Input()
    alias:{
        nombres:string[],
        ids:number[],
        indices:number[],
    }
    
    @Input()
    nombres: number = 0;

    constructor(private personaServ: PersonaService){

    }

    ngOnInit(){
        
    }

    public addOtroNombre(_tipo: string){
        if(_tipo === 'otroNombre'){
            let form = LosForm.nombreForm('Otro nombre');
            this.otrosNombres.nombres.unshift(null);
            this.otrosNombres.ids.unshift(null);
            this.otrosNombres.indices.unshift(this.nombres);
            form.patchValue({tipo:'Otro nombre'});
            let otrosNombres = this.globals.form.get('aliasNombrePersona') as FormArray;
            otrosNombres.push(form);
        }
        else{
            let form = LosForm.nombreForm('Alias');
            this.alias.nombres.unshift(null);
            this.alias.ids.unshift(null);
            this.alias.indices.unshift(this.nombres);
            form.patchValue({tipo:'Alias'});
            let otrosNombres = this.globals.form.get('aliasNombrePersona') as FormArray;
            otrosNombres.push(form);
        }
        this.nombres++;
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
    @Input()
    localizaciones: string[] = [];
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
        console.log(this.globals.form.value);
        let form = LosForm.createFormLocalizacion();
        this.localizaciones.push(null);
        let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
        localizaciones.push(form);
        console.log(localizaciones.value);
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
    public personaCaso;
    public personaForm: Form;
    public form: FormGroup;
    public tipoPersona: string="";
    public tipoInterviniente: string = '';
    public detenido: boolean = false;
    public persona:Persona;
    public formLocalizacion: FormGroup;
    public otrosNombres={
        nombres:[],
        ids:[],
        indices:[],
    };
    public alias={
        nombres:[],
        ids:[],
        indices:[],
    };
    public indexNombres:number=0;
    public formMediaFilicion=LosForm.createFormMediaFiliacion();
    public localizaciones=[];

    constructor(
        _form: FormGroup,
        _persona:Persona,
        ){
        this.form = _form;
        this.persona=_persona;
        this.alias.ids=[];
        this.alias.nombres=[];
        this.otrosNombres.ids=[];
        this.otrosNombres.nombres=[];
    }

    
}

class LosForm{
    public static createFormLocalizacion(){
        return new FormGroup({
            'id': new FormControl(),
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

    public static createFormMediaFiliacion(){
        return new FormGroup({
            'complexionPielSangre': new FormGroup({
                'tipoComplexion': new FormControl(),
                'colorPiel': new FormControl(),
                'tipoSangre': new FormControl(),
                'factorRHSangre': new FormControl(),
            }),
            'cabello': new FormGroup({
                'cantidad': new FormControl(),
                'color': new FormControl(),
                'forma': new FormControl(),
                'calvicie': new FormControl(),
                'implantacion': new FormControl(),
            }),
            'frenteMenton': new FormGroup({
                'alturaFrente': new FormControl(),
                'inclinacionFrente': new FormControl(),
                'anchoFrente': new FormControl(),
                'tipoMenton': new FormControl(),
                'formaMenton': new FormControl(),
                'inclinacionMenton': new FormControl(),
            }),
            'cejaBoca': new FormGroup({
                'direccionCeja': new FormControl(),
                'implantacionCeja': new FormControl(),
                'formaCeja': new FormControl(),
                'tamanioCeja': new FormControl(),
                'tamanioBoca': new FormControl(),
                'comisurasBoca': new FormControl(),
            }),
            'labioOjo': new FormGroup({
                'colorOjo': new FormControl(),
                'formaOjo': new FormControl(),
                'tamanioOjo': new FormControl(),
                'espesorLabio': new FormControl(),
                'alturaNasoLabialLabio': new FormControl(),
                'prominenciaLabio': new FormControl(),
            }),
            'caraNariz': new FormGroup({
                'raizNariz': new FormControl(),
                'dorsoNariz': new FormControl(),
                'anchoNariz': new FormControl(),
                'baseNariz': new FormControl(),
                'alturaNariz': new FormControl(),
                'formaCara': new FormControl(),
            }),
            'orejaIzquierda': new FormGroup({
                'forma': new FormControl(),
                'helixOriginal': new FormControl(),
                'helixSuperior': new FormControl(),
                'helixPosterior': new FormControl(),
                'helixAdherencia': new FormControl(),
                'lobuloContorno': new FormControl(),
                'lobuloAdherencia': new FormControl(),
                'lobuloParticularidad': new FormControl(),
                'lobuloDimension': new FormControl(),
            }),
            'orejaDerecha': new FormGroup({
                'forma': new FormControl(),
                'helixOriginal': new FormControl(),
                'helixSuperior': new FormControl(),
                'helixPosterior': new FormControl(),
                'helixAdherencia': new FormControl(),
                'lobuloContorno': new FormControl(),
                'lobuloAdherencia': new FormControl(),
                'lobuloParticularidad': new FormControl(),
                'lobuloDimension': new FormControl(),
            }),
        });
    }

    public static nombreForm(_tipo: string){
        return new FormGroup({
            'nombre' : new FormControl(),
            'tipo'   : new FormControl(_tipo),
            'id'     : new FormControl(),
        });
    }

    public static createForm(){
        var form=LosForm.createFormLocalizacion();

        return new FormGroup({
            'tipoPersona'      : new FormControl("", [Validators.required,]),
            'nombre'           : new FormControl("", [Validators.required,]),
            'paterno'          : new FormControl("", [Validators.required,]),
            'materno'          : new FormControl("", [Validators.required,]),
            'razonSocial'      : new FormControl("", [Validators.required,Validators.minLength(4)]),
            'fechaNacimiento'  : new FormControl("",[]),
            'edad'             : new FormControl("",[]),
            'curp'             : new FormControl("",[]),
            'rfc'              : new FormControl("",[]),
            'numHijos'         : new FormControl("",[]),
            'lugarTrabajo'     : new FormControl("",[]),
            'ingresoMensual'   : new FormControl("",[]),
            'detenido'         : new FormControl("",[]),
            'nacionalidad'     : new FormControl(),
            'nacionalidadReligion'     : new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'religion'         : new FormControl(),
            'hablaEspaniol'    : new FormControl(),
            'familiaLinguistica'    : new FormControl(),
            'lenguaIndigena'    : new FormControl(),
            'identificacion'   : new FormControl(),
            'idiomaIdentificacion': new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'autoridadEmisora' : new FormControl(),
            'folioIdentificacion' : new FormControl(),
            'localizacionPersona': new FormArray([]),
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
                'usaAnteojos': new FormControl(false),
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
            'estadoNacimientoOtro': new FormControl("",[]),
            'municipio': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'municipioNacimientoOtro': new FormControl("",[]),
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
            'personaCaso': new FormArray([
                new FormGroup({
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
                })
            ]),
            'aliasNombrePersona' : new FormArray([
                new FormGroup({
                    'nombre' : new FormControl(),
                    'tipo'   : new FormControl(),
                    'id'     : new FormControl(),
                })
                ]
            ),
        });
    }
}