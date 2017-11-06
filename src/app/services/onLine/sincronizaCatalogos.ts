import {CatalogosACargar} from "@services/onLine/CatalogosACargar";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';

export class SincronizaCatalogos {

    constructor(
        private db:CIndexedDB,
        private http:HttpService,
        ){
        console.log("Sincroniza catalogos papu, oh yea!!");
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

    public nuevo(){
        this.bajaCatalogoLlave();
        this.sincronizaCatalogos(0,CatalogosACargar.matricesASincronizar,"matrices");
        this.sincronizaCatalogos(0,CatalogosACargar.catalogosASincronizar,"catalogos");
    }

    private bajaCatalogoLlave(){
        var obj=this;
            this.http.get("/v1/catalogos/sincronizacion").subscribe(listaRemota=>{
                var lista = listaRemota as any[];
                console.log("La lista",lista);
                for (var i = 0; i < lista.length; ++i) {
                    let dato={id:(lista[i])["id"] ,nombreCatalogo:(lista[i])["nombreCatalogo"],uuid:(lista[i])["uuid"]};
                    console.log(dato);
                    obj.db.update("catalogoLlave",dato).then(E=>{
                        console.log(E);
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
            console.log("%c" + "-> "+titulo+" sincronizadas", "color: blue;font-weight:bold;");
            console.timeEnd(titulo);
            this.db.list("catalogoLlave").then(lista=>{
                console.log("Lista CatalogoLlave",lista);
            });
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