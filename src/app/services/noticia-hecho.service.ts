import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';

import { MOption } from '@partials/form/select2/select2.component';
import { _config} from '@app/app.config';
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";
import { PersonaNombre } from "@pipes/persona.pipe";

@Injectable()
export class NoticiaHechoService {

    id:number;
    lugares   = [];
    vehiculos = [];
    armas     = [];
    personas  = [];
    delitos   = [];
    //Tipos de Intervinientes
    imputados = [];
    testigos  = [];
    victimas  = [];
    apoderadosLegales = [];
    defensoresPublicos  = [];
    defensoresPrivados  = [];
    representantesLegales  = [];
    asesoresPublicos  = [];
    asesoresPrivados  = [];
    ofendidos  = [];
    policias  = [];

    imputadoDesconocido = [];
    victimaDesconocido = [];
    
    caso=null;

    constructor(
        private http: HttpService,
        private db:CIndexedDB,
        private onLine:OnLineService,
        ) {
    }

    public setId(_id: number, _caso){
        this.id = _id;
        this.caso= _caso;
    }

    //crea una copia identica al json original
    public copiaJson(original){
        if (typeof original=="object"){
            var obj={};
            for(let item in original)
                obj[item]=this.copiaJson(original[item]);
            return obj;
        }else
            return original;
    }
    //busca todos los elementos de la lista que coincidan con el item 
    public buscaTodosLosElementosEnLista(lista, _item){
        var rec=function(e,y) {
            if((typeof e)=="object"){
                let igual=true;
                for (var element in e){
                    igual=igual&&rec(e[element],y[element]);
                }
                return igual;
            }
            return e==y;
        }
        var coincidencias=[];
        for (let item in lista){
            if (rec(_item,lista[item]))
                coincidencias.push(this.copiaJson(lista[item])); 
        }
        return coincidencias;

    }
    
    public llamaDatos(){
        Logger.log("CASO->",this.caso);
        this.getLugares();
        this.getVehiculos();
        this.getArmas();
        // this.getPersonas();
        this.getDelitos()
        this.getInterviniente('apoderadosLegales', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.apoderadoLegal}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.apoderadoLegal);
        this.getInterviniente('defensoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.defensorPublico}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.defensorPublico);
        this.getInterviniente('representantesLegales', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.representanteLegal}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.representanteLegal);
        this.getInterviniente('asesoresPrivados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.asesorPrivado}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.asesorPrivado);
        this.getInterviniente('imputados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.imputado}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.imputado);
        this.getInterviniente('testigos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.testigo}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.testigo);
        this.getInterviniente('asesoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.asesorPublico}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.asesorPublico);
        this.getInterviniente('ofendidos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.ofendido}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.ofendido);
        this.getInterviniente('victimas', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.victima}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.victima);
        this.getInterviniente('defensoresPrivados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.defensorPrivado}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.defensorPrivado);
        this.getInterviniente('policias', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.policia}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.policia);

        this.getInterviniente('imputadoDesconocido', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.imputadoDesconocido}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.imputadoDesconocido);
        this.getInterviniente('victimaDesconocido', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.victimaDesconocido}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.victimaDesconocido);
    }

    public getData(){
       this.llamaDatos();
    }

    public getLugares(){
        if (this.onLine.onLine)
            this.http.get('/v1/base/lugares/casos/'+this.id).subscribe((response) => {
                this.lugares = this.constructOptionsLugar(response);
            });
        else
            if (this.caso["lugares"])
                this.lugares = this.constructOptionsLugar(this.caso["lugares"]);

    }    

    public getVehiculos(){
        if (this.onLine.onLine)
            this.http.get('/v1/base/vehiculos/casos/'+this.id).subscribe((response) => {
                this.vehiculos = this.constructOptionsVehiculo(response);
            });
        else
            if (this.caso["vehiculos"])
                this.vehiculos = this.constructOptionsVehiculo(this.caso["vehiculos"]);
    }

    public getArmas(){
        if (this.onLine.onLine)
            this.http.get('/v1/base/armas/casos/'+this.id).subscribe((response) => {
                this.armas = this.constructOptionsArma(response);
            });
        else
            if (this.caso["armas"])
                this.armas = this.constructOptionsArma(this.caso["armas"]);
    }

    public getPersonas(){
        if (this.onLine.onLine)
            this.http.get('/v1/base/personas-casos/casos/'+this.id).subscribe((response) => {
                this.personas = this.constructOptionsPersona(response);
            });
        else
            if (this.caso["personaCasos"]){
                var arr=[];
                for (var i = 0; i < this.caso["personaCasos"].length; ++i) {
                    arr.push({id:this.caso["personaCasos"][i]["persona"]["id"], persona:{nombre:this.caso["personaCasos"][i]["persona"]["nombre"]}});
                }
                this.personas = this.constructOptionsPersona(arr);
                Logger.log("PERSONAS",arr);
            }
    }
    //solo funciona en offline
    public getPersonaCaso(id){
        if (!this.onLine.onLine){
            if (this.caso["personaCasos"]){
                for (var i = 0; i < this.caso["personaCasos"].length; ++i) {
                    if (this.caso["personaCasos"][i]["id"]==id){
                        return this.caso["personaCasos"][i];
                    }
                }
            }
        }
        return null;
    }

    //solo funciona en offline
    public getLugarCaso(id){
        Logger.log("IDLugar",id,this.caso["lugares"]);
        if (!this.onLine.onLine){
            if (this.caso["lugares"]){
                for (var i = 0; i < this.caso["lugares"].length; ++i) {
                    if (this.caso["lugares"][i]["id"]==id){
                        return this.caso["lugares"][i];
                    }
                }
            }
        }
        return null;
    }

    //solo funciona en offline
    public getDelitoCaso(id){
        Logger.log("IDDelito",id,this.caso["delitoCaso"]);
        if (!this.onLine.onLine){
            if (this.caso["delitoCaso"]){
                for (var i = 0; i < this.caso["delitoCaso"].length; ++i) {
                    if (this.caso["delitoCaso"][i]["id"]==id){
                        return this.caso["delitoCaso"][i];
                    }
                }
            }
        }
        return null;
    }

    public getDelitos(){
        if (this.onLine.onLine)
            this.http.get('/v1/base/delitos-casos/casos/'+this.id).subscribe((response) => {
                this.delitos = this.constructOptionsDelito(response);
            });
        else
            if (this.caso["delitoCaso"])
                this.delitos = this.constructOptionsDelito(this.caso["delitoCaso"]);
    }

    public getInterviniente(_attr:string, _url:string, _call:any, idInterviniente:number=null){
        if (this.onLine.onLine)
            this.http.get(_url).subscribe((response) => {
                this[_attr] = _call(response);
                if(_attr === 'defensoresPublicos' || _attr === 'defensoresPrivados'){
                    this.defensoresPublicos = this.defensoresPublicos.concat(this.defensoresPrivados);
                    Logger.log(this.defensoresPrivados);
                }
                if(_attr === 'asesoresPublicos' || _attr === 'asesoresPrivados'){
                    this.asesoresPublicos = this.asesoresPublicos.concat(this.asesoresPrivados);
                    Logger.log(this.asesoresPrivados);
                }
                if(_attr === 'victimas' || _attr === 'ofendidos' || _attr === 'victimaDesconocido'){
                    this.victimas = this.victimas.concat(this.ofendidos);
                    this.victimas = this.victimas.concat(this.victimaDesconocido);
                    Logger.log(this.victimas);
                }

                if (_attr === 'imputado' || _attr === 'imputadoDesconocido') {
                     this.imputados = this.imputados.concat(this.imputadoDesconocido);
                     Logger.log(this.imputados);   
                }

            });
        else{
            if (this.caso["personaCasos"]){
                var arr=[];
                for (var i = 0; i < this.caso["personaCasos"].length; ++i) {
                    if (idInterviniente==this.caso["personaCasos"][i]["tipoInterviniente"]["id"]){
                        arr.push({
                            id:this.caso["personaCasos"][i]["id"], 
                            persona:{nombre:this.caso["personaCasos"][i]["persona"]["nombre"], 
                                paterno:this.caso["personaCasos"][i]["persona"]["paterno"],
                                materno:this.caso["personaCasos"][i]["persona"]["materno"]
                            },
                            tipoInterviniente:this.caso["personaCasos"][i]["tipoInterviniente"]
                        });
                    }
                }
                this[_attr] = this.constructOptionsPersona(arr);
                if(_attr === 'defensoresPublicos' || _attr === 'defensoresPrivados'){
                    this.defensoresPublicos = this.defensoresPublicos.concat(this.defensoresPrivados);
                    Logger.log(this.defensoresPrivados);
                }
                if(_attr === 'asesoresPublicos' || _attr === 'asesoresPrivados'){
                    this.asesoresPublicos = this.asesoresPublicos.concat(this.asesoresPrivados);
                    Logger.log(this.asesoresPrivados);
                }
                if(_attr === 'victimas' || _attr === 'ofendidos' || _attr === 'victimaDesconocido'){
                    this.victimas = this.victimas.concat(this.ofendidos);
                    this.victimas = this.victimas.concat(this.victimaDesconocido);
                    Logger.log(this.victimas);
                }
                if (_attr === 'imputado' || _attr === 'imputadoDesconocido') {
                     this.imputados = this.imputados.concat(this.imputadoDesconocido);
                     Logger.log(this.imputados);   
                }

            }
        }
    }

    private constructOptionsLugar(_data:any){
        let options: MOption[] = [];
        if (_data)
            for (var i in _data){      // code...
                let object=_data[i];
                options.push({value: object.id, label: object.calle});
            }
        options.sort((a,b)=>{
            if (a.label>b.label) 
                return 1; 
            if (a.label<b.label)
                return -1;
            return 0;
        });
        return options;
    }

    private constructOptionsVehiculo(_data:any){
        let options: MOption[] = [];

        if (_data)
            for (var i in _data){      // code...
                let object=_data[i];
                let marca = object.marcaSubmarca != null  ? object.marcaSubmarca.marca  : '';
                let color = object.motivoRegistroColorClase != null  ? object.motivoRegistroColorClase.color  : '';
                options.push({value: object.id, label: marca+" "+color});
            }
        options.sort((a,b)=>{
            if (a.label>b.label) 
                return 1; 
            if (a.label<b.label)
                return -1;
            return 0;
        });
        return options;
    }

    private constructOptionsArma(_data:any){
        let coco = _data as any[];
        let options: MOption[] = [];

        if (_data){
            for (var i in _data){      // code...
                let object=_data[i];
                let clase = object.claseArma != null  ? object.claseArma.claseArma  : '';
                let tipo = object.claseArma.tipo != null  ? ' - '+ object.claseArma.tipo  : '';
                options.push({value: object.id, label: clase+" "+tipo});
            }
        }
        options.sort((a,b)=>{
            if (a.label>b.label) 
                return 1; 
            if (a.label<b.label)
                return -1;
            return 0;
        });
        return options;
    }

    private constructOptionsPersona(_data:any){
        let options: MOption[] = [];
        Logger.logColor("data","purple",_data);
        if (_data)
            for (var i in _data){      // code...
                let object=_data[i];
                Logger.logColor('----------->','green', object, _data);
                let nombre = new PersonaNombre().transform(object);
                
                options.push(
                    {value: object.id, label: nombre}
                );
            }
        options.sort((a,b)=>{
            if (a.label>b.label) 
                return 1; 
            if (a.label<b.label)
                return -1;
            return 0;
        });
        return options;
    }

    private constructOptionsDelito(_data:any){
        let options: MOption[] = [];
        if (_data)
            for (var i in _data){      // code...
                let object=_data[i];
                options.push({value: object.id, label: object.delito.nombre});
            }
        options.sort((a,b)=>{
            if (a.label>b.label) 
                return 1; 
            if (a.label<b.label)
                return -1;
            return 0;
        });
        return options;
    }

    
}
