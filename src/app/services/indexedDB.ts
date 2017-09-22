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
            open.onupgradeneeded = () => {
                console.log(" -> Inciando conexión a la BD");
                var db    = open.result;
                db.createObjectStore("casos", {keyPath: "id"})
                db.createObjectStore("personas", {keyPath: "id"});
                console.log(" -> Se crearon las tablas");
                this.init = true;
                localStorage.setItem('initDB', 'true');
            };
        }else{
            console.log("La BD ya se encuentra inicializada ;)");
            this.init = true;
            localStorage.setItem('initDB', 'true');
        }
    }

    action(_table: string, _tipo:string, _data:any = null){
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
                            console.log("ok");
                            var requets=store.get(_data);
                            requets.onsuccess=function(){
                                resolve(requets.result);
                            }
                            requets.onerror = function() {
                                resolve(null);
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
    get(_table:string, _key:any){
        return this.action(_table, "get", _key);
    }

}