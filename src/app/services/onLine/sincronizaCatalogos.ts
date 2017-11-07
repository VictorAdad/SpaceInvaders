import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';

export class SincronizaCatalogos {


    public static sincronizando:boolean;

    constructor(
        private db:CIndexedDB,
        private http:HttpService,
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
                console.log(i,copia);
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
        this.http.get(item["uri"]).subscribe((response) => {
            this.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                    
                });
        },
        (error)=>{
            console.log("Fallo el servicio "+item["uri"]);
        });
    }

    public searchChange(){
        //si se esta sincronizando los catalogos por primera vez
        if (SincronizaCatalogos.sincronizando)
            return;
        var obj=this;
        console.time("BuscarCambios");
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
                            obj.actualizaCatalogo(item);
                            cambio=true;
                        }
                        console.log("actualizar este catalogo",itemR, nombreCatalogo,item);
                    }
                }
                //actualizamos el catalogo de llaves
                if(cambio)
                    obj.bajaCatalogoLlave();
                console.timeEnd("BuscarCambios");
            });
        });
    }

    private bajaCatalogoLlave(){
        var obj=this;
            this.http.get("/v1/catalogos/sincronizacion").subscribe(listaRemota=>{
                var lista = listaRemota as any[];
                for (var i = 0; i < lista.length; ++i) {
                    let dato={id:(lista[i])["nombreCatalogo"],uuid:(lista[i])["uuid"]};
                    obj.db.update("catalogoLlave",dato).then(E=>{
                        //console.log(E);
                    });
                
                }
                
            });
       
    }

    private sincronizaCatalogos(i,arr:any[],titulo:string=""){
        if (i==0){
            console.time(titulo);
            console.log("%c" + "-> Iniciando Sincronizacion de "+titulo, "color: black;font-weight:bold;");
        }
        if (i==arr.length){
            //dejamos de sincronizar hasta que las matrices se bajen
            if (titulo=="matrices")
                SincronizaCatalogos.sincronizando=false;
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


} 