import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';

@Injectable()
export class SelectsService {

    paises = [];
    estados = [];
    sexo = [];
    escolaridad = [];
    ocupacion = [];
    estadoCivil = [];
    idioma=[];
    grupoEtnico = [];
    alfabetismo = [];
    interprete = [];
    adiccion   = [];

    constructor(
        private http: HttpService
        ) {
    }

    public getData(){
        // this.getPaises();
        this.getSexo();
        this.getEscolaridad();
        this.getOcupacion();
        this.getEstadoCivil();
        // this.getIdioma();
        this.getGrupoEtnico();
        this.getInterprete();
        this.getAdiccion();
    }

    public getPaises(){
        this.http.get('/v1/catalogos/pais/options').subscribe((response) => {
            console.log('getSexo()', response);
        });
    }   

    public getSexo(){
        this.http.get('/v1/catalogos/sexo/options').subscribe((response) => {
            console.log('getSexo()', response);
        });
    }    

    public getEscolaridad(){
        this.http.get('/v1/catalogos/escolaridad/options').subscribe((response) => {
            console.log('getEscolaridad()', response);
        });
    }

    public getOcupacion(){
        this.http.get('/v1/catalogos/ocupacion/options').subscribe((response) => {
            console.log('getOcupacion()', response);
        });
    }

    public getEstadoCivil(){
        this.http.get('/v1/catalogos/estado-civil/options').subscribe((response) => {
            console.log('getEstadoCivil()', response);
        });
    }

    public getIdioma(){
        this.http.get('/v1/catalogos/idioma/options').subscribe((response) => {
            console.log('getIdioma()', response);
        });
    }

    public getGrupoEtnico(){
        this.http.get('/v1/catalogos/grupo-etnico/options').subscribe((response) => {
            console.log('getGrupoEtnico()', response);
        });
    }

    public getInterprete(){
        this.http.get('/v1/catalogos/interprete/options').subscribe((response) => {
            console.log('getInterprete()', response);
        });
    }

    public getAdiccion(){
        this.http.get('/v1/catalogos/adiccion/options').subscribe((response) => {
            console.log('getAdiccion()', response);
        });
    }

    
}
