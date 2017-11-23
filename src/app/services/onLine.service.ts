import { Injectable } from '@angular/core';


import {Observable} from 'rxjs/Rx';

import {MatSnackBar} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import {SincronizaCatalogos} from "@services/onLine/sincronizaCatalogos";
import { SimpleNotificationsComponent } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { Notification } from 'angular2-notifications';
import { MatDialog } from '@angular/material';


@Injectable()
export class OnLineService {
    onLine: boolean = true;
    timer = Observable.timer(2000,1000);
    //este timer se executa cada hora, la primera se sera a los 14s de iniciar la app
    timerSincronizarMatrices = Observable.timer(7000,1000*60*20);
    anterior: boolean= true;

    sincronizando:boolean=false;
    seActualizoAlmenosUnRegistro:boolean;

    sincronizarCatalogos:SincronizaCatalogos;


    constructor(
        public snackBar: MatSnackBar,
        private db:CIndexedDB,
        private http:HttpService,
        private notificationService: NotificationsService,
        public dialog: MatDialog
    ) {
        this.sincronizarCatalogos=new SincronizaCatalogos(db,http,dialog);
        // timer = Observable.timer(2000,1000);
        this.timer.subscribe(t=>{
            this.anterior=this.onLine;
            this.onLine=navigator.onLine;
            let message="Se perdió la conexión";
            if(this.onLine){
                message="Se estableció la conexión";
                this.startSincronizacion();
            }

            if (this.anterior!=this.onLine){
                this.snackBar.open(message, "", {
                  duration: 10000,
                });
            }
        });
        // if(localStorage.getItem('sincronizacion') !== 'true')
            this.timerSincronizarMatrices.subscribe(t=>{
                if (this.onLine)
                    this.sincronizarCatalogos.searchChange();
                localStorage.setItem('sincronizacion', 'true')
            });
        // else
        //     console.log('Ya existen catalogos sincroinzados');
    }

    startSincronizacion(){

        if (!this.sincronizando){
            this.seActualizoAlmenosUnRegistro=false;
            this.db.list("sincronizar").then(lista=>{

                let datos = lista as any[];
                if (datos.length>0){
                    this.notificationService.create("Sincronizando",'Sincronizando', 'info', {
                      timeOut: 5000,
                      showProgressBar: true,
                      pauseOnHover: false,
                      clickToClose: false,
                      maxLength: 10
                    });
                    this.sincronizando=true;
                    this.sincroniza(0,lista as any[]);
                    this.notificationService.remove();
                }else{
                    this.sincronizando=false;
                    this.notificationService.remove();
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
        //console.log("Iteracion",i);
        //mientras exista conexion
        if (this.onLine){
            //
            if (i<lista.length){
                //console.log("ITEM",lista[i]);
                let item = lista[i];
                if (!item["numItentos"]){
                    item["numItentos"]=0;
                }
                if (item.pendiente==false || item["numItentos"]>3){
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
                }else if (item.tipo=="get"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        console.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                    }else
                        this.doGet(item.url, item, i,lista);
                }else if (item.tipo=="postDocument"){
                    //console.log("Antes de entrar");
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        console.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                    }else
                        this.doPostDocument(item.url, item, i,lista);
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
            this.sustituyeHojasPorNewId(item,diccionario);
            // var listNewId = diccionario as any[];
            // console.log("ARREGLO DEPENDENCIAS",dependencias);
            // for (var k = 0; k < dependencias.length; ++k) {
            //     for (var j = 0; j < listNewId.length; ++j) {
            //         if (dependencias[k]==(listNewId[j])["id"] ){
            //             if ((item["body"])["caso"]){//existe el caso
            //                 if ( ((item["body"])["caso"])["id"]==dependencias[k]){
            //                     ((item["body"])["caso"])["id"]=(listNewId[j])["newId"];
            //                     console.log("asignacion: ",((item["body"])["caso"])["id"],(listNewId[j])["newId"]);
            //                 }
            //             }
            //             if ((item["body"])["id"]==dependencias[k]){
            //                 (item["body"])["id"]=(listNewId[j])["newId"];
            //             }
            //             console.log(""+dependencias[k],""+([j])["newId"]);
            //             item["url"]=item["url"].replace(""+dependencias[k],""+(listNewId[j])["newId"]);
            //         }
            //     }
            // }
            console.log("Item",item);
            let tipo=item["tipo"];
            if (tipo=="post")
                this.doPost(item["url"], item, i, lista)
            else if(tipo=="update"){
                this.doPut(item["url"], item, i, lista)
            }
            else if(tipo=="get"){
                this.doGet(item["url"], item, i, lista)
            }
            else if(tipo=="postDocument"){
                this.doPostDocument(item["url"], item, i, lista)
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
        console.log(_url,item,i,lista);
        item["numItentos"]++;
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
                                if (ids){
                                    cont++;
                                    obj.db.update("newId",{id:ids.id,newId:ids.newId}).then(p=>{
                                        console.log(cont);
                                        if(cont==arrId.length)
                                            resolve(true);
                                    });
                                }
                            }
                            //si no se encontraron todos los ids hay un error
                            if (cont!=arrId.length){
                                reject({enontrados:cont,total:arrId.length});
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
                        }).catch(r=>{
                            console.log("ERROR numeros de ids Enontrados",r,item);
                            item.pendiente=true;
                            this.db.update("sincronizar",item);
                            this.sincroniza(i+1,lista);
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
                item.pendiente=true;
                this.db.update("sincronizar",item)
                this.sincroniza(i+1,lista);
        });
    }

    doPut(_url, item, i, lista2){
        item["numItentos"]++;
        this.db.list("newId").then(listaNewId=>{
            console.log("URL",_url,"MODELO",item.body);
            this.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var k = 0; k < lista.length; ++k) {
                _url=_url.replace(""+lista[k].id,""+lista[k].newId);
            }
            console.log("URL",_url,"MODELO",item.body);
            this.http.put(_url,item.body).subscribe(
                respuesta=>{
                    console.log("RESPONSE EDIT=>",respuesta);
                    item.pendiente=false;
                    this.db.update("sincronizar",item).then( respuesta =>{
                        this.seActualizoAlmenosUnRegistro=true;
                        this.sincroniza(i+1,lista2);
                    });
            },
                error=>{
                    console.log("Error:",error);
                    item.pendiente=true;
                    this.db.update("sincronizar",item);
                    this.sincroniza(i+1,lista2);
            });
        });

    }

    doGet(_url, item, i, lista2){
        item["numItentos"]++;
        this.db.list("newId").then(listaNewId=>{
            console.log("URL",_url,"MODELO",item.body);
            this.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var k = 0; k < lista.length; ++k) {
                _url=_url.replace(""+lista[k].id,""+lista[k].newId);
            }
            console.log("URL",_url,"MODELO",item.body);
            this.http.get(_url).subscribe(
                respuesta=>{
                    console.log("RESPONSE GET=>",respuesta);
                    item.pendiente=false;
                    this.db.update("sincronizar",item).then( respuesta =>{
                        this.seActualizoAlmenosUnRegistro=true;
                        this.sincroniza(i+1,lista2);
                    });
            },
                error=>{
                    console.log("Error:",error);
                    item.pendiente=true;
                    this.db.update("sincronizar",item);
                    this.sincroniza(i+1,lista2);
            });
        });
    }



    //convierte un archivo a blob
    dataURItoBlob(dataURI, type) {
        var binary = atob(dataURI);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
    }

    doPostDocument(_url, item, i, lista2){
        var obj=this;
        item["numItentos"]++;
        this.db.list("newId").then(listaNewId=>{
            console.log("URL",_url,"MODELO",item.body);
            obj.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var k = 0; k < lista.length; ++k) {
                _url=_url.replace(""+lista[k].id,""+lista[k].newId);
            }
            console.log("URL",_url,"MODELO",item.body);
            var formData = new FormData();
            var casoId="";
            var rec=function(k,listaDocumentos){
                if(k==listaDocumentos["length"]){
                    console.log("Antes de enviar",_url, formData);
                    formData.append('caso.id', casoId);
                    obj.http.post(_url,formData).subscribe(
                        respuesta=>{
                            console.log("RESPONSE GET=>",respuesta);
                            item.pendiente=false;
                            obj.db.update("sincronizar",item).then( respuesta =>{
                                obj.seActualizoAlmenosUnRegistro=true;
                                obj.sincroniza(i+1,lista2);
                            });
                    },
                        error=>{
                            console.log("Error:",error);
                            item.pendiente=true;
                            obj.db.update("sincronizar",item);
                            obj.sincroniza(i+1,lista2);
                    });

                }else{
                    obj.db.get("blobs",listaDocumentos[k]["idBlob"]).then(t=>{
                        var b=obj.dataURItoBlob(t["blob"].split(',')[1], listaDocumentos[k]["type"] );
                        var file = new File([b], listaDocumentos[k]["nombre"],{type: listaDocumentos[k]["type"], lastModified: Date.now()});
                        console.log("Archivos",b,listaDocumentos[k],file);
                        formData.append("files",file);
                        casoId=""+listaDocumentos[k]["casoId"];
                        rec(k+1,listaDocumentos);
                    });
                }
            }
            if (item["documentos"] && item["documentos"]["length"] && item["documentos"]["length"]>0){
                rec(0,item["documentos"]);
            }else{
                obj.sincroniza(i+1,lista2);
            }
            
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
