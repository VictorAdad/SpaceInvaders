import { Injectable } from '@angular/core';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService } from '@services/onLine.service';
import * as moment from 'moment';
import { Logger } from '@services/logger.service';
import { PersonaNombre } from "@pipes/persona.pipe";
import { MOption } from '../../components/globals/partials/form/select2/select2.component';
/**
 * Servicio qeu almacena el ultimo caso visto
 */
@Injectable()
export class CasoService{
    /**
     * id del caso
     */
    public id: any;
    /**
     * caso
     */
    public caso: Caso = new Caso();

    constructor(
        private db: CIndexedDB,
        private http: HttpService,
        private onLine: OnLineService
        ) {
        onLine.setCaso(this);
    }

    /**
     * Busca el caso con id dado, si el _id==this.id no se hace nada 
     * @param _id id del caso a buscar
     */
    public find(_id){
        return new Promise<any>(
            (resolve, reject) => {
                if(this.id !== _id){
                    this.id = _id;
                    if(this.onLine.onLine){
                        this.http.get(`/v1/base/casos/${this.id}/all`).subscribe(
                            response => {
                                resolve(this.setOnlineCaso(response));
                            }
                        )
                    }else{
                        this.db.get("casos", this.id).then(
                            response => {
                                console.log('rsponse', response);
                                resolve(this.setCaso(response));
                            }
                        );
                    }
                }else{
                    resolve("El caso ya esta");
                }
            }
        );
    }
    /**
     * Actualiza el caso en indexedDB
     * @param response informacion nueva del caso
     */
    public setOnlineCaso(response){
        // Logger.log('Caso@setOnlineCaso')
        this.setCaso(response);
        this.db.clear("casos").then( t =>{
            this.db.update("casos",this.caso).then( t =>{
                // Logger.log('Indexed Caso actualizado');
            });
        });
        // Logger.log(this.caso);
    }
    /**
     * asigna la informacion del caso
     * @param caso 
     */
    public setCaso(caso){
        Object.assign(this.caso, caso)
    }
    /**
     * actualiza la informacion del caso, esto es necesario cuando se hace alguna operacion en online. Sirve para tener actualizado el caso en caso de que se pierda lo conexion.
     */
    public actualizaCaso(){
        if(this.onLine.onLine){
            this.http.get(`/v1/base/casos/${this.id}/all`).subscribe(
                response => {
                    this.setOnlineCaso(response);
                    Logger.log("%cCaso "+this.id+" actualizado","color:green;");
                }
            )
        }
    }
    public actualizaCasoOffline(caso) {
        var temCaso = new Caso();
        Object.assign(temCaso, caso);
        if (temCaso['predenuncias']) {
            temCaso['hasPredenuncia'] = !Number.isNaN(temCaso['predenuncias']['id']);
        }
        if (temCaso['tipoRelacionPersonas']){
            console.log('log', temCaso['tipoRelacionPersonas']);
            for (let i = 0; i < temCaso['tipoRelacionPersonas'].length; i++) {
                if (temCaso['tipoRelacionPersonas'][i]['tipo'] === 'Imputado víctima delito') {
                    console.log("entro");
                    temCaso['hasRelacionVictimaImputado'] = true;
                    break;
                }
            }
        }
        console.log(temCaso, caso);
        this.caso = temCaso;
        Logger.logColor('CASO@Update', 'purple', this.caso);
    }
}
/**
 * calse del caso, esta clase guarda la informacion importante del caso para poderla consultar en caso de que se pierda la conexion.
 */
export class Caso{
    
    public armas: any[];
    public descripcion: string
    public hasRelacionVictimaImputado: boolean
    public hasPredenuncia: boolean
    public hasAcuerdoInicio: boolean
    public entrevistas: any[];
    public created: number;
    public titulo: string;
    public nic: string;
    public vehiculos: any[];
    public estatus: string;
    public personaCasos: any[];
    public delitoPrincipal: any;
    public predenuncias: any;
    public delitoCaso: any[];
    public delito: string;
    public id: number;
    public lugares: any[];
    public nuc: string;
    public tipoRelacionPersonas: any[];
    public IdMexico = _config.optionValue.idMexico;
    public sintesis: string;



    public findVictima(){
        Logger.log('Caso@findVictima', this.personaCasos);
        let personas = this.personaCasos.filter(
            object => { 
                return object.tipoInterviniente.id === _config.optionValue.tipoInterviniente.victima
            }
        );
        return personas[0];
    }

    public formatCreated (){
        moment.locale('es');
       return moment(this.created).format('LL'); 
    }

    public formatHoraCreated(){
        return moment(this.created).format('LT');
    }

    public formatFecha(_date){
        let date = '';

        if(_date != null)
            date = moment(_date).format('LL')

        return date;
    }

    //Metódos de persona
    public getAlias(_persona){
        Logger.log('Caso@getAlias()', _persona);
        if(_persona.persona.aliasNombrePersona.length > 0){
            let nombres =  _persona.persona.aliasNombrePersona.map(object => { return object.nombre });
            return nombres.toString();
        }else{
            return '';
        }
    }

    public getDomicilios(_persona){
        Logger.log('Caso@getDomicilios()', _persona);
        let domicilios:any[] = [];

        for (let localizacion of _persona.persona.localizacionPersona) {
            let domicilio = '';
            domicilio += ' '+localizacion.calle;
            domicilio += ' '+localizacion.noInterior;
            domicilio += ' '+localizacion.noExterior;
            if(localizacion.colonia != null)
                domicilio += ' '+localizacion.colonia.nombre;
            if(localizacion.municipio  != null)
                domicilio += ' '+localizacion.municipio.nombre;
            if(localizacion.estado)
                domicilio += ' '+localizacion.estado.nombre;

            domicilios.push(domicilio);
        }

        return domicilios.toString();
    }

    public optionsPersonasTipo(){
        let options: MOption[] = [];
        if(this.personaCasos){
            for(let i in this.personaCasos){
                let object = this.personaCasos[i];
                let nombre = new PersonaNombre().transform(object);
                nombre = nombre+" - "+this.personaCasos[i].tipoInterviniente.tipo;

                options.push(
                    {value:this.personaCasos[i].id , label: nombre}
                );
            }
        }
        return options;
    }
    public optionsLugares(){
        let options: MOption[] = [];
        let complement;
        if (this.lugares) {
            for(let i in this.lugares){
                let paisId = this.lugares[i].pais.id;
                if (paisId == this.IdMexico) {
                    complement = this.lugares[i].colonia.nombre+","+this.lugares[i].estado.nombre;
                }else{
                    complement = this.lugares[i].coloniaOtro+","+this.lugares[i].estadoOtro;
                }
                let lugar = this.lugares[i].detalleLugar.tipoLugar+" - "+this.lugares[i].calle+","+this.lugares[i].noExterior+","+complement;

                options.push(
                    {value:this.lugares[i].id , label:lugar}
                );
            }
        }
        return options;		
    }

}