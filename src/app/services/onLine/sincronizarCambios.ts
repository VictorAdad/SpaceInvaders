import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { Logger } from "@services/logger.service";
import { NotificationsService } from 'angular2-notifications';
import { Router} from '@angular/router';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { _config} from '@app/app.config';
import {Yason} from '@services/utils/yason';
import {Observable} from 'rxjs/Rx';

/**
 * Clase para subir todos los cambios hechos en offline
 */
export class SincronizaCambios {
    /**
     * Esta variable es para saber si se esta en el proceso de sincronización, esto por que si lo esta no vueleva a llamar la funcion de startSincronizacion.
     */
    sincronizando:boolean=false;
    /**
     * Para saber si hubo algun cambio. Si existe algun cambio se busca actualizar el caso por medio del caso Service y redirigir la pagina.
     */
    seActualizoAlmenosUnRegistro:boolean;
    /**
     * Intstancia del casoService, se utilizara para actualizar el caso cuando se termine de sincronizar y se seActualizoAlmenosUnRegistro es verdadero
     */
    casoService=null;
    /**
     * Variable pasaber si ya esta loggeado, despues de un minuto de estar en true cambia a false.
     * Esta variable se tienen que poner en false despues del logout
     */
    isLogin=false;

    /** configuracion del dialogo de confirmacion de jaspero */
    public settings={
        overlayClickToClose: false, // Default: true
        showCloseButton: true, // Default: true
        confirmText: "Aceptar", // Default: 'Yes'
        declineText: "Cancelar",
    };

    constructor(
        private db:CIndexedDB,
        private http:HttpService,
        private notificationService: NotificationsService,
        private route: Router,
        private _confirmation: ConfirmationService,
        private onLine:any
        ){
    }
    /**
     * Actualiza los casos que ya se sincronizaron.
     * Busca en la lista de sincronizacion, las entradas que corresponden a la url de post de 
     * caso y luego busca el caso en indexeddb y le agrega el campo de estatusSincronizacion
     */
    actualizaCasos(){
        if (this.sincronizando)
            return;
        this.db.list('sincronizar').then(list=>{
            let lista = (list as any[]).filter(e => e.url == '/v1/base/casos');
            for (let i =0; i<lista.length; i++){
                let item = lista[i];
                if (!item['pendiente']){
                    this.db.get('casos',item['temId']).then(caso => {
                        if (caso){
                            if (caso['estatusSincronizacion'] && caso['estatusSincronizacion']!='sincronizado'){
                                caso['estatusSincronizacion']='sincronizado';
                                this.db.update2('casos',caso).then(caso => {
                                    Logger.log('Actualizado', caso);
                                }).catch(e => {
                                    console.log(e);
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    /**
     * Fincin para setear el casoService.
     * @param casoService La instancia del servicio casoService
     */
    setCaso(casoService){
        this.casoService=casoService;
    }
    /**
     * Funcion que inicializa la sincronizacion de cambios. lo que hace es buscar todos los elementos de la tabla 
     * sincroizar y luego llama la funcion recursiva sincroniza.
     */
    startSincronizacion(){
        var obj = this;

        if (!this.sincronizando){
            this.seActualizoAlmenosUnRegistro=false;
                this.db.list('sincronizar').then(lista=>{
                    if (this.hayCambios(lista,this.onLine.auth.user.username)){
                        var fun=function(r){
                            console.log("Resultado->>>>>",r);
                            let datos = lista as any[];
                            if (datos.length>0){
                                obj.notificationService.create('Sincronizando','Sincronizando', 'info', {
                                timeOut: 5000,
                                showProgressBar: true,
                                pauseOnHover: false,
                                clickToClose: false,
                                maxLength: 10
                                });
                                obj.sincronizando=true;
                                obj.sincroniza(0,lista as any[]);
                                obj.notificationService.remove();
                            }else{
                                obj.sincronizando=false;
                                obj.notificationService.remove();
                            }
                            obj.isLogin = true;
                            // 30 s de tolerancia para tener abierta la seccion
                            let timerLogout = Observable.timer(30*1000);
                            timerLogout.subscribe(t=> {
                                obj.isLogin = false;
                            });
                        }
                        // preguntamos si ya pedimos el login de sincronizar
                        if (!obj.isLogin) {
                            this.onLine.loginDialogService.funccionDespues=fun;
                            this.onLine.loginDialogService.open()
                        }else {
                            fun(1);
                        }
                    }else {
                        this.sincronizando=false;
                    }
                }).catch(error=> {
                    this.sincronizando=false;
                    this.notificationService.remove();
                });
        }

    }
    /**
     * Busca cambios sin sincronizar
     * @param lista 
     */
    hayCambios(lista:any, username:string):boolean{
        let listaSincronizar = lista as any[];
        for (let i=0; i<listaSincronizar.length;i++){
            if (listaSincronizar[i].username == username && listaSincronizar[i].pendiente==true && listaSincronizar[i]["numItentos"]<_config.offLine.sincronizaCambios.numIntentos)
                return true;
            if (listaSincronizar[i].username == username && listaSincronizar[i].pendiente==true && !listaSincronizar[i]["numItentos"])
                return true;
        }
        return false;
    }
    /**
     * Funcion recursiva para atender cada una de las peticiones de la lista. cuando i es igual al tamaño de la lista para la recursion.
     * @param i Indica el elemento de la lista que se esta atendiendo. En teoria su valor es 0 a lista.length.
     * @param lista Lista de peticiones, en realidad son todos los elementos de la tabla de sincronizar.
     */
    sincroniza(i, lista:any[]){
        //Logger.log(i,lista);
        if (i==lista.length){
            this.sincronizando=false;
            if (this.seActualizoAlmenosUnRegistro){
                //redirigimos
                // var url=this.router.url.split('/');
                // if (url.length>0 && url[url.length-1]=="noticia-hecho"){
                //     let newUrl=this.router.url.replace("noticia-hecho", "detalle");
                //     this.router.navigate([newUrl]);
                // }
                this.casoService.actualizaCaso();
                if (this.route["url"]){
                    var elementos=this.route["url"].split("/");
                    var url=this.route["url"];
                    this.db.list("newId").then(lista=>{
                        var cambioUrl=false;
                        for (var i = 0; i < lista["length"]; ++i) {
                            for (var item in elementos){
                                if (elementos[item]==lista[i]["id"]){
                                    url=url.replace(""+lista[i]["id"],""+lista[i]["newId"]);
                                    cambioUrl=true;
                                    break;
                                }
                            }

                        }
                        Logger.log("%cLa url","color:cyan;",url);
                        if (cambioUrl)
                            this._confirmation.create('Advertencia','Se recargará la pagina',this.settings).subscribe((ans) => {
                                    this.route.navigate([url]);
                                 });
                    });
                }
            }

            //Logger.log("->Finalizo sincronizacion");
            return;
        }
        //Logger.log("Iteracion",i);
        //mientras exista conexion
        if (this.onLine.onLine){
            //
            if (i<lista.length){
                //Logger.log("ITEM",lista[i]);
                let item = lista[i];
                if (!item["numItentos"]){
                    item["numItentos"]=0;
                }
                if (item.username!=this.onLine.auth.user.username || item.pendiente==false || item["numItentos"]>_config.offLine.sincronizaCambios.numIntentos){
                    this.sincroniza(i+1,lista);
                }

                else if (item.tipo=="post"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        Logger.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                    }else
                        this.doPost(item.url, item, i,lista);
                }
                else if (item.tipo=="update"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        Logger.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                    }else
                        this.doPut(item.url, item, i,lista);
                }else if (item.tipo=="get"){
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        Logger.log("Entro a las dependencias");
                        this.buscaDependenciasYDoPost(dependencias,item,i,lista);
                    }else
                        this.doGet(item.url, item, i,lista);
                }else if (item.tipo=="postDocument"){
                    //Logger.log("Antes de entrar");
                    if (item["dependeDe"]){
                        var dependencias=item["dependeDe"] as any[];
                        Logger.log("Entro a las dependencias");
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
    /**
     * funcion que busca todas los ids de los que depende el servicio y verifica si son nuevos para despues sustituirlos en el json del body. despues llama al servicio
     * @param dependencias el arreglo de ids de los que depende el servicio.
     * @param item Es la fila de la tabla de sincronizacion que se esta atendiendo
     * @param i indice de la lista
     * @param lista lista de elementos de la tabla de sincronizar
     */
    buscaDependenciasYDoPost(dependencias: any[], item, i , lista){
        //me conviene bajar todo el diccionario de newId y buscar ahi
        this.db.list("newId").then(diccionario=>{
            this.sustituyeHojasPorNewId(item,diccionario);
            Logger.log("Item",item);
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

    /**
     * Esta funcion busca exactamente el subarbol model dentro de original. Esto para dar seguimiento a los ids nuevos.
     * @param original 
     * @param model 
     * @returns devuelve el elemento {id:model, newId:original}, que es una entrada para la tabla newId. o null si no hay mach.
     * @example EJEMPLO
     * orginal={
     *  id:1,
     *  persona:{
     *      id:1,
     *      nombre:"pepe" 
     *  }
     * }
     * model:{
     *  persona:{
     *      id:12544853615
     *  }
     * }
     * la llamada buscarValores(original,modelo) devuelve {id:12544853615, newId:1}
     */
    buscarValores(original, model){
        Logger.log("ORIGINAL",original,"MODEL",model);
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
    /**
     * Funcion que le da seguimiento a los ids temporales definidos en la propieda otrosIds. Se encarga de buscar las coincidencias del arreglo arrId dentro de original, si hay coindicencia crea una entrada en newId.
     * @param arrId Es un arreglo  con los otrosIds, basicamente es un arreglo con "sub arboles de llaves" que estan dentro de original.
     * @param original Es el json resultado del post.
     */
    agregaOtrosId(arrId:any[],original) {
        var obj=this;
        return new Promise((resolve,reject)=>{
            if (arrId.length<1)
                resolve(true);
            var cont =0;
            for (var k = 0; k < arrId.length; ++k) {
                var model=arrId[k];
                var ids=obj.buscarValores(original,model);
                if (ids && ids["id"]){
                    cont++;
                    Logger.log("%c" + "-> newId", "color: pink;font-weight:bold;",ids);
                    obj.db.update("newId",{id:ids.id,newId:ids.newId}).then(p=>{
                        Logger.log(cont);
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

    /**
     * funcion para hacer Post. Aqui se da seguimiento a los nuevos ids.  Nota para este momento ya no debe de venir dentro ninguna informacion temporal.
     * @param _url url del servicio
     * @param item Es la fila de la tabla de sincronizacion que se esta atendiendo
     * @param i Es el elemento i-esimo de la lista
     * @param lista lista de elementos de la tabla de sincronizar
     */
    doPost(_url, item, i, lista){
        Logger.log(_url,item,i,lista);
        //incrementamos el numero de intentos haciendo una peticion
        item["numItentos"]++;
        this.http.post(_url, item.body).subscribe(
            respuesta=>{
                Logger.log("RESPONSE POST",respuesta);
                item.pendiente=false;
                if (item["temId"] && respuesta){
                    //convertimos la cadena en json
                    var json = respuesta;
                    var obj=this;

                    if (item["otrosID"]){
                        this.agregaOtrosId(item["otrosID"],json).then(p=>{
                            Logger.log("NUNCALLEGO",item);
                            this.db.update("sincronizar",item).then( respuesta =>{
                                this.seActualizoAlmenosUnRegistro=true;
                                this.sincroniza(i+1,lista);
                            });
                        }).catch(r=>{
                            Logger.log("ERROR numeros de ids Enontrados",r,item);
                            //indicamos que el elemento ya se atendio
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
                Logger.log("Error:",error);
                item['error']=error;
                item.pendiente=true;
                this.db.update("sincronizar",item)
                this.sincroniza(i+1,lista);
        });
    }
    /**
     * Se encarga de hacer la peticion put. Nota para este momento ya no debe de venir dentro ninguna informacion temporal.
     * @param _url url del servicio
     * @param item Es la fila de la tabla de sincronizacion que se esta atendiendo
     * @param i Es el elemento i-esimo de la lista
     * @param lista lista de elementos de la tabla de sincronizar
     */
    doPut(_url, item, i, lista2){
        item["numItentos"]++;
        this.db.list("newId").then(listaNewId=>{
            Logger.log("URL",_url,"MODELO",item.body);
            this.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var k = 0; k < lista.length; ++k) {
                _url=_url.replace(""+lista[k].id,""+lista[k].newId);
            }
            Logger.log("URL",_url,"MODELO",item.body);
            this.http.put(_url,item.body).subscribe(
                respuesta=>{
                    Logger.log("RESPONSE EDIT=>",respuesta);
                    item.pendiente=false;
                    
                    this.db.update("sincronizar",item).then( respuesta =>{
                        this.seActualizoAlmenosUnRegistro=true;
                        this.sincroniza(i+1,lista2);
                    });
            },
                error=>{
                    Logger.log("Error:",error);
                    item.pendiente=true;
                    item['error']=error;
                    this.db.update("sincronizar",item);
                    this.sincroniza(i+1,lista2);
            });
        });

    }
    /**
     * Hay operaciones que se hacen mediante un get, por ejemplo el setear nuevo delito. Nota para este momento ya no debe de venir dentro ninguna informacion temporal.
     * @param _url url del servicio
     * @param item Es la fila de la tabla de sincronizacion que se esta atendiendo
     * @param i Es el elemento i-esimo de la lista
     * @param lista lista de elementos de la tabla de sincronizar
     */
    doGet(_url, item, i, lista2){
        item["numItentos"]++;
        this.db.list("newId").then(listaNewId=>{
            Logger.log("URL",_url,"MODELO",item.body);
            this.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var k = 0; k < lista.length; ++k) {
                _url=_url.replace(""+lista[k].id,""+lista[k].newId);
            }
            Logger.log("URL",_url,"MODELO",item.body);
            this.http.get(_url).subscribe(
                respuesta=>{
                    Logger.log("RESPONSE GET=>",respuesta);
                    item.pendiente=false;
                    this.db.update("sincronizar",item).then( respuesta =>{
                        this.seActualizoAlmenosUnRegistro=true;
                        this.sincroniza(i+1,lista2);
                    });
            },
                error=>{
                    Logger.log("Error:",error);
                    item['error']=error;
                    item.pendiente=true;
                    this.db.update("sincronizar",item);
                    this.sincroniza(i+1,lista2);
            });
        });
    }
    /**
     * Se encarga de subir los archivos guardados en indexeddb. Nota para este momento ya no debe de venir dentro ninguna informacion temporal.
     * Para lograr lo anterior se busca dentro de la tabla documentos todos los documentos que vienen dentro de item["docuemntos"]. Por cada documento se busca la informacion en la tabla de blob(la cual esta en formato dataUri)
     * y despues se convierte a blob para despue agregarla al formdata que se enviara. 
     * @param _url url del servicio
     * @param item Es la fila de la tabla de sincronizacion que se esta atendiendo
     * @param i Es el elemento i-esimo de la lista
     * @param lista lista de elementos de la tabla de sincronizar
     */
    doPostDocument(_url, item, i, lista2){
        var obj=this;
        item["numItentos"]++;
        this.db.list("newId").then(listaNewId=>{
            Logger.log("URL",_url,"MODELO",item.body);
            obj.sustituyeHojasPorNewId(item.body,listaNewId);
            var lista=listaNewId as any[];
            for (var k = 0; k < lista.length; ++k) {
                _url=_url.replace(""+lista[k].id,""+lista[k].newId);
            }
            Logger.log("URL",_url,"MODELO",item.body);
            var formData = new FormData();
            var casoId="";
            /*
            atributo extra es para agregar un valor extra al formdata que se envia al sincronizar los atributos que tienen son nombre y valor.
            ejemplo de uso
            atributoExtraPost:{nombre:"predenuncia.id",valor:"104"}
            */
            var atributoExtraPost=null;
            var rec=function(k,listaDocumentos){
                if(k==listaDocumentos["length"]){
                    Logger.log("Antes de enviar",_url, formData);
                    formData.append('caso.id', casoId);
                    if (atributoExtraPost)
                        formData.append(atributoExtraPost["nombre"], atributoExtraPost["valor"]);
                    obj.http.post(_url,formData).subscribe(
                        respuesta=>{
                            Logger.log("RESPONSE GET=>",respuesta);
                            item.pendiente=false;
                            obj.db.update("sincronizar",item).then( respuesta =>{
                                obj.seActualizoAlmenosUnRegistro=true;
                                obj.sincroniza(i+1,lista2);
                            });
                    },
                        error=>{
                            Logger.log("Error:",error);
                            item['error']=error;
                            item.pendiente=true;
                            obj.db.update("sincronizar",item);
                            obj.sincroniza(i+1,lista2);
                    });

                }else{
                    obj.db.get("blobs",listaDocumentos[k]["idBlob"]).then(t=>{
                        var b=Yason.dataURItoBlob(t["blob"].split(',')[1], listaDocumentos[k]["type"] );
                        var file = new File([b], listaDocumentos[k]["nombre"],{type: listaDocumentos[k]["type"], lastModified: Date.now()});
                        Logger.log("Archivos",b,listaDocumentos[k],file);
                        formData.append("files",file);
                        casoId=""+listaDocumentos[k]["casoId"];
                        if (listaDocumentos[k]["atributoExtraPost"])
                            atributoExtraPost=listaDocumentos[k]["atributoExtraPost"];
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
    /**
     * En esta funcion se sustituyen todos los ids temporales del json. un id temporal es un timestam, pero realmente no sabemos si es un id temporal o no, hasta que lo verificamos contra la lista listNewId.
     * Suponiendo que el json es un arbol, se sustitullen las hojas que coinciden con el array de valores de listNewId
     * @param json El body que se enviara en el servicio.
     * @param listNewId La lista de elemento de la tabla newId.
     */
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