import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { DialogSincrinizarService} from "@services/onLine/dialogSincronizar.service";
import { Logger } from "@services/logger.service";


export class SincronizaCatalogos {
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
    //transforma de camel case to guion case
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

    private arrayToCamelCase(arr:any[]){
        let arreglo=new Array<any>();
        return arreglo;
    }

    public nuevo(){
        SincronizaCatalogos.sincronizando=true;
        this.bajaCatalogoLlave();
        this.finalizoCatalogo=false;
        this.finalizoMatrix=false;
        this.dialogo.open();
        this.sincronizaCatalogos(0,CatalogosACargar.matricesASincronizar,"matrices");
        this.sincronizaCatalogos(0,CatalogosACargar.catalogosASincronizar,"catalogos");
    }

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
                
            });
        },error=>{
            Logger.log(error);
            this.dialogo.close();
        });
        //this.dialogo.close();
    }

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

    private sincronizaCatalogos(i,arr:any[],titulo:string=""){
        if (i==0){
            Logger.time(titulo);
            Logger.log("%c" + "-> Iniciando Sincronizacion de "+titulo, "color: black;font-weight:bold;");
        }
        if (i==arr.length){
            //dejamos de sincronizar hasta que las matrices se bajen
            
            
            if (titulo=="matrices"){
                this.finalizoMatrix=true;
                SincronizaCatalogos.sincronizando=false;
            }else{
                this.finalizoCatalogo=true;
            }
            if (this.finalizoMatrix && this.finalizoCatalogo)
                this.dialogo.close();
            Logger.log("%c" + "-> "+titulo+" sincronizadas", "color: blue;font-weight:bold;");
            Logger.timeEnd(titulo);
            return;
        }
        this.sincronizaMatrix(i,arr[i],arr,titulo);

    }

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