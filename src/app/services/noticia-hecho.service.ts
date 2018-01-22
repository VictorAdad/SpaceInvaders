import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';

import { MOption } from '@partials/form/select2/select2.component';
import { _config} from '@app/app.config';
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";
import { PersonaNombre } from "@pipes/persona.pipe";
/**
 * Genera la informacion de los selects de relacion.
 */
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
    /**
     * agrega el id del caso asi como la informacion de este.
     * @param _id
     * @param _caso 
     */
    public setId(_id: number, _caso){
        this.id = _id;
        this.caso= _caso;
    }

    public llamaDatos(){
        Logger.log("CASO->",this.caso);
        this.getLugares();
        this.getVehiculos();
        this.getArmas();
        // this.getPersonas();
        this.getDelitos()
        this.imputados = [];
        this.testigos  = [];
        this.victimas  = [];
        this.apoderadosLegales = [];
        this.defensoresPublicos  = [];
        this.defensoresPrivados  = [];
        this.representantesLegales  = [];
        this.asesoresPublicos  = [];
        this.asesoresPrivados  = [];
        this.ofendidos  = [];
        this.policias  = [];
        this.getInterviniente('apoderadosLegales', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.apoderadoLegal}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.apoderadoLegal);
        this.getInterviniente('defensoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.defensorPublico}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.defensorPublico);
        this.getInterviniente('representantesLegales', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.representanteLegal}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.representanteLegal);
        this.getInterviniente('asesoresPrivados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.asesorPrivado}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.asesorPrivado);
        this.getInterviniente('imputados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.imputado}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.imputado);
        this.getInterviniente('testigos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.testigo}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.testigo);
        this.getInterviniente('asesoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.asesorPublico}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.asesorPublico);
        this.getInterviniente('victimas', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.victima}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.victima);
        this.getInterviniente('ofendidos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/${_config.optionValue.tipoInterviniente.ofendido}`, this.constructOptionsPersona,_config.optionValue.tipoInterviniente.ofendido);
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
                    arr.push(
                        {
                            id:this.caso["personaCasos"][i]["persona"]["id"], 
                            persona:{
                                nombre:this.caso["personaCasos"][i]["persona"]["nombre"],
                                paterno:this.caso["personaCasos"][i]["persona"]["paterno"],
                                materno:this.caso["personaCasos"][i]["persona"]["materno"]
                            },
                            tipoInterviniente:{
                                id:this.caso["personaCasos"][i]["tipoInterviniente"]["id"],
                                tipo:this.caso["personaCasos"][i]["tipoInterviniente"]["tipo"]
                            }
                        });
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
    
    public getInterviniente(_attr:string, _url:string, _call:any, idInterviniente:number=null) {
        if (this.onLine.onLine) {
            this.http.get(_url).subscribe((response) => {
                if(_attr === 'defensoresPublicos' || _attr === 'defensoresPrivados') {
                    if (_attr === 'defensoresPublicos') {
                        this.defensoresPublicos = this.defensoresPublicos.concat(_call(response));
                    }
                    if (_attr === 'defensoresPrivados') {
                        this[_attr] = _call(response);
                        this.defensoresPublicos = this.defensoresPublicos.concat(this.defensoresPrivados);
                    }
                }else if(_attr === 'asesoresPublicos' || _attr === 'asesoresPrivados') {
                    if (_attr === 'asesoresPublicos') {
                        this.asesoresPublicos = this.asesoresPublicos.concat(_call(response));
                    }
                    if ( _attr === 'asesoresPrivados') {
                        this[_attr] = _call(response);
                        this.asesoresPublicos = this.asesoresPublicos.concat(this.asesoresPrivados);
                    }
                }else if(_attr === 'victimas' || _attr === 'ofendidos' || _attr === 'victimaDesconocido') {
                    if (_attr === 'victimas') {
                        this.victimas = this.victimas.concat(_call(response));
                    }
                    if (_attr === 'ofendidos') {
                        this[_attr] = _call(response);
                        this.victimas = this.victimas.concat(this.ofendidos);
                    }
                    if (_attr === 'victimaDesconocido') {
                        this[_attr] = _call(response);
                        this.victimas = this.victimas.concat(this.victimaDesconocido);
                    }
                }else if (_attr === 'imputado' || _attr === 'imputadoDesconocido') {
                    if (_attr === 'imputado') {
                        console.log('Entre');
                        this.imputados = this.imputados.concat(_call(response));
                    }
                    if (_attr === 'imputadoDesconocido') {
                        this[_attr] = _call(response);
                        this.imputados = this.imputados.concat(this.imputadoDesconocido);
                    }
                }else {
                    this[_attr] = _call(response);
                }

            });
        } else {
            if (this.caso["personaCasos"]){
                var arr=[];
                for (var i = 0; i < this.caso["personaCasos"].length; ++i) {
                    if (idInterviniente==this.caso["personaCasos"][i]["tipoInterviniente"]["id"]){
                        /*
                            Cuando se crea un caso los ids estan cruzados, por lo que
                            hice esto para poder crear un objecto de manera correcta.
                            en offLine el id de la persona es el id de personaCaso, 
                            esto por que asi lo devuelvia el servicio. 
                        */
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
                    if (_attr === 'ofendidos')
                        this.victimas = this.victimas.concat(this.ofendidos); 
                    if (_attr === 'victimaDesconocido')                           
                        this.victimas = this.victimas.concat(this.victimaDesconocido);
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
                let marca = object.marcaSubmarca != null  ? (object.marcaSubmarca.marca? object.marcaSubmarca.marca:'SIN MARCA') : 'SIN MARCA';
                let color = object.motivoRegistroColorClase != null  ? (object.motivoRegistroColorClase.color? object.motivoRegistroColorClase.color:'SIN COLOR') : 'SIN COLOR';
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
        if (_data)
            for (var i in _data){      
                let object=_data[i];
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
