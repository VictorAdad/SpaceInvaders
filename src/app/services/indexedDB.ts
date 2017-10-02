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
                db.createObjectStore("documentos", {keyPath: "id"});
                db.createObjectStore("catalagos",{keyPath:"id"});
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
            obj.update("catalagos",{id:"delitos", arreglo:arrCatalogoDelitos});
            //obj.nextItem(0,arrCatalogoDelitos,tabla);
            var arrOreja=[
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 0, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 1, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 2, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 3, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 4, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 5, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 6, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 7, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 8, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 9, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 10, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 11, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 12, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 13, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 14, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 15, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 16, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 17, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 18, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 19, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 20, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 21, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 22, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 23, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 24, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 25, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 26, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 27, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 28, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 29, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 30, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 31, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 32, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 33, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 34, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 35, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 36, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 37, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 38, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 39, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 40, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 41, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 42, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 43, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 44, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 45, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 46, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 47, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 48, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 49, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 50, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 51, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 52, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 53, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 54, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 55, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 56, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 57, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 58, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 59, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 60, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 61, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 62, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 63, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 64, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 65, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 66, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 67, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 68, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 69, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 70, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 71, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 72, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 73, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 74, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 75, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 76, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 77, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 78, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 79, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 80, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 81, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 82, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 83, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 84, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 85, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 86, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 87, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 88, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 89, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 90, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 91, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 92, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 93, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 94, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 95, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 96, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 97, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 98, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 99, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 100, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 101, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 102, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 103, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 104, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 105, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 106, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 107, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 108, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 109, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 110, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 111, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 112, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 113, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 114, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 115, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 116, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 117, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 118, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 119, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 120, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 121, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 122, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 123, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 124, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 125, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 126, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 127, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 128, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 129, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 130, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 131, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 132, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 133, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 134, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 135, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 136, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 137, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 138, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 139, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 140, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 141, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 142, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 143, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 144, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 145, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 146, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 147, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 148, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 149, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 150, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 151, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 152, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 153, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 154, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 155, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 156, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 157, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 158, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 159, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 160, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 161, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 162, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 163, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 164, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 165, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 166, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 167, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 168, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 169, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 170, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 171, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 172, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 173, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 174, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 175, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 176, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 177, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 178, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 179, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 180, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 181, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 182, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 183, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 184, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 185, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 186, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 187, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 188, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 189, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 190, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 191, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 192, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 193, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 194, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 195, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 196, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 197, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 198, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 199, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 200, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 201, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 202, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 203, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 204, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 205, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 206, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 207, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 208, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 209, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 210, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 211, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 212, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 213, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 214, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 215, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 216, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 217, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 218, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 219, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 220, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 221, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 222, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 223, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 224, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 225, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 226, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 227, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 228, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 229, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 230, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 231, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 232, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 233, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 234, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 235, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 236, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 237, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 238, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 239, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 240, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 241, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 242, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 243, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 244, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 245, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 246, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 247, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 248, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 249, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 250, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 251, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 252, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 253, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 254, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 255, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 256, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 257, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 258, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 259, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 260, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 261, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 262, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 263, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 264, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 265, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 266, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 267, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 268, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 269, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 270, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 271, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 272, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 273, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 274, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 275, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 276, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 277, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 278, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 279, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 280, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 281, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 282, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 283, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 284, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 285, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 286, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 287, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 288, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 289, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 290, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 291, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 292, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 293, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 294, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 295, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 296, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 297, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 298, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 299, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 300, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 301, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 302, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 303, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 304, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 305, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 306, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 307, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 308, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 309, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 310, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 311, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 312, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 313, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 314, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 315, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 316, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 317, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 318, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 319, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 320, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 321, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 322, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 323, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 324, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 325, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 326, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 327, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 328, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 329, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 330, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 331, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 332, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 333, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 334, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 335, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 336, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 337, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 338, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 339, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 340, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 341, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 342, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 343, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 344, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 345, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 346, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 347, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 348, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 349, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 350, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 351, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 352, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 353, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 354, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 355, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 356, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 357, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 358, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 359, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 360, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 361, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 362, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 363, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 364, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 365, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 366, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 367, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 368, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 369, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 370, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 371, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 372, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 373, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 374, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 375, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 376, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 377, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 378, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 379, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 380, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 381, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 382, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Redonda', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 383, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 384, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 385, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 386, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 387, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 388, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 389, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 390, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 391, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 392, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 393, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 394, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 395, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 396, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 397, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 398, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 399, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 400, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 401, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 402, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 403, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 404, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 405, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 406, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 407, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 408, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 409, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 410, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 411, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 412, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 413, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 414, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 415, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 416, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 417, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 418, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 419, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 420, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 421, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 422, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 423, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 424, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 425, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 426, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 427, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 428, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 429, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 430, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 431, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 432, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 433, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 434, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 435, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 436, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 437, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 438, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 439, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 440, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 441, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 442, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 443, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 444, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 445, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 446, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 447, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 448, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 449, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 450, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 451, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 452, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 453, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 454, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 455, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 456, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 457, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 458, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 459, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 460, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 461, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 462, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 463, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 464, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 465, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 466, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 467, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 468, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 469, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 470, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 471, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 472, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 473, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 474, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 475, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 476, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 477, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 478, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 479, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 480, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 481, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 482, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 483, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 484, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 485, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 486, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 487, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 488, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 489, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 490, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 491, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 492, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 493, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 494, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 495, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 496, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 497, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 498, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 499, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 500, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 501, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 502, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 503, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 504, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 505, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 506, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 507, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 508, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 509, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 510, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 511, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 512, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 513, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 514, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 515, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 516, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 517, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 518, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 519, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 520, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 521, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 522, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 523, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 524, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 525, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 526, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 527, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 528, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 529, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 530, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 531, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 532, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 533, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 534, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 535, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 536, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 537, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 538, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 539, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 540, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 541, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 542, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 543, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 544, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 545, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 546, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 547, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 548, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 549, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 550, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 551, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 552, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 553, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 554, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 555, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 556, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 557, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 558, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 559, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 560, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 561, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 562, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 563, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 564, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 565, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 566, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 567, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 568, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 569, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 570, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 571, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 572, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 573, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 574, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'Si', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 575, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 576, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 577, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 578, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 579, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 580, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 581, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 582, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 583, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 584, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 585, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 586, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 587, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 588, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 589, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 590, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 591, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 592, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 593, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 594, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 595, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 596, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 597, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 598, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 599, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 600, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 601, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 602, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 603, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 604, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 605, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 606, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 607, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 608, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 609, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 610, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 611, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 612, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 613, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 614, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 615, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 616, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 617, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 618, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 619, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 620, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 621, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 622, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 623, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 624, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 625, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 626, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 627, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 628, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 629, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 630, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 631, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 632, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 633, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 634, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 635, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 636, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 637, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 638, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 639, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 640, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 641, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 642, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 643, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 644, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 645, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 646, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 647, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 648, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 649, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 650, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 651, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 652, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 653, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 654, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 655, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 656, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 657, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 658, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 659, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 660, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 661, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 662, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 663, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 664, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 665, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 666, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 667, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 668, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 669, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 670, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'Si', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 671, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 672, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 673, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 674, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 675, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 676, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 677, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 678, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 679, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 680, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 681, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 682, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 683, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 684, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 685, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 686, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 687, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 688, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 689, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 690, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 691, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 692, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 693, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 694, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 695, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 696, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 697, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 698, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 699, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 700, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 701, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 702, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 703, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 704, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 705, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 706, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 707, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 708, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 709, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 710, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 711, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 712, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 713, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 714, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 715, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 716, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 717, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 718, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'Si', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 719, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 720, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 721, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 722, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 723, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 724, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 725, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 726, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 727, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 728, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 729, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 730, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 731, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 732, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 733, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 734, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 735, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 736, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'Si', 'id': 737, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 738, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 739, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 740, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 741, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 742, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'Si', 'lobuloAdherencia': 'No', 'id': 743, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 744, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 745, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 746, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 747, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 748, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 749, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 750, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 751, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 752, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 753, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 754, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'Si', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 755, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 756, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 757, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 758, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 759, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 760, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'Si', 'id': 761, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 762, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 763, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 764, 'lobuloParticular': 'Si'} ,
                {'lobuloDimension': 'chico', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 765, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Mediano', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 766, 'lobuloParticular': 'No'} ,
                {'lobuloDimension': 'Grande', 'forma': 'Eliptica', 'helixSuperior': 'No', 'helixPosterior': 'No', 'lobuloContorno': 'No', 'helixOriginal': 'No', 'helixAdherencia': 'No', 'lobuloAdherencia': 'No', 'id': 767, 'lobuloParticular': 'No'} ,

            ];
            obj.update("catalagos",{id:"oreja", arreglo:arrOreja});
            //cerramos todas las conexiones
            // tx.oncomplete = function() {
            //     db.close();
            //     console.log("-> Finalizado carga de los catalogos");
            // }
            

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


}