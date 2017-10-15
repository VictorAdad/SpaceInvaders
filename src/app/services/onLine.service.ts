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
    timerSincronizarMatrices = Observable.timer(7000,1000*60*60);
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

    catalogosASincronizar=[
        //persona
        {
            catalogo:"delito",
            uri:"/v1/catalogos/delitos"
        },
        {
            catalogo:"modalidad_delito",
            uri:'/v1/catalogos/relacion/modalidad-delito/options'
        },
        {
            catalogo:"concurso_delito",
            uri:'/v1/catalogos/relacion/concurso-delito/options'
        },
        {
            catalogo:"grado_participacion",
            uri:'/v1/catalogos/relacion/grado-participacion/options'
        },
        {
            catalogo:"forma_comision",
            uri:'/v1/catalogos/relacion/forma-comision/options'
        },
        {
            catalogo:"clasificiacion_delito_orden",
            uri:'/v1/catalogos/relacion/clasificacion-delito-orden/options'
        },
        {
            catalogo:"forma_accion",
            uri:'/v1/catalogos/relacion/forma-accion/options'
        },
        {
            catalogo:"elemento_comision",
            uri:'/v1/catalogos/relacion/elemento-comision/options'
        },
        {
            catalogo:"forma_conducta",
            uri:'/v1/catalogos/relacion/forma-conducta/options'
        },
        {
            catalogo:"sexo",
            uri:'/v1/catalogos/persona/sexo/options'
        },
        {
            catalogo:"escolaridad",
            uri:'/v1/catalogos/persona/escolaridad/options'
        },
        {
            catalogo:"ocupacion", 
            uri:'/v1/catalogos/persona/ocupacion/options'
        },
        {
            catalogo:"estado_civil",
            uri:'/v1/catalogos/persona/estado-civil/options'
        },
        {
            catalogo:"grupo_etnico",
            uri:'/v1/catalogos/persona/grupo-etnico/options'
        },
        {
            catalogo:"alfabetismo",
            uri:'/v1/catalogos/persona/alfabetismo/options'
        },
        {
            catalogo:"interprete",
            uri:'/v1/catalogos/persona/interprete/options'
        },
        {
            catalogo:"pais",
            uri:'/v1/catalogos/pais/options'
        },
        {
            catalogo:"estado",
            uri:'/v1/catalogos/estado'
        },
        {
            catalogo:"municipio",
            uri:'/v1/catalogos/municipio'
        },
        {
            catalogo:"distrito",
            uri:'/v1/catalogos/usuario/distrito/options'
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
        if(localStorage.getItem('sincronizacion') !== 'true')
            this.timerSincronizarMatrices.subscribe(t=>{
                this.sincronizaCatalogos(0,this.matricesASincronizar,"matrices");
                this.sincronizaCatalogos(0,this.catalogosASincronizar,"catalogos");
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
