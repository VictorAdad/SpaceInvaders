import { Injectable } from '@angular/core';


import {Observable} from 'rxjs/Rx';

import {MatSnackBar} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import {CatalogosACargar} from "@services/onLine/CatalogosACargar"


@Injectable()
export class OnLineService {
    onLine: boolean = true;
    timer = Observable.timer(2000,1000);
    //este timer se executa cada hora, la primera se sera a los 14s de iniciar la app
    timerSincronizarMatrices = Observable.timer(7000,1000*60*60);
    anterior: boolean= true;


    constructor(
        public snackBar: MatSnackBar,
        private db:CIndexedDB,
        private http:HttpService
    ) { 
        // timer = Observable.timer(2000,1000);
        this.timer.subscribe(t=>{
            this.anterior=this.onLine;
            this.onLine=navigator.onLine;
            let message="Se perdio la conexión";
            if(this.onLine){
                message="Se extablecio la conexión";
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

    
}
