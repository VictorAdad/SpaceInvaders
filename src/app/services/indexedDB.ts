import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
                db.createObjectStore("delitos", {keyPath: "id"});
                let catDel= db.createObjectStore("catalogoDelitos", {keyPath: "id"});
                catDel.createIndex("indiceCatalogoDelito", "clasificacionId");
                catDel.createIndex("indiceCatalogoDelitoAll", ["clasificacionId","clave","descripcion"]);
                
                db.createObjectStore("clasificacionDelitos", {keyPath: "id"});
                let r_catDel_del=db.createObjectStore("catalogoDelitos_delitos", {keyPath: "id"});
                r_catDel_del.createIndex("indiceCatalogoDelito_delitos", "delitoId");
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
            
            //inicializacion 
            var tx    = db.transaction(["clasificacionDelitos","catalogoDelitos"], "readwrite");
            var tabla = tx.objectStore("clasificacionDelitos");
            var arrClaDel=[
                {id:1, clasificacion: "Clasificacion 1"},
                {id:2, clasificacion: "Clasificacion 2"},
                {id:3, clasificacion: "Clasificacion 3"}
            ];
            obj.nextItem(0,arrClaDel,tabla);

            var tabla = tx.objectStore("catalogoDelitos");
            var arrCatalogoDelitos=[
                {id:1, clasificacionId: 1, clave: "CVE. 1.1", descripcion:"Robo A"},
                {id:2, clasificacionId: 1, clave: "CVE. 1.2", descripcion:"Robo B"},
                {id:3, clasificacionId: 1, clave: "CVE. 1.3", descripcion:"Robo C"},
                {id:4, clasificacionId: 2, clave: "CVE. 2.1", descripcion:"Robo D"},
                {id:5, clasificacionId: 3, clave: "CVE. 3.1", descripcion:"Robo E"},
                {id:6, clasificacionId: 3, clave: "CVE. 3.2", descripcion:"Robo F"},
            ];
            obj.nextItem(0,arrCatalogoDelitos,tabla);

            //cerramos todas las conexiones
            tx.oncomplete = function() {
                db.close();
                console.log("-> Finalizado carga de los catalogos");
            }
            

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
                                    console.log("#",e);
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
                                console.log(datos);
                                resolve(datos);
                            }
                        }
                        else{
                            let error=new Error("operacion no definida");
                            reject(error);
                        }      

                        
                        tx.oncomplete = function() {
                            db.close();
                            console.log("-> cierra la conexion");
                        };
                    }
                }else{
                    console.warn("No se ha creado la tabla: ", _table, " Con la acción: ", _tipo);
                }
            }

        );
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

}