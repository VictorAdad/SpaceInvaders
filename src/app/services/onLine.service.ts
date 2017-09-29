import { Injectable } from '@angular/core';


import {Observable} from 'rxjs/Rx';

import {MdSnackBar} from '@angular/material';

import { CIndexedDB } from '@services/indexedDB';
import { Http, Response } from '@angular/http'

import { HttpService } from '@services/http.service';

import { _config} from '@app/app.config';

import { Router } from '@angular/router';


@Injectable()
export class OnLineService {
    onLine: boolean = true;
    timer = Observable.timer(2000,1000);
    timerActualizacion = Observable.timer(5000,60*1000);
    anterior: boolean= true;
    sincronizando:boolean=false;
    seActualizoAlmenosUnRegistro:boolean;

    constructor(
        public snackBar: MdSnackBar,
        private _tabla: CIndexedDB,
        private http: Http,
        private httpService:HttpService,
        private router:Router
    ) { 
        // timer = Observable.timer(2000,1000);
        this.timer.subscribe(t=>{
            this.anterior=this.onLine;
            this.onLine=navigator.onLine;
            let message="Se perdio la conexión";
            if(this.onLine){
                message="Se extablecio la conexión";
                this.startSincronizacion();
            }

            if (this.anterior!=this.onLine){
                this.snackBar.open(message, "Cerrar", {
                  duration: 2000,
                });
            }
        });
        this.timerActualizacion.subscribe(t=>{
            //si no se esta sincronizando y estamos online
            if (!this.sincronizando && navigator.onLine){
                this.actualiza();
            }
        });
    }

    actualiza(){
        //console.log("Router", this.router);
        this.httpService.get('/v1/base/casos').subscribe((response) => {
            this._tabla.clear('casos').then(t=>{
                let datos=response as any[];
                //console.log(datos);
                for (var i = 0; i < datos.length; ++i) {
                    this._tabla.update("casos",datos[i]).then(p=>{});
                }
            });
        });
    }

    startSincronizacion(){
        if (!this.sincronizando){
            this.sincronizando=true;
            this.seActualizoAlmenosUnRegistro=false;
            this._tabla.list("sincronizar").then(lista=>{
                let datos = lista as any[];
                if (datos.length>0){
                    this.sincroniza(0,lista as any[]);    
                }else{
                    this.sincronizando=false;
                }
            });    
        }
        
    }

    sincroniza(i, lista:any[]){
        if (i==lista.length){
            this.sincronizando=false;
            if (this.seActualizoAlmenosUnRegistro){
                //redirigimos
                // var url=this.router.url.split('/');
                // if (url.length>0 && url[url.length-1]=="noticia-hecho"){
                //     let newUrl=this.router.url.replace("noticia-hecho", "detalle");
                //     this.router.navigate([newUrl]);
                // }
            }
            
            //console.log("->Finalizo sincronizacion");
            return;
        }
        //mientras exista conexion
        if (this.onLine){
            //
            if (i<lista.length){
                let item = lista[i];
                
                if (item.pendiente==false){
                    this.sincroniza(i+1,lista);
                }
                else if (item.tipo=="post"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        console.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                        //this.doPost(_config.api.host+item.url, item, i,lista);
                    }else
                        this.doPost(_config.api.host+item.url, item, i,lista);
                    // this.http.post(_config.api.host+item.url, item.body, item.options).subscribe(
                    //     respuesta=>{
                    //         console.log("repuesta",respuesta);
                    //         item.pendiente=false;
                    //         if (item["temId"] && respuesta["_body"]){
                    //             //esto es necesario para actualizar las llaves de las peticiones
                    //             this._tabla.update("newId",{id:item["temId"],newId:(respuesta["_body"])["id"]}).then(p=>{
                    //                 this._tabla.update("sincronizar",item).then( respuesta =>{
                    //                     this.seActualizoAlmenosUnRegistro=true;
                    //                     this.sincroniza(i+1,lista);
                    //                 });
                    //             });
                    //         }else{
                    //             this._tabla.update("sincronizar",item).then( respuesta =>{
                    //                 this.seActualizoAlmenosUnRegistro=true;
                    //                 this.sincroniza(i+1,lista);
                    //             });
                    //         }
                            
                    // },
                    //     error=>{
                    //         console.log("Error:",error);
                    //         this.sincroniza(i+1,lista);
                    // });
                }
                else if (item.tipo=="update"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        console.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                        //this.doPost(_config.api.host+item.url, item, i,lista);
                    }else
                        this.doPut(_config.api.host+item.url, item, i,lista);
                }else{
                    //si no encuentra ninguno de los tipos validos
                    this.sincroniza(i+1,lista);
                }
            }    
        }
        
    }
    //funcion que busca todas las coincidencias y despues llama a la funcion de dopost
    buscaDependenciasYDoPost(dependencias: any[], item, i , lista){
        //me conviene bajar todo el diccionario de newId y buscar ahi
        this._tabla.list("newId").then(diccionario=>{
            var listNewId = diccionario as any[];
            for (var k = 0; k < dependencias.length; ++k) {
                for (var j = 0; j < listNewId.length; ++j) {
                    if (dependencias[k]==(listNewId[j])["id"] ){
                        if ((item["body"])["caso"]){//existe el caso
                            if ( ((item["body"])["caso"])["id"]==dependencias[k]){
                                ((item["body"])["caso"])["id"]=(listNewId[j])["newId"];
                                console.log("asignacion: ",((item["body"])["caso"])["id"],(listNewId[j])["newId"]);
                            }
                        }
                        if ((item["body"])["id"]==dependencias[k]){
                            (item["body"])["id"]=(listNewId[j])["newId"];
                        }
                        console.log(""+dependencias[k],""+(listNewId[j])["newId"]);
                        item["url"]=item["url"].replace(""+dependencias[k],""+(listNewId[j])["newId"]);
                    }
                }
            }
            console.log("Item",item);
            let tipo=item["tipo"];
            if (tipo=="post")
                this.doPost(_config.api.host+item["url"], item, i, lista)
            else if(tipo=="update"){
                this.doPut(_config.api.host+item["url"], item, i, lista)
            }
        });
    }

    doPost(_url, item, i, lista){
        this.http.post(_url, item.body, item.options).subscribe(
            respuesta=>{
                console.log("repuesta",respuesta);
                item.pendiente=false;
                if (item["temId"] && respuesta["_body"]){
                    //convertimos la cadena en json
                    var json = JSON.parse(respuesta["_body"]);
                    //esto es necesario para actualizar las llaves de las peticiones
                    this._tabla.update("newId",{id:item["temId"],newId:json["id"]}).then(p=>{
                        this._tabla.update("sincronizar",item).then( respuesta =>{
                            this.seActualizoAlmenosUnRegistro=true;
                            this.sincroniza(i+1,lista);
                        });
                    });
                }else{
                    this._tabla.update("sincronizar",item).then( respuesta =>{
                        this.seActualizoAlmenosUnRegistro=true;
                        this.sincroniza(i+1,lista);
                    });
                }
                
        },
            error=>{
                console.log("Error:",error);
                this.sincroniza(i+1,lista);
        });
    }

    doPut(_url, item, i, lista){
        this.http.put(_url, item.body, item.options).subscribe(
            respuesta=>{
                item.pendiente=false;
                this._tabla.update("sincronizar",item).then( respuesta =>{
                    this.seActualizoAlmenosUnRegistro=true;
                    this.sincroniza(i+1,lista);
                });
        },
            error=>{
                console.log("Error:",error);
                this.sincroniza(i+1,lista);
        });
    }


}
