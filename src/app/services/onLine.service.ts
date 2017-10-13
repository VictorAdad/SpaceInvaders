import { Injectable } from '@angular/core';


import {Observable} from 'rxjs/Rx';

import {MdSnackBar} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';


@Injectable()
export class OnLineService {
    onLine: boolean = true;
    timer = Observable.timer(2000,1000);
    //este timer se executa cada hora, la primera se sera a los 14s de iniciar la app
    timerSincronizarMatrices = Observable.timer(7000*2,1000*60*60);
    anterior: boolean= true;

    matricesASincronizar=[
        //persona
        {
            catalogo:"oreja",
            uri:"/v1/catalogos/media-filiacion/oreja"
        },
        {
            catalogo:"labio_ojo",
            uri:'/v1/catalogos/media-filiacion/labio-ojo'
        },
        {
            catalogo:"frente_menton",
            uri:'/v1/catalogos/media-filiacion/frente-menton'

        },
        {
            catalogo:"complexion_piel_sangre",
            uri:'/v1/catalogos/media-filiacion/complexion-piel-sangre'
        },
        {
            catalogo:"ceja_boca",
            uri:'/v1/catalogos/media-filiacion/ceja-boca'

        },
        {
            catalogo:"cara_nariz",
            uri:'/v1/catalogos/media-filiacion/cara-nariz'

        },
        {
            catalogo:"cabello",
            uri:'/v1/catalogos/media-filiacion/cabello'

        },
        {
            catalogo:"nacionalidad_religion",
            uri:'/v1/catalogos/nacionalidad-religion'

        },
        {
            catalogo:"idioma_identificacion",
            uri:'/v1/catalogos/persona/idioma'

        },
        //armas
        {
            catalogo:"clase_arma",
            uri:'/v1/catalogos/arma/clase-arma' 

        },
        {
            catalogo:"calibre_mecanismo",
            uri:'/v1/catalogos/arma/calibre-mecanismo'    
        },
        //lugares
        {
            catalogo:"detalle_lugar", 
            uri:'/v1/catalogos/lugar/detalle-lugar'
        },
        //vehiculos
        {
            catalogo:"tipo_uso_tipo_vehiculo",
            uri:'/v1/catalogos/vehiculo/tipo-uso-vehiculo'

        },
        {
            catalogo:"procedencia_aseguradora",
            uri:'/v1/catalogos/vehiculo/procedencia-aseguradora'

        },
        {
            catalogo:"motivo_color_clase",
            uri:'/v1/catalogos/vehiculo/motivo-color-clase'

        },
        {
            catalogo:"marca_submarca",
            uri:'/v1/catalogos/vehiculo/marca-submarca'


        },
        //relacion
        {
            catalogo:"modalidad_ambito",
            uri:'/v1/catalogos/relacion/modalidad-ambito'
        },
        {
            catalogo:"violencia_genero",
            uri:'/v1/catalogos/relacion/violencia-genero'
        },
        {
            catalogo:"tipo_transportacion",
            uri:'/v1/catalogos/relacion/tipo-transportacion'
        },
        {
            catalogo:"efecto_detalle",
            uri:'/v1/catalogos/relacion/efecto-detalle'
        },
        {
            catalogo:"desaparicion_consumacion",
            uri:'/v1/catalogos/relacion/desaparicion-consumacion'
        },
        {
            catalogo:"consucta_detalle",
            uri:'/v1/catalogos/relacion/conducta-detalle'
        },


    ];


    constructor(
        public snackBar: MdSnackBar,
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

        this.timerSincronizarMatrices.subscribe(t=>{
            console.log("%c" + "-> Iniciando Sincronizacion", "color: black;font-weight:bold;");
            this.sincronizaMatrices(0);
        });
    }

    private sincronizaMatrices(i){
        if (i==this.matricesASincronizar.length){
            console.log("%c" + "-> Matrices sincronizadas", "color: blue;font-weight:bold;");
            return;
        }
        this.sincronizaMatrix(i,this.matricesASincronizar[i]);

    }

    private sincronizaMatrix(i,item){
        this.http.get(item["uri"]).subscribe((response) => {
            if (Array.isArray(response)){
                this.db.update("catalogos",{id:item["catalogo"], arreglo:response}).then(e=>{
                    this.sincronizaMatrices(i+1);
                });
            }else
                this.sincronizaMatrices(i+1);
        },
        (error)=>{
            console.log("Fallo el servicio "+item["uri"]);
            this.sincronizaMatrices(i+1);
        });
    }

    
}
