import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { DialogSincrinizarService} from "@services/onLine/dialogSincronizar.service";
import { Logger } from "@services/logger.service";
import { Catalogos } from "../../components/app/catalogos/catalogos";
import { OnLineService } from "../onLine.service";

/**
 * Clase para sincronizar los cambios de los catalogos
 */
export class SincronizaCatalogos {
    /**
     * variable para saber si se esta sincronizando o no
     */
    public static sincronizando:boolean;
    catalogo="algun catalogo";
    /** variable de control para saber si se esta sincronizando o no */
    finalizoCatalogo=true;
    error=false;
    public static onLine: OnLineService = null;
    constructor(
        private db:CIndexedDB,
        private http:HttpService,
        private dialogo:DialogSincrinizarService
        ){
    }
    /**
     * Setea el onLine service
     * @param onLineService Instancia del onLineService
     */
    setOnlineService(onLineService: OnLineService){
        SincronizaCatalogos.onLine = onLineService;
        SincronizaCatalogos.onLine.onLineChange.subscribe(conexion => {
            if (!conexion){
                this.dialogo.close();
            }
            Logger.log('Conexion',conexion);
        });
        console.log('Seteando onLineService', SincronizaCatalogos.onLine);
    }
    /**
     * funcion que transforma una cadena en formato guioncase a camelcaseUpper
     * @param cad String
     * @example Ejemplo
     * cad="hola_mundo"
     * cad=toCamelCase(cad)
     * cad es "HolaMundo"
     */
    public toCamelCase(cad){
        var copia="";
        if (cad.length>0){
            var ant_ = false;
            for (var i in cad) {
                if (i=="0"){
                    copia+=cad[i].toUpperCase();    
                }
                else if (cad[i]!="_"){
                    if (ant_){
                        ant_=false;
                        copia+=cad[i].toUpperCase();
                    }else
                        copia+=cad[i];
                }
                else if (cad[i]=="_")
                    ant_=true;
                //Logger.log(i,copia);
            }
        }
        return copia;
    }
    /**
     * funcion que transforma una cadena en formato camelcaseUpper a guioncase
     * @param cad String
     * @example Ejemplo
     * cad="HolaMumundo"
     * cad=toCamelCase(cad)
     * cad es "hola_mundo"
     */
    public toGuionCase(cad){
        let str="";
        for (var i = 0; i < cad.length; ++i) {
            let c=cad[i];
            if (c>="A" && c<="Z"){
                if (i==0)
                    str+=c.toLowerCase();
                else
                    str+="_"+c.toLowerCase();
            }else{
                str+=c;
            }
        }
        return str;
    }
    /**
     * No hace nada :'(
     * @param arr 
     */
    private arrayToCamelCase(arr:any[]){
        let arreglo=new Array<any>();
        return arreglo;
    }
    /**
     * Funcion que sincroniza los catalogos por primera vez. Es llamada desde la clase IndexedDB
     */
    public nuevo(){
        SincronizaCatalogos.sincronizando=true;
        this.bajaCatalogoLlave().then( firmas =>{
            let firma = firmas as any[];
            this.finalizoCatalogo=false;
            this.db.clear('catalogoLlave');
            this.dialogo.open();
            const todos = CatalogosACargar.matricesASincronizar.concat(CatalogosACargar.catalogosASincronizar);
            // this.sincronizaCatalogos(0,CatalogosACargar.matricesASincronizar,"matrices",firma);
            // this.sincronizaCatalogos(0,CatalogosACargar.catalogosASincronizar,"catalogos",firma);
            this.sincronizaCatalogos(0, todos, "CATÁLOGOS", firma);
        }).catch(e =>{
            console.error(e);
            SincronizaCatalogos.sincronizando=false;
        })
    }
    public arregloFirmas() {
        return new Promise((resolve, reject) => {
            var firmas = [];
            this.db.list('catalogoLlave').then( list => {
                let lista = list as any[];
                for (let i = 0; i < lista.length; i++){
                    firmas.push({
                        id: ''+lista[i]['id'],
                        uuid: ''+lista[i]['uuid']
                    });
                }
                resolve(firmas);
            }).catch( e => {
                reject(e);
            });
        });
    }
    /**
     * Busca el catalogo correspondiente dentro de la lista de catalogos y matrices
     * @param catalogo string: nombre catalogo
     * @return objecto de la forma {uri: "", nombre:""} o null si no lo encuentra
     */
    public buscaElementoInCatalogos(catalogo){
        var catalogos=CatalogosACargar.catalogosASincronizar as any[];
        for (var i = 0; i < catalogos.length; ++i) {
            if (catalogos[i].catalogo==catalogo){
                return catalogos[i];
            }
        }
        catalogos=CatalogosACargar.matricesASincronizar as any[];
        for (var i = 0; i < catalogos.length; ++i) {
            if (catalogos[i].catalogo==catalogo){
                return catalogos[i];
            }
        }
        return null;
    }
    /**
     * Actualiza el catalogo dentro de indexedDB
     * @param item Es el catalogo a sincronizar
     */
    public actualizaCatalogo(item){
        var obj=this;
        return new Promise( (resolve, reject) =>{
            obj.http.get(item["uri"]).subscribe((response) => {
                obj.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                        //obj.dialogo.close();
                        resolve(e);
                    }).catch((e)=>{
                        //obj.dialogo.close();
                        reject(e);
                    });
            },
            (error)=>{
                Logger.log("Fallo el servicio "+item["uri"]);
                reject(error);
                //obj.dialogo.close();
            });
        });
        
    }
    /**
     * Funcion que se encarga de descargar la lista de catalogos firmados y comparalos contra la lista de IndexedDB. Si existe alguna diferencia se actualiza el catalogo que tienen diferente firma.
     */
    public searchChange(){
        //si se esta sincronizando los catalogos por primera vez
        if (SincronizaCatalogos.sincronizando)
            return;
        //si se estan sincronizando los catalogos
        if (!this.finalizoCatalogo)
            return;
        var obj=this;
        //obj.dialogo.open();
        Logger.time("BuscarCambios");
        this.http.get("/v1/catalogos/sincronizacion").subscribe(listaRemota=>{
            this.db.list("catalogoLlave").then(listaLocal=>{
                var encontrado:boolean;
                var catalogos=listaLocal as any[];
                let cambio:boolean=false;
                obj.dialogo.open();
                const rec = function(i){
                    if (!SincronizaCatalogos.onLine.onLine){
                        obj.dialogo.close();
                        Logger.logColor('Se perdió la conexión','red',SincronizaCatalogos.onLine);
                        return;
                    }
                    if ( i == listaRemota.length){
                        obj.dialogo.close();
                        Logger.log('Fin la actualizacion de catálogos');
                        Logger.timeEnd("BuscarCambios");
                        return;
                    }
                    encontrado = false;
                    let itemR=listaRemota[i];
                    //busco en las matrices
                    for (var k = 0; k < catalogos.length; ++k) {
                        let itemM=catalogos[k];
                        if (itemR["nombreCatalogo"]==itemM["id"]){
                            encontrado=itemR["uuid"]==itemM["uuid"];
                            break;
                        }
                    }
                    
                    if (!encontrado){
                        let nombreCatalogo=obj.toGuionCase(itemR["nombreCatalogo"]);
                        let item=obj.buscaElementoInCatalogos(nombreCatalogo);
                        if (item!=null){
                            Logger.log("actualizar este catalogo",itemR, nombreCatalogo,item);
                            obj.actualizaCatalogo(item).then(e => {
                                //actualizamos la llave del catalogo
                                obj.db.update('catalogoLlave', 
                                    {
                                        id: itemR["nombreCatalogo"], 
                                        uuid: itemR["uuid"]
                                    }).then(e => { rec(i+1);
                                    }).catch( e => {rec(i+1);} );
                            });
                        }else{
                            rec(i+1);
                        }
                    }else{
                        rec(i+1);
                    }

                }
                rec(0);
                
            }).catch( error=>{
                console.error("error", error);
            });
        },error=>{
            Logger.log(error);
            this.dialogo.close();
        });
        //this.dialogo.close();
    }
    /**
     * Funcion que descarga la lista de catalogos firmados y los guarda en IndexedDB
     */
    private bajaCatalogoLlave(){
        var obj=this;
        return new Promise((resolve,reject) => {
            obj.http.get("/v1/catalogos/sincronizacion").subscribe(listaRemota=>{
                var lista = listaRemota as any[];
                var cambios=[];
                for (var i = 0; i < lista.length; ++i) {
                    let dato={id:(lista[i])["nombreCatalogo"],uuid:(lista[i])["uuid"]};
                    cambios.push(dato);
                }
                obj.db.actualizaCambios("catalogoLlave",cambios).then( t =>
                    {resolve(cambios)})
                .catch( e => {reject(e);});
            });
        });
       
    }
    /**
     * Funcion recursiva para sincronizar catalogos. en teoria todo lo que viene en el arr se va a sincronizar. Este arreglo se inicializa en la funcion searchChange
     * @param i indice del arreglo
     * @param arr arreglos de catalogos, es un arreglo de la forma[{uri:"",catalogo:""},]
     * @param titulo string que indica si se sincronizan matrices o catalogos
     */
    private sincronizaCatalogos(i,arr:any[],titulo:string="", firmas = [], descargados=[]){
        if (i==0){
            Logger.time(titulo);
            Logger.log("%c" + "-> Iniciando Sincronizacion de "+titulo, "color: black;font-weight:bold;");
        }
        if (!SincronizaCatalogos.onLine.onLine){
            Logger.logColor('Se perdió la conexión','red',SincronizaCatalogos.onLine);
            Logger.timeEnd(titulo);
            this.dialogo.close();
            return;
        }
        if (i==arr.length){
            //dejamos de sincronizar hasta que las matrices se bajen
            
            
            // if (titulo=="matrices"){
            //     this.finalizoMatrix=true;
            // }else{
            //     this.finalizoCatalogo=true;
            // //}
            //if (this.finalizoMatrix && this.finalizoCatalogo){
                this.finalizoCatalogo=true;
                SincronizaCatalogos.sincronizando=false;
                this.dialogo.close();
            //}
            descargados.sort(
                function compare(a, b) {
                    if (a.id<b.id) {
                      return -1;
                    }
                    if (a.id>b.id) {
                      return 1;
                    }
                    // a must be equal to b
                    return 0;
                  }
            );
            Logger.log("%c" + "-> "+titulo+" sincronizadas", "color: blue;font-weight:bold;", firmas, descargados);
            let noEstan = [];
            for (let i = 0; i<firmas.length; i++) {
                let esta=false;
                for (let j = 0; j<descargados.length; j++) {
                    if (firmas[i]['id']==descargados[j]['id']) {
                        esta=true;
                        break;
                    }
                }
                if (!esta)
                    noEstan.push(firmas[i]);
            }
            for (let i = 0; i<descargados.length; i++) {
                let esta=false;
                for (let j = 0; j<firmas.length; j++) {
                    if (firmas[j]['id']==descargados[i]['id']) {
                        esta=true;
                        break;
                    }
                }
                if (!esta)
                    noEstan.push(descargados[i]);
            }
            Logger.log('NO esta', noEstan);
            Logger.timeEnd(titulo);
            this.db.list('catalogoLlave').then( lista => {
                Logger.log('Lista',lista);
            });
            return;
        }
        this.sincronizaMatrix(i,arr[i],arr,titulo,firmas,descargados);

    }
     /**
     * Funcion recursiva para sincronizar catalogos. Se encarga de descargar el catalogo definido en item y actualizarlo en indexeDB
     * @param i indice del arreglo
     * @param item es el elemento que se actualizara
     * @param arr arreglos de catalogos, es un arreglo de la forma[{uri:"",catalogo:""},]
     * @param titulo string que indica si se sincronizan matrices o catalogos
     */
    private sincronizaMatrix(i,item,arr,titulo:string="",firmas = [], descargados=[]){
        var obj = this;
        this.catalogo=item["catalogo"];
        Logger.log(this.catalogo);
        this.http.get(item["uri"]).subscribe((response) => {
            this.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                let dato = {id: obj.toCamelCase(item["catalogo"])};
                if (dato['id'] == 'MarcaSubmarca'){
                    dato['id'] = 'MarcaSubMarca';
                }
                descargados.push(dato);
                let esta = false;
                for (let k = 0; k<firmas.length; k++) {
                    if (firmas[k]['id']==dato['id']) {
                        esta = true;
                        obj.db.update('catalogoLlave',firmas[k]).then(
                            e =>{
                                obj.sincronizaCatalogos(i+1,arr,titulo,firmas,descargados);
                            }
                        );
                        break;
                    }
                }
                if (!esta){
                    obj.sincronizaCatalogos(i+1,arr,titulo,firmas,descargados);
                }
                });
        },
        (error)=>{
            Logger.log("Fallo el servicio "+item["uri"]);
            let catalogo=this.toCamelCase(item["catalogo"]);
            this.sincronizaCatalogos(i+1,arr,titulo,firmas,descargados);
            Logger.log("Borrar el catalogo", catalogo);
            this.db.delete("catalogoLlave",catalogo);
            this.error=true;
        });
    }


} 