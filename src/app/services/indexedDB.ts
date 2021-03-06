import { Injectable }                  from '@angular/core';
import { Observable }                  from 'rxjs/Observable';
import {arrCARA_NARIZ}                 from '@models/datos/cara';
import {arrOreja}                      from '@models/datos/oreja';
import {arrCOMPLEXION_PIEL_SANGRE}     from'@models/datos/complexionPielSangre';
import {arrFRENTE_MENTON}              from '@models/datos/frenteMenton';
import {arrCEJA_BOCA}                  from '@models/datos/cejaBoca';
import {arrCABELLO}                    from '@models/datos/cabello';
import {arrLABIO_OJO}                  from '@models/datos/labioOjo';
import {arrDETALLE_LUGAR}              from '@models/datos/detalleLugar';
import {arrMARCA_SUBMARCA}             from '@models/datos/marcaSubmarca';
import {arrPROCEDENCIA_ASEGURADORA}    from '@models/datos/procedenciaAseguradora';
import {arrMOTIVO_REGISTRO_COLOR_CLASE}from '@models/datos/motivoColorClase';
import {arrTIPO_USO_TIPO_VEHICULO}     from '@models/datos/tipoUsoTipoVehiculo';
import {arrCLASE_ARMA}                 from '@models/datos/claseArma';
import {arrCALIBRE_MECANISMO}          from '@models/datos/calibreMecanismo';
import {arrDESPARAICION_CONSUMACION}   from '@models/datos/desaparicionConsumacion';
import {arrVIOLENCIA_GENERO}           from '@models/datos/violenciaGenero';
import {arrEFECTO_DETALLE}             from '@models/datos/efectoDetalle';
import {arrTIPO_TRANSPORTACION}        from '@models/datos/tipoTrasportacion';
import {arrCONDUCTA_DETALLE}           from '@models/datos/conductaDetalle';
import {arrMODALIDAD_AMBITO}           from '@models/datos/modalidadAmbito';
import {arrNACIONALIDAD_RELIGION}      from '@models/datos/nacionalidadReligion';
import {arrIDIOMA_IDENTIFICACION} from '@models/datos/idiomaIdentificacion';
import {SincronizaCatalogos} from "@services/onLine/sincronizaCatalogos";
import { HttpService} from '@services/http.service';
import { DialogSincrinizarService} from "@services/onLine/dialogSincronizar.service";
import { Logger } from "@services/logger.service";
import { _config} from '@app/app.config';

/**
 * Servicio para manejar a indexedDB.
 */
@Injectable()
export class CIndexedDB {
    nameDB:string = _config.offLine.indexedDB.nameDB;
    init: boolean = (localStorage.getItem('initDB') === 'true');
    sincronizarCatalogos:SincronizaCatalogos;
    db=null;
    /**
     * Constructor de indexedDB. Verifica si existe la base SIGI, si no existe crea todo el schema de tablas necesarias para que funcione.
     * @param http Instancia http, es necesario para pasar a la clase de SincronizaCatalogos
     * @param dialog Instancia del dialogo para manejar preguntas. es necesario para SincronizaCatalogos
     */
    constructor(private http:HttpService, 
        public dialog: DialogSincrinizarService) {
        var obj=this;
        this.sincronizarCatalogos=new SincronizaCatalogos(this,http,dialog);
        var indexedDB = window.indexedDB ;
        var open = indexedDB.open(this.nameDB, 1);
        var obj=this;
        if(!this.init){
            var newDB=false;
            Logger.log("Creando tablas para la BD");
            //si no existe la base o se actualiza la version se crea todo el schema
            open.onupgradeneeded = () => {
                Logger.log(" -> Inciando conexión a la BD");
                var db    = open.result;
                db.createObjectStore("casos", {keyPath: "id"})
                db.createObjectStore("personas", {keyPath: "id"});
                db.createObjectStore("documentos", {keyPath: "id"});
                db.createObjectStore("catalogos",{keyPath:"id"});
                //db.createObjectStore("delitos", {keyPath: "id"});
                // let catDel= db.createObjectStore("catalogoDelitos", {keyPath: "id"});
                // catDel.createIndex("indiceCatalogoDelito", "clasificacionId");
                // catDel.createIndex("indiceCatalogoDelitoAll", ["clasificacionId","clave","descripcion"]);
                
                // db.createObjectStore("clasificacionDelitos", {keyPath: "id"});
                // let r_catDel_del=db.createObjectStore("catalogoDelitos_delitos", {keyPath: "id"});
                // r_catDel_del.createIndex("indiceCatalogoDelitos_delitos", "delitoId");

                /*
                    A qui se guardaran los datos a sincronizar, cada vez que se restablesca la conexion
                    se buscara en esta tabla.
                    los campo son:
                        id, 
                        url:, 
                        body:, 
                        parametros,
                        newId: es el id del objecto que se acaba de sincronizar,solo existe si ya se sincronizo
                        dependeDe: este campo existe solo cuando depende de otra sincronizacion, este campo indica el id de la tabla sincronizacion del cual depende esta sincronizacion y utilizara el newId para hacer las peticiones al servidor
                 */
                db.createObjectStore("sincronizar", {keyPath: "id"});
                db.createObjectStore("newId", {keyPath: "id"});
                db.createObjectStore("blobs", {keyPath: "id"});
                db.createObjectStore("catalogoLlave", {keyPath: "id"});
                db.createObjectStore("lastLogin", {keyPath: "user"});


                this.init = true;
                Logger.log(" -> Se crearon las tablas");
                localStorage.setItem('initDB', 'true');
                newDB=true;
                obj.db    = open.result;
                obj.sincronizarCatalogos.nuevo();
            };            
        }else{
            Logger.log("La BD ya se encuentra inicializada ;)");
            this.init = true;
            localStorage.setItem('initDB', 'true');
        }
        open.onsuccess=function(){
            obj.db    = open.result;
            Logger.logColor("wiii","cyan",obj);
        }
    }
    /**
     * Funcion para inicializar los catalogos de forma manual. Esto era para trabajar con datos dummies, ya no es necesaria.
     */
    inicialiazaCatalogos(){
        Logger.log("-> Inicializando carga de los catalogos");

        var obj= this;
        var indexedDB = window.indexedDB ;
        var open = indexedDB.open(obj.nameDB, 1);
        open.onsuccess = function() {
            var db    = open.result;
            
            var arrCatalogoDelitos=[
                {id:1, clasificacion: "robo", nombre: "Robo con arma de fuego", activo:true, created:new Date(), created_by:1, updated:new Date(), updated_by:1},
                {id:2, clasificacion: "robo", nombre: "Robo con arma de fuego y li¡ujo de violencia", activo:true, created:new Date(), created_by:1, updated:new Date(), updated_by:1},
                {id:3, clasificacion: "extorción", nombre: "Extorción de ...", activo:true, created:new Date(), created_by:1, updated:new Date(), updated_by:1},
                {id:4, clasificacion: "extorción", nombre: "Extorción de ...", activo:true, created:new Date(), created_by:1, updated:new Date(), updated_by:1},
                {id:5, clasificacion: "Yolo", nombre: "Delito doloso", activo:true, created:new Date(), created_by:1, updated:new Date(), updated_by:1},
                {id:6, clasificacion: "Yolo", nombre: "Delito por omisión", activo:true, created:new Date(), created_by:1, updated:new Date(), updated_by:1},
            ];
            obj.update("catalogos",{id:"delitos", arreglo:arrCatalogoDelitos});
            //obj.nextItem(0,arrCatalogoDelitos,tabla);
           

            obj.update("catalogos",{id:"oreja", arreglo:arrOreja.arreglo});
            obj.update("catalogos",{id:"cara_nariz",arreglo:arrCARA_NARIZ.arreglo});
            obj.update("catalogos",{id:"complexion_piel_sangre",arreglo:arrCOMPLEXION_PIEL_SANGRE.arreglo});
            obj.update("catalogos",{id:"frente_menton",arreglo:arrFRENTE_MENTON.arreglo});
            obj.update("catalogos",{id:"ceja_boca",arreglo:arrCEJA_BOCA.arreglo});
            obj.update("catalogos",{id:"cabello",arreglo:arrCABELLO.arreglo});
            obj.update("catalogos",{id:"labio_ojo",arreglo:arrLABIO_OJO.arreglo});
            obj.update("catalogos",{id:"nacionalidad_religion",arreglo:arrNACIONALIDAD_RELIGION.arreglo});
            obj.update("catalogos",{id:"idioma_identificacion",arreglo:arrIDIOMA_IDENTIFICACION.arreglo});
            

            obj.update("catalogos",{id:"detalle_lugar",arreglo:arrDETALLE_LUGAR.arreglo});
            
            obj.update("catalogos",{id:"marca_submarca",arreglo:arrMARCA_SUBMARCA.arreglo});
            obj.update("catalogos",{id:"procedencia_aseguradora",arreglo:arrPROCEDENCIA_ASEGURADORA.arreglo});
            obj.update("catalogos",{id:"motivo_color_clase",arreglo:arrMOTIVO_REGISTRO_COLOR_CLASE.arreglo});
            obj.update("catalogos",{id:"tipo_uso_tipo_vehiculo",arreglo:arrTIPO_USO_TIPO_VEHICULO.arreglo});
            
            obj.update("catalogos",{id:"clase_arma",arreglo:arrCLASE_ARMA.arreglo});
            obj.update("catalogos",{id:"calibre_mecanismo",arreglo:arrCALIBRE_MECANISMO.arreglo});

            obj.update("catalogos",{id:"desaparicion_consumacion",arreglo:arrDESPARAICION_CONSUMACION.arreglo});
            obj.update("catalogos",{id:"violencia_genero",arreglo:arrVIOLENCIA_GENERO.arreglo});
            obj.update("catalogos",{id:"efecto_detalle",arreglo:arrEFECTO_DETALLE.arreglo});
            obj.update("catalogos",{id:"tipo_transportacion",arreglo:arrTIPO_TRANSPORTACION.arreglo});
            obj.update("catalogos",{id:"conducta_detalle",arreglo:arrCONDUCTA_DETALLE.arreglo});
            obj.update("catalogos",{id:"modalidad_ambito",arreglo:arrMODALIDAD_AMBITO.arreglo});
            
            
            
        }  
    }
    /**
     * Funcion recursiva para agregar los elemenos del arreglo dentro de la tabla de catalogos, era usadapara cargar datos dummies.
     * @param i indice del arreglo
     * @param arr arreglo con catalogos
     * @param store objecto al que se agregaran los datos del arreglo.
     */
    nextItem(i,arr, store){
        var obj=this;
        if (i<arr.length) {
            store.put(arr[i])
            this.nextItem(i+1,arr,store);
        } 
    }
    /**
     * Esta es la funcion más importante para manejar los accesos a indexedDB. basicamente maneja los insert, update, delete y list
     * @param _table Tabla a la que se accedera
     * @param _tipo tipo de operacion
     * @param _data parametro opcional, trae la informacion que se guardara, actualizara o eliminara. dependiendo del contesto es un kson o una llave(numero).
     * @param _index parametro opcional. Es el nombre del indice a usar para realizar la busqueda.
     */
    action(_table: string, _tipo:string, _data:any = null, _index:string=""){
        var obj= this;
        var promesa = new Promise( 
            function(resolve,reject){
                if (!obj.db){
                    let timer = Observable.timer(1000);
                    timer.subscribe(t=>{
                        Logger.log("Vuelve a llamar");
                        obj.action(_table,_tipo,_data,_index).then(d=>{
                            resolve(d);
                        }).catch(e=>{
                            reject(e);
                        })  
                    })
                }
                else if(obj.init){
                    // var indexedDB = window.indexedDB ;
                    // var open = indexedDB.open(obj.nameDB, 1);
                    // open.onblocked = function(e){
                    //     Logger.logColor("INDEXEDDB BLOQUEDO","red",e);
                    // }
                    //open.onsuccess = function() {
                        // Start a new transaction
                        //Logger.logColor("BASE","green",_table)
                        var db    = obj.db;
                        var tx    = db.transaction(_table, "readwrite");
                        var store = tx.objectStore(_table);

                        let json = _data;
                        if (_tipo=="add"){
                            json.id = Date.now();
                            store.put(json);
                            resolve(json);
                        }else if(_tipo=="get"){
                            if (_index==""){
                                var requets=store.get(_data);
                                requets.onsuccess=function(){
                                    resolve(requets.result);
                                }
                                requets.onerror = function() {
                                    resolve(null);
                                }
                            }else{
                                var index = store.index(_index);
                                //data tiene que ser un objeto del tipo IDBKeyRange
                                var requets=index.openCursor(_data);
                                //var requets=index.get();
                                var resultado=[];
                                requets.onsuccess=function(e){
                                    Logger.log("#",e);
                                    var cursor = e.target.result;
                                    if(cursor) {
                                        resultado.push(cursor.value);
                                        cursor.continue();
                                    } else {
                                      resolve(resultado);
                                    }
                                    
                                }
                                requets.onerror = function() {
                                    resolve(null);
                                }
                            }
                            
                        }
                        else if(_tipo=="update"){
                            store.put(json);
                            resolve(json);
                        }else if(_tipo=="delete"){
                            var requets=store.delete(_data);
                            requets.onsuccess=function(e){
                                resolve(true);
                            }
                            requets.onerror = function() {
                                resolve(false);
                            }
                        }else if(_tipo=="list"){
                            var list=store.getAll();
                            list.onsuccess=function(){
                                var datos=list.result;
                                //Logger.log(datos);
                                resolve(datos);
                            }
                        }else if(_tipo=="clear"){
                            var req = store.clear();
                            req.onsuccess = function(evt) {
                                Logger.log("Tabla "+_table+" limpiada");
                                resolve(true);
                            };
                        }
                        else{
                            let error=new Error("operacion no definida");
                            reject(error);
                        }      

                        
                        tx.oncomplete = function() {
                            //Logger.logColor("-> cierra la transaction","blue",_table);
                        };
                    //}
                }else{
                    reject("Init es false y la bd no esta inicializada");
                    Logger.warn("No se ha creado la tabla: ", _table, " Con la acción: ", _tipo);
                }
            }

        );
        return promesa;
    }
    /**
     * Esta funcion manda el error o la actualizacion hasta que se desocupa la transacion
     * @param _table Tabla que se actualizara
     * @param data json con los cambios
     */
    update2(_table,_data){
        if (_table=='casos'){
            _data = JSON.parse( JSON.stringify(_data));
        }
        var obj=this;
        var promesa = new Promise( 
            function(resolve,reject){
                if (!obj.db){
                    let timer = Observable.timer(1000);
                    timer.subscribe(t=>{
                        obj.update2(_table,_data).then(d=>{
                            Logger.log("Vuelve a llamar",d);
                            resolve(d);
                        }).catch(e=>{
                            reject(e);
                        })  
                    })
                }
                else if(obj.init){
                        //Logger.logColor("BASE","green",_table)
                        var db    = obj.db;
                        var tx    = db.transaction(_table, "readwrite");
                        var store = tx.objectStore(_table);

                        var updateTitleRequest = store.put(_data);

                        updateTitleRequest.onsuccess = function() {
                            resolve(_data);
                        };
                        updateTitleRequest.onerror = function(){
                            reject('Ocurrio un error');
                        }
                        tx.oncomplete = function() {
                            
                            //Logger.log("-> cierra la conexion");
                        };
                    //}
                }else{
                    reject("Init es false y la bd no esta inicializada");
                    Logger.warn("No se ha creado la tabla: ", _table, " Con la acción: update");
                }
            });
        return promesa;
    }
    /**
     * Esta funcion es para que no muera la app cuando se desea actualizar un registro y se esta actualizando otro. mejor actualizamos todo con una sola transacion.
     * @param _table Tabla que se actualizara
     * @param cambios arreglo con los cambios
     */
    actualizaCambios(_table,cambios){
        var obj=this;
        return new Promise((resolve,reject) =>{
            if(obj.init){
                Logger.logColor("BASE","green",_table)
                var db    = obj.db;
                var tx    = db.transaction(_table, "readwrite");
                var store = tx.objectStore(_table);

                for( var i=0;i<cambios.length;i++)
                    store.put(cambios[i]);
                
                tx.oncomplete = function() {
                    //db.close();
                    resolve(cambios);
                    //Logger.log("-> cierra la conexion");
                };
            //}
            }else{
                reject("No se ha creado la tabla: " +  _table + " Con la acción: update");
            }
        });
    }
    /**
     * Agrega un registro a la tabla _table
     * @param _table tabla con la que se trabajara
     * @param _datos datos a guardar
     * @return Una promesa que devuelve los datos agregados o el error
     */
    add(_table:string, _datos:any){
        if (_table=='casos'){
            _datos = JSON.parse( JSON.stringify(_datos));
        }
        return this.action(_table, "add", _datos) 
    }
    /**
     * Actualiza un registro a la tabla _table
     * @param _table tabla con la que se trabajara
     * @param _datos datos a guardar
     * @return Una promesa que devuelve los datos agregados o el error
     */
    update(_table:string, _datos:any){
        return this.update2(_table,_datos);
        //return this.action(_table, "update", _datos);  
    }
    /**
     * Funcion que elimina un registro a la tabla _table
     * @param _table tabla con la que se trabajara
     * @param _key elemento a eliminar
     * @return Una promesa que devuelve true si se elimina o false si no se pudo
     */
    delete(_table:string, _key:any){
        return this.action(_table, "delete", _key);
    }
    /**
     * Funcion que lista los elementos de latabla dada
     * @param _table tabla con la que trabajara
     * @return una promesa que devuelve la lista de elementos de la tabla dada o el error
     */
    list(_table:string){
        return this.action(_table, "list");
    }
    /**
     * Funcion busca un elemento en la tabla dada.
     * @param _table tabla con la que se trabajara
     * @param _key llave a buscar
     * @param _index Parametro opcional el cual sirve para indicar que se utilice algun indice si es que existe alguno.
     * @return una promesa que contienen el elemento encontrado o el error
     */
    get(_table:string, _key:any, _index:string=""){
        return this.action(_table, "get", _key,_index);
    }

    /**
     * Funcion para eliminar el contenido de una tabla
     * @return devuelve una promesa que contienen true o el error.
     */
    clear(_table:string){
        return this.action(_table, "clear");
    }
    /**
     * busca en matrices el elemento exacto
     * @param _catalogo catalogo a buscar en la tabla de catalogo
     * @param _item elemento a buscar
     * @example NOTA
     * Si necesita buscar una entrada exacta en una matrix puede usar esta funcion.
     */
    searchInCatalogo(_catalogo, _item){
        //Logger.log("%cCatalogo","color:red;",_catalogo,_item);
        var obj= this;
        var promesa = new Promise( 
            function(resolve,reject){
                obj.get("catalogos",_catalogo).then(lista=>{
                    var arreglo=lista["arreglo"] as any[];
                    if ((lista["arreglo"])["data"])
                        arreglo = (lista["arreglo"])["data"] as any[];
                    let igual;
                    for (var i = 0; i<arreglo.length; i++) {
                        igual=true;
                        for(let key in _item){
                            igual=igual&&(_item[key]==(arreglo[i])[key]);
                        }
                        if (igual){
                            resolve(arreglo[i]);
                            break;
                        }
                    }
                    if (!igual)
                        resolve(null);
                });

            });
        return promesa;
    }
    /**
     * busca en los catalogos los item que son exactos con los datos de item.
     * @param _catalogo catalogo a buscar
     * @param _item elemento a buscar
     * @param like 
     * @return regresa una promesa con las coincidencias o el error.
     * @example NOTA
     * Si necesita buscar los municipios del estado de mexico hay que utilizar esto
     */
    searchInNotMatrx(_catalogo, _item, like=false){
        /**
        buscamos si el elemento y del catalogo es igual a e 
        */
        var rec=function(e,y) {
            if((typeof e)=="object"){
                let igual=true;
                for (var element in e){
                    if (y[element])
                        igual=igual&&rec(e[element],y[element]);
                }
                return igual;
            }
            if (!like)
                return e==y;
            if(e=="")
                return true;
            //Logger.log(y,e);
            return y.toUpperCase().indexOf(e.toUpperCase())>0;
            
        }
        var obj= this;
        var promesa = new Promise( 
            function(resolve,reject){
                obj.get("catalogos",_catalogo).then(lista=>{
                    var arreglo=lista["arreglo"] as any[];
                    if ((lista["arreglo"])["data"])
                        arreglo = (lista["arreglo"])["data"] as any[];
                    var conincidencias=[];
                    for (var i = 0; i<arreglo.length; i++) {
                        let igual=rec(_item,arreglo[i]);
                        if (igual)
                            conincidencias.push(arreglo[i]);
                    }
                    resolve(conincidencias);
                });

            });
        return promesa;
    }
    buscaIDsEnJson(json){
        var arregloIds=[];
        var rec=function(item){
           if (typeof item =="object"){
                for (var obj in item){
                    if (obj=="id"){
                        arregloIds.push(obj);
                    }else
                        rec(item[obj])
                }
            }
        }
        rec(json);
        return arregloIds;

    }

}
