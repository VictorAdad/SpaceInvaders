import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { DialogSincrinizarService} from "@services/onLine/dialogSincronizar.service";
import { Logger } from "@services/logger.service";

/**
 * Clase para sincronizar los cambios de los catalogos
 */
export class SincronizaCatalogos {
    /**
     * variable para saber si se esta sincronizando o no
     */
    public static sincronizando:boolean;
    catalogo="algun catalogo";

    finalizoCatalogo=true;
    finalizoMatrix=true;
    error=false;

    constructor(
        private db:CIndexedDB,
        private http:HttpService,
        private dialogo:DialogSincrinizarService
        ){
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
                Logger.log(i,copia);
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
        this.bajaCatalogoLlave();
        this.finalizoCatalogo=false;
        this.finalizoMatrix=false;
        this.dialogo.open();
        this.sincronizaCatalogos(0,CatalogosACargar.matricesASincronizar,"matrices");
        this.sincronizaCatalogos(0,CatalogosACargar.catalogosASincronizar,"catalogos");
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
        this.http.get(item["uri"]).subscribe((response) => {
            this.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                    obj.dialogo.close();
                }).catch((e)=>{
                    obj.dialogo.close();
                });
        },
        (error)=>{
            Logger.log("Fallo el servicio "+item["uri"]);
            obj.dialogo.close();
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
        if (!this.finalizoMatrix && !this.finalizoCatalogo)
            return;
        var obj=this;
        //obj.dialogo.open();
        Logger.time("BuscarCambios");
        this.http.get("/v1/catalogos/sincronizacion").subscribe(listaRemota=>{
            this.db.list("catalogoLlave").then(listaLocal=>{
                var encontrado:boolean;
                var catalogos=listaLocal as any[];
                let cambio:boolean=false;
                for (var i = 0; i < listaRemota.length; ++i) {
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
                            obj.dialogo.open();
                            obj.actualizaCatalogo(item);
                            cambio=true;
                        }
                        Logger.log("actualizar este catalogo",itemR, nombreCatalogo,item);
                    }
                }
                //actualizamos el catalogo de llaves
                if(cambio)
                    obj.bajaCatalogoLlave();
                Logger.timeEnd("BuscarCambios");
                
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
            this.http.get("/v1/catalogos/sincronizacion").subscribe(listaRemota=>{
                var lista = listaRemota as any[];
                for (var i = 0; i < lista.length; ++i) {
                    let dato={id:(lista[i])["nombreCatalogo"],uuid:(lista[i])["uuid"]};
                    obj.db.update("catalogoLlave",dato).then(E=>{
                        //Logger.log(E);
                    });
                
                }
                
            });
       
    }
    /**
     * Funcion recursiva para sincronizar catalogos. en teoria todo lo que viene en el arr se va a sincronizar. Este arreglo se inicializa en la funcion searchChange
     * @param i indice del arreglo
     * @param arr arreglos de catalogos, es un arreglo de la forma[{uri:"",catalogo:""},]
     * @param titulo string que indica si se sincronizan matrices o catalogos
     */
    private sincronizaCatalogos(i,arr:any[],titulo:string=""){
        if (i==0){
            Logger.time(titulo);
            Logger.log("%c" + "-> Iniciando Sincronizacion de "+titulo, "color: black;font-weight:bold;");
        }
        if (i==arr.length){
            //dejamos de sincronizar hasta que las matrices se bajen
            
            
            if (titulo=="matrices"){
                this.finalizoMatrix=true;
            }else{
                this.finalizoCatalogo=true;
            }
            if (this.finalizoMatrix && this.finalizoCatalogo){
                SincronizaCatalogos.sincronizando=false;
                this.dialogo.close();
            }
            Logger.log("%c" + "-> "+titulo+" sincronizadas", "color: blue;font-weight:bold;");
            Logger.timeEnd(titulo);
            return;
        }
        this.sincronizaMatrix(i,arr[i],arr,titulo);

    }
     /**
     * Funcion recursiva para sincronizar catalogos. Se encarga de descargar el catalogo definido en item y actualizarlo en indexeDB
     * @param i indice del arreglo
     * @param item es el elemento que se actualizara
     * @param arr arreglos de catalogos, es un arreglo de la forma[{uri:"",catalogo:""},]
     * @param titulo string que indica si se sincronizan matrices o catalogos
     */
    private sincronizaMatrix(i,item,arr,titulo:string=""){
        this.catalogo=item["catalogo"];
        Logger.log(this.catalogo);
        this.http.get(item["uri"]).subscribe((response) => {
            this.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                    this.sincronizaCatalogos(i+1,arr,titulo);
                });
        },
        (error)=>{
            Logger.log("Fallo el servicio "+item["uri"]);
            let catalogo=this.toCamelCase(item["catalogo"]);
            this.sincronizaCatalogos(i+1,arr,titulo);
            Logger.log("Borrar el catalogo", catalogo);
            this.db.delete("catalogoLlave",catalogo);
            this.error=true;
        });
    }


} 