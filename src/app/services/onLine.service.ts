import { Injectable } from '@angular/core';


import {Observable} from 'rxjs/Rx';

import {MatSnackBar} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { SimpleNotificationsComponent } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { Notification } from 'angular2-notifications';


@Injectable()
export class OnLineService {
    onLine: boolean = true;
    timer = Observable.timer(2000,1000);
    //este timer se executa cada hora, la primera se sera a los 14s de iniciar la app
    timerSincronizarMatrices = Observable.timer(7000,1000*60*60);
    anterior: boolean= true;

    sincronizando:boolean=false;
    seActualizoAlmenosUnRegistro:boolean;


    constructor(
        public snackBar: MatSnackBar,
        private db:CIndexedDB,
        private http:HttpService,
        private notificationService: NotificationsService
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
        if(localStorage.getItem('sincronizacion') !== 'true')
            this.timerSincronizarMatrices.subscribe(t=>{
                this.sincronizaCatalogos(0,CatalogosACargar.matricesASincronizar,"matrices");
                this.sincronizaCatalogos(0,CatalogosACargar.catalogosASincronizar,"catalogos");
                localStorage.setItem('sincronizacion', 'true')
            });
        else
            console.log('Ya existen catalogos sincroinzados');
    }

    private sincronizaCatalogos(i,arr:any[],titulo:string=""){
        if (i==0){
            console.time(titulo);
            console.log("%c" + "-> Iniciando Sincronizacion de "+titulo, "color: black;font-weight:bold;");
        }
        if (i==arr.length){
            console.log("%c" + "-> "+titulo+" sincronizadas", "color: blue;font-weight:bold;");
            console.timeEnd(titulo);
            return;
        }
        this.sincronizaMatrix(i,arr[i],arr,titulo);

    }

    private sincronizaMatrix(i,item,arr,titulo:string=""){
        this.http.get(item["uri"]).subscribe((response) => {
            this.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                    this.sincronizaCatalogos(i+1,arr,titulo);
                });
        },
        (error)=>{
            console.log("Fallo el servicio "+item["uri"]);
            this.sincronizaCatalogos(i+1,arr,titulo);
        });
    }

    startSincronizacion(){

        if (!this.sincronizando){
            this.sincronizando=true;
            this.seActualizoAlmenosUnRegistro=false;
            this.db.list("sincronizar").then(lista=>{
                let datos = lista as any[];
                if (datos.length>0){
                    console.log("Coomienzaa...");
                    this.notificationService.create("Sincronizando",'Sincronizando', 'info', {
                      timeOut: 5000,
                      showProgressBar: true,
                      pauseOnHover: false,
                      clickToClose: false,
                      maxLength: 10
                    });
                    this.sincroniza(0,lista as any[]);
                }else{
                    this.sincronizando=false;
                    this.notificationService.remove()
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
                    }else
                        this.doPost(item.url, item, i,lista);
                }
                else if (item.tipo=="update"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        console.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                    }else
                        this.doPut(item.url, item, i,lista);
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
        this.db.list("newId").then(diccionario=>{
            var listNewId = diccionario as any[];
            console.log("ARREGLO DEPENDENCIAS",dependencias);
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
                this.doPost(item["url"], item, i, lista)
            else if(tipo=="update"){
                this.doPut(item["url"], item, i, lista)
            }
        });
    }

    buscarValores(original, model){
        console.log("ORIGINAL",original,"MODEL",model);
        if (typeof model=="object"){
            for (let x in model){
                if (original[x]){
                    return this.buscarValores(original[x],model[x]);
                }
                else
                    return null;
            }
        }else{
            return{
                id:model,
                newId:original
            };
        }
    }

    doPost(_url, item, i, lista){
        this.http.post(_url, item.body).subscribe(
            respuesta=>{
                console.log("RESPONSE POST",respuesta);
                item.pendiente=false;
                if (item["temId"] && respuesta){
                    //convertimos la cadena en json
                    var json = respuesta;
                    var obj=this;

                    var agregaOtrosId=function(arrId:any[],original) {
                        return new Promise((resolve,reject)=>{
                            if (arrId.length<1)
                                resolve(true);
                            var cont =0;
                            for (var k = 0; k < arrId.length; ++k) {
                                var model=arrId[k];
                                var ids=obj.buscarValores(original,model);
                                if (ids)
                                    obj.db.update("newId",{id:ids.id,newId:ids.newId}).then(p=>{
                                        cont++;
                                        if(cont==arrId.length)
                                            resolve(true);
                                    });
                                else
                                    cont++;
                            }
                        });
                    }//si hay otros ids
                    if (item["otrosID"]){
                        agregaOtrosId(item["otrosID"],json).then(p=>{
                            console.log("NUNCALLEGO",item);
                            this.db.update("sincronizar",item).then( respuesta =>{
                                this.seActualizoAlmenosUnRegistro=true;
                                this.sincroniza(i+1,lista);
                            });
                        });
                    }else{
                        //esto es necesario para actualizar las llaves de las peticiones
                        this.db.update("newId",{id:item["temId"],newId:json["id"]}).then(p=>{
                            this.db.update("sincronizar",item).then( respuesta =>{
                                this.seActualizoAlmenosUnRegistro=true;
                                this.sincroniza(i+1,lista);
                            });
                        });
                    }
                }else{
                    this.db.update("sincronizar",item).then( respuesta =>{
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
        this.db.list("newId").then(listaNewId=>{
            console.log("URL",_url,"MODELO",item.body);
            this.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var i = 0; i < lista.length; ++i) {
                _url=_url.replace(""+lista[i].id,""+lista[i].newId);
            }
            console.log("URL",_url,"MODELO",item.body);
            this.http.put(_url,item.body).subscribe(
                respuesta=>{
                    console.log("RESPONSE EDIT=>",respuesta);
                    item.pendiente=false;
                    this.db.update("sincronizar",item).then( respuesta =>{
                        this.seActualizoAlmenosUnRegistro=true;
                        this.sincroniza(i+1,lista);
                    });
            },
                error=>{
                    console.log("Error:",error);
                    this.sincroniza(i+1,lista);
            });
        });

    }

    sustituyeHojasPorNewId(json,listNewId){
        if (typeof json=="object"){
            for (var key in json){//si es objecto
                if (typeof json[key]=="object")
                    this.sustituyeHojasPorNewId(json[key],listNewId);
                else{// si es hoja
                    for (var i = 0; i < listNewId.length; ++i) {
                        if (json[key]==listNewId[i].id){
                            json[key]=listNewId[i].newId;
                            break;
                        }
                    }
                }
            }
        }

    }


}
