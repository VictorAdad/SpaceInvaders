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
@Injectable()
export class CIndexedDB {
    nameDB:string = "SIGI";
    init: boolean = (localStorage.getItem('initDB') === 'true');

    constructor() {
        if(!this.init){
            console.log("Creando tablas para la BD");
            var indexedDB = window.indexedDB ;
            var open = indexedDB.open(this.nameDB, 1);
            var obj=this;
            var newDB=false;
            open.onupgradeneeded = () => {
                console.log(" -> Inciando conexión a la BD");
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

                this.init = true;
                console.log(" -> Se crearon las tablas");
                localStorage.setItem('initDB', 'true');
                newDB=true;
            };
            open.onsuccess=function(){
                if (newDB)
                    obj.inicialiazaCatalogos();
            }
        }else{
            console.log("La BD ya se encuentra inicializada ;)");
            this.init = true;
            localStorage.setItem('initDB', 'true');
        }
    }

    inicialiazaCatalogos(){
        console.log("-> Inicializando carga de los catalogos");

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

    nextItem(i,arr, store){
        var obj=this;
        if (i<arr.length) {
            store.put(arr[i])
            this.nextItem(i+1,arr,store);
        } 
    }

    action(_table: string, _tipo:string, _data:any = null, _index:string=""){
        var obj= this;
        var promesa = new Promise( 
            function(resolve,reject){
                if(obj.init){
                    var indexedDB = window.indexedDB ;
                    var open = indexedDB.open(obj.nameDB, 1);
                    open.onsuccess = function() {
                        // Start a new transaction
                        var db    = open.result;
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
                                    //console.log("#",e);
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
                                //console.log(datos);
                                resolve(datos);
                            }
                        }else if(_tipo=="clear"){
                            var req = store.clear();
                            req.onsuccess = function(evt) {
                                console.log("Tabla "+_table+" limpiada");
                                resolve(true);
                            };
                        }
                        else{
                            let error=new Error("operacion no definida");
                            reject(error);
                        }      

                        
                        tx.oncomplete = function() {
                            db.close();
                            //console.log("-> cierra la conexion");
                        };
                    }
                }else{
                    console.warn("No se ha creado la tabla: ", _table, " Con la acción: ", _tipo);
                }
            }

        );
        return promesa;
    }
    /*
        TablaA -> tablaInermedia <- TablaB
        data: es un filtro de la tablaIntermedia con alguna llave de la TablaA.
        
        en una relacion muchos a muchos,
        donde ya se filtro la informacion de la tabla intermedia(es data)
        se quiere un array con la lista de elementos de la tabla que se relaciona
        donde solo se tiene la llave foranea key la cual se relaciona con la tabla con el idTabla.

        regresa el arreglo de elementos de tabla que cumplen con la condicion anteior.

        esto sirve para los paginadores
     */
    relationship(data:any[], key:string, tabla:string, idTabla:string){
        var obj= this;
        var promesa = new Promise(function(resolve,reject){
            obj.list(tabla).then(
                list=>{
                    var lista=list as any[];
                    var resultado=[];
                    for (var i = 0; i < data.length; ++i) {
                        for (var k = 0; k < lista.length; ++k) {
                            if( (data[i])[key]==(lista[k])[idTabla]){
                                (data[i])[tabla]=lista[k];
                                resultado.push(lista[k]);
                                break;
                            }
                        }
                    }
                    resolve(resultado);
            }).catch(e=>{
                reject(e);
            });

        });
        return promesa;
    }
    /*
        funcion que lista los elementos de una relacion de muchos a muchos
        nota: tiene que existir el indice de la tabla de relacion que busque por la keyRelacionFuerte
     */
    manyToManyAll(tablaFuerte:string, keyFuerte:string, 
        tablaDeRelacion:string, keyRelacionFuerte:string, keyRelacionDevil:string,
        tablaDevil:string, keyDevil:string){
        var obj=this;
        var promesa= new Promise((resolve,reject)=>{
            //notacion camello del indice
            var indice="indice"+tablaDeRelacion[0].toUpperCase();
            for (var i = 1; i < tablaDeRelacion.length; ++i)
                indice=indice+tablaDeRelacion[i];
            console.log("@indice",indice);

            obj.list(tablaFuerte).then(datosFuertes => {
                var listaFuerte = datosFuertes as any[];
                var k=0;
                for (var item of listaFuerte) {
                    //obtenemos el primer filtrado
                    obj.get(tablaDeRelacion,item[keyFuerte],indice).then(datosRelcion=>{
                
                        obj.relationship(datosRelcion as any[], keyRelacionDevil,tablaDevil,keyDevil)
                            .then(datosDeviles=>{
                                item[tablaDevil]=datosDeviles;
                                k++;
                                if(k==listaFuerte.length){
                                    resolve(listaFuerte);
                                }
                            });
                
                    });
                }
            });
        });
        return promesa;
        
    }
    //data tienen que ser un json
    add(_table:string, _datos:any){
        return this.action(_table, "add", _datos) 
    }
    //data tienen que ser un json
    update(_table:string, _datos:any){
        return this.action(_table, "update", _datos);  
    }
    //llave a eliminar
    delete(_table:string, _key:any){
        return this.action(_table, "delete", _key);
    }
    list(_table:string){
        return this.action(_table, "list");
    }
    //es 
    get(_table:string, _key:any, _index:string=""){
        return this.action(_table, "get", _key,_index);
    }

    //limpia la tabla
    clear(_table:string){
        return this.action(_table, "clear");
    }

    //busca en catalogo
    searchInCatalogo(_catalogo, _item){
        var obj= this;
        var promesa = new Promise( 
            function(resolve,reject){
                obj.get("catalogos",_catalogo).then(lista=>{
                    let arreglo=lista["arreglo"] as any[];
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

}