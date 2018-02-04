import { Injectable } from '@angular/core';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService } from '@services/onLine.service';
import * as moment from 'moment';
import { Logger } from '@services/logger.service';
import { PersonaNombre } from "@pipes/persona.pipe";
import { Subject } from 'rxjs/Subject';
import { MOption } from '../../components/globals/partials/form/select2/select2.component';
import { AuthenticationService } from '@services/auth/authentication.service';
import { Subscription } from 'rxjs/Subscription';
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

    /**
     * Subject del caso
     */
    public casoChange = new Subject<Caso>();

    private getCasoSubs: Subscription;

    constructor(
        private db: CIndexedDB,
        private http: HttpService,
        private onLine: OnLineService,
        private auth: AuthenticationService
        ) {
        onLine.setCaso(this);
    }

    /**
     * Busca el caso con id dado, si el _id==this.id no se hace nada
     * @param _id id del caso a buscar
     */
    public find(_id) {
        console.log('-> Find caso', this.id, _id);
        if (!Number.isInteger(_id))
            _id = parseInt(_id);
        // Logger.logColor('Logger con toño','blue',_id, this.caso, this.id);
        return new Promise<any>(
            (resolve, reject) => {
                if (this.id !== _id) {
                    if (this.onLine.onLine) {
                        if (this.getCasoSubs) {
                            this.getCasoSubs.unsubscribe();
                        }

                        this.getCasoSubs = this.http.get(`/v1/base/casos/${_id}/all`).subscribe(
                            response => {
                                this.id = _id;
                                this.addExtraInfoCaso(response);
                                this.caso = new Caso().fromJSON(response);
                                this.casoChange.next(this.caso);
                                resolve(this.caso);
                                this.setOnlineCaso(response)
                            }
                        );
                    } else {
                        this.db.get('casos', _id).then(
                            response => {
                                if (response !== undefined) {
                                    this.id = _id;
                                    console.log('rsponse', response);
                                    this.caso = new Caso().fromJSON(response);
                                    this.casoChange.next(this.caso);
                                    this.setCaso(response);
                                    resolve(this.caso);
                                    this.actualizaCasoOffline(response)
                                }else {
                                    Logger.logColor('RESPUESTA','green',this.caso);
                                    resolve();
                                }
                            }
                        );
                    }
                } else {
                    Logger.logColor('RESPUESTA','green',this.caso);
                    this.casoChange.next(this.caso);
                    resolve(this.caso);
                }
            }
        );
    }

    public addPredenuncia(_predenuncia) {
        this.caso.predenuncias = _predenuncia;
        this.caso.hasPredenuncia = true;
        this.caso.hasRelacionVictimaImputado = true;
        return this.db.update('casos', this.caso);

    }

    public addAcuerdoInicio() {
        this.caso.hasAcuerdoInicio = true;
        this.caso.hasRelacionVictimaImputado = true;
        return this.db.update('casos', this.caso);

    }
    /**
     * Elimina los casos que no estan sincronizados, del usuario que esta identificado
     * @return nada
     */
    eliminaCasosDelUsuario(){
        var obj = this;
        return new Promise(
            (resolve,reject) => {
                obj.db.list("casos").then(listaCasos=>{
                   var lista = (listaCasos as any[]).filter(caso => caso.username == obj.auth.user.username);
                   var fun = function(i, lista:any[]){
                       if (i == lista.length || i > lista.length) {
                            resolve('Casos eliminados');
                            return;
                       }
                       const caso = lista[i];
                       //eliminamos los casos temporales que ya estan sincronizados
                       if (caso['estatusSincronizacion'] != undefined && caso['estatusSincronizacion'] == 'nasincronizado') {
                           obj.db.delete("casos",caso["id"]).then( p => {
                               fun(i+1,lista);
                           }).catch( e => { return reject(e);});
                           //los casos que no tienen este estatus es por que no los crearon en offline, tons tambien borramos
                       }else if(caso['estatusSincronizacion'] == undefined){
                            obj.db.delete("casos",caso["id"]).then( p => {
                                fun(i+1,lista);
                            }).catch( e => { return reject(e);});
                       }else {
                           fun(i+1,lista);
                       }
                   }
                   Logger.logColor('Casos@eliminar','pink', lista);
                   fun(0, lista);
               }).catch( e => { reject(e); });
            });
    }
    /**
     * Actualiza el caso en indexedDB
     * @param response informacion nueva del caso
     */
    public setOnlineCaso(response){
        // Logger.log('Caso@setOnlineCaso')
        this.setCaso(response);
        this.eliminaCasosDelUsuario().then( info =>{
            Logger.log(info);
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
        this.caso.estatusSincronizacion = undefined;
        this.caso.ultimaActualizacion = null;
        this.caso.username = undefined;
        this.caso = new Caso().fromJSON(caso);
        Logger.logDarkColor('Caso','white',this.caso);
    }
    /**
     * Agrega informacion extra al caso
     * @param  caso Caso al que se añadira l info
     * @return      nada
     */
    public addExtraInfoCaso(caso) {
        Logger.logColor('CASO@LINEA','blue',caso);
        caso['ultimaActualizacion'] = Date.now();
        caso['username'] = this.auth.user.username;
    }
    /**
     * actualiza la informacion del caso, esto es necesario cuando se hace alguna operacion en online. Sirve para tener actualizado el caso en caso de que se pierda lo conexion.
     */
    public actualizaCaso(){
        if(this.onLine.onLine){
            this.http.get(`/v1/base/casos/${this.id}/all`).subscribe(
                response => {
                    this.addExtraInfoCaso(response);
                    this.setOnlineCaso(response);
                    this.casoChange.next(new Caso().fromJSON(response));
                    Logger.log("%cCaso "+this.id+" actualizado","color:green;");
                }
            )
        }
    }
    /**
     * Actualiza el caso offline, en algunos casos es necesario tener
     * actualizado el caso, para esto utilizamos esto.
     * @param  caso caso a actualizar
     * @return      nada
     */
    public actualizaCasoOffline(caso) {
        var temCaso = new Caso().fromJSON(caso);
        if (temCaso['predenuncias']) {
            temCaso['hasPredenuncia'] = !Number.isNaN(temCaso['predenuncias']['id']);
        }
        if (temCaso['acuerdoInicio']) {
            temCaso['hasAcuerdoInicio'] = !Number.isNaN(temCaso['acuerdoInicio']['id']);
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
        if (temCaso['delitoCaso']){
            Logger.logColor('ANTES DE DELITO', 'orange',temCaso['delitoCaso']);
            for (let i = 0; i < temCaso.delitoCaso.length; i++){
                console.log(temCaso.delitoCaso[i]);
                if (temCaso.delitoCaso[i]['principal']){
                    temCaso['delitoPrincipal'] = temCaso.delitoCaso[i]['delito'];
                    break;
                }
            }
        }
        this.caso = temCaso;
        Logger.logColor('CASO@Update', 'purple', this.caso);
    }
}
/**
 * calse del caso, esta clase guarda la informacion importante del caso para poderla consultar en caso de que se pierda la conexion.
 */
export class Caso {

    public armas: any[];
    public descripcion: string;
    public hasRelacionVictimaImputado: boolean;
    public hasPredenuncia: boolean;
    public hasAcuerdoInicio: boolean;
    public entrevistas: any[];
    public created: number;
    public titulo: string;
    public nic: string;
    public vehiculos: any[];
    public estatus: string;
    public personaCasos: any[];
    public delitoPrincipal: any;
    public predenuncias: any;
    public acuerdoInicio:any;
    public delitoCaso: any[];
    public delito: string;
    public id: number;
    public lugares: any[];
    public nuc: string;
    public tipoRelacionPersonas: any[];
    public IdMexico = _config.optionValue.idMexico;
    public sintesis: string;
    public ultimaActualizacion: Date = null;
    public username: string;
    public estatusSincronizacion: string = undefined;


    public findPersonaCaso(_id) {
        const personas = this.personaCasos.filter(
            object => {
                return (object.id === _id);
            }
        );
        return personas[0];
    }

    public findVictima(){
        Logger.log('Caso@findVictima', this.personaCasos, _config.optionValue.tipoInterviniente.victima);
        let personas = this.personaCasos.filter(
            object => {
                return (object.tipoInterviniente.id === _config.optionValue.tipoInterviniente.victima
                    || object.tipoInterviniente.id === _config.optionValue.tipoInterviniente.victimaDesconocido);
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

    // Metódos de persona
    public getAlias(_persona) {
        Logger.log('Caso@getAlias()', _persona);
        if (_persona.persona.aliasNombrePersona.length > 0) {
            const nombres =  _persona.persona.aliasNombrePersona.map(object =>  object.nombre );
            return nombres.toString();
        } else {
            return '';
        }
    }

    public getDomicilios(_persona) {
        Logger.log('Caso@getDomicilios()', _persona);
        const domicilios: any[] = [];

        for (const localizacion of _persona.persona.localizacionPersona) {
            let domicilio = '';
            domicilio += ' ' + localizacion.calle;
            domicilio += ' ' + localizacion.noInterior;
            domicilio += ' ' + localizacion.noExterior;
            if (localizacion.colonia != null) {
                domicilio += ' ' + localizacion.colonia.nombre;
            }

            if (localizacion.municipio  != null) {
                domicilio += ' ' + localizacion.municipio.nombre;
            }
            if (localizacion.estado) {
                domicilio += ' ' + localizacion.estado.nombre;
            }

            domicilios.push(domicilio);
        }

        return domicilios.toString();
    }

    public optionsPersonasTipo(){
        let options: MOption[] = [];
        if(this.personaCasos){
            for(let i in this.personaCasos){
                if (this.personaCasos.hasOwnProperty(i)) {
                    let object = this.personaCasos[i];
                    let nombre = new PersonaNombre().transform(object);
                    nombre = nombre+" - "+this.personaCasos[i].tipoInterviniente.tipo;

                    options.push(
                        {value:this.personaCasos[i].id , label: nombre}
                    );
                }
            }
        }
        return options;
    }

    public optionsLugares(){
        let options: MOption[] = [];
        let complement;
        if (this.lugares) {
            for(let i in this.lugares){
                if (this.lugares.hasOwnProperty(i)) {
                    let paisId = this.lugares[i].pais.id;
                    if (paisId == this.IdMexico) {
                        complement = this.lugares[i].colonia.nombre+","+this.lugares[i].estado.nombre;
                    }else{
                        complement = this.lugares[i].coloniaOtro+","+this.lugares[i].estadoOtro;
                    }
                    Logger.logColor('<<< Lugares >>>','red',this.lugares[i]);
                    let lugar = this.lugares[i].detalleLugar.tipoLugar+" - "+this.lugares[i].calle+","+ ((this.lugares[i].noExterior != null) ? this.lugares[i].noExterior +"," : '')+complement;

                    options.push(
                        {value:this.lugares[i].id , label:lugar}
                    );
                }
            }
        }
        return options;
    }

    public optionsDelito() {
        let options: MOption[] = [];

        if (this.delitoCaso) {
            for (const i in this.delitoCaso) {
                if (this.delitoCaso.hasOwnProperty(i)) {
                    const object = this.delitoCaso[i];
                    options.push({value: object.id, label: object.delito.nombre});
                }
            }
        }

        options = this.sortOptions(options);

        return options;
    }

    public optionsArma() {
        let options: MOption[] = [];

        if (this.armas) {
            for (const i in this.armas) {
                if (this.armas.hasOwnProperty(i)) {
                    const object = this.armas[i];
                    const clase = object.claseArma != null  ? object.claseArma.claseArma  : '';
                    const tipo = object.claseArma.tipo != null  ? ' - ' + object.claseArma.tipo  : '';
                    options.push({value: object.id, label: `${clase} ${tipo}`});
                }
            }
        }

        options = this.sortOptions(options);

        return options;
    }

    public optionsVehiculo() {
        let options: MOption[] = [];

        if (this.vehiculos) {
            for (const i in this.vehiculos) {
                if (this.vehiculos.hasOwnProperty(i)) {
                    const object = this.vehiculos[i];
                    const marca = object.marcaSubmarca != null  ? (object.marcaSubmarca.marca ? object.marcaSubmarca.marca: 'SIN MARCA') : 'SIN MARCA';
                    const color = object.motivoRegistroColorClase != null  ? (object.motivoRegistroColorClase.color? object.motivoRegistroColorClase.color:'SIN COLOR') : 'SIN COLOR';
                    options.push({value: object.id, label: `${marca} ${color}`});
                }
            }
        }

        options = this.sortOptions(options);

        return options;
    }

    private sortOptions(_options) {
        _options.sort((a, b) => {
            if (a.label > b.label) {
                return 1;
            }
            if (a.label < b.label) {
                return -1;
            }

            return 0;
        });
        return _options;
    }

    public fromJSON(json) {
        for (var propName in json)
            this[propName] = json[propName];
        return this;
    }

}
