import { Observable } from 'rxjs/Observable';
export class CIndexedDB {
    nameDB:string;
    table:string;
    public result:any;
    constructor(nameDB:string, table:string) {
        this.nameDB=nameDB;
        this.table = table;
        this.result=null;
    }
    action(tipo:string, data:any = null){
        var obj= this;
        var promesa = new Promise( 
            function(resolve,reject){
                var indexedDB = window.indexedDB ;
                var open = indexedDB.open("M"+obj.nameDB, 1);
                open.onupgradeneeded = function() {
                    console.log(" -> iniciando");
                    var db    = open.result;
                    var store = db.createObjectStore("M"+obj.table, {keyPath: "id"});
                    var index = store.createIndex("Index"+obj.table, ["id"]);
                    console.log(" -> Se creo tabla");
                };
                open.onsuccess = function() {
                    // Start a new transaction
                    var db = open.result;
                    var tx = db.transaction("M"+obj.table, "readwrite");
                    var store = tx.objectStore("M"+obj.table);

                    let json = data;
                    if (tipo=="add"){
                        json.id = Date.now();
                        store.put(json);
                        resolve(json);
                    }else if(tipo=="get"){
                        console.log("ok");
                        var requets=store.get(data);
                        requets.onsuccess=function(){
                            resolve(requets.result);
                        }
                        requets.onerror = function() {
                            resolve(null);
                        }
                    }
                    else if(tipo=="update"){
                        store.put(json);
                        resolve(json);
                    }else if(tipo=="delete"){
                        var requets=store.delete(data);
                        requets.onsuccess=function(e){
                            resolve(true);
                        }
                        requets.onerror = function() {
                            resolve(false);
                        }
                    }else if(tipo=="list"){
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

            }
        );
        return promesa;
    }
    //data tienen que ser un json
    add(datos:any){
        return this.action("add", datos) 
    }
    //data tienen que ser un json
    update(datos:any){
        return this.action("update", datos);  
    }
    //llave a eliminar
    delete(key:any){
        return this.action("delete",key);
    }
    list(){
        return this.action("list");
    }
    //es 
    get(key:any){
        return this.action("get",key);
    }

}