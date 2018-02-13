import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http'

//Nota: Cuando se utilicen servicos se tiene que importar HttpModule en el archivo de modulo, sino muestra un error;



@Injectable()
export class MiservicioService{

    baseUrl: String = "https://api.github.com";
    userName: String = "saulsalazarmendez";

    constructor(private http: Http) { }

    getRepos(){
        return this.http.get(this.baseUrl+"/users/"+this.userName+"/repos");
    }

    list(){
        return JSON.parse(localStorage.getItem("MiServicioData"));
    }

    post(dato:MDato){
        let datos: MDato[] = JSON.parse(localStorage.getItem("MiServicioData"));
        datos.push(dato);
        //Actualizamos los datos
        localStorage.setItem("MiServicioData", JSON.stringify(datos));
        return dato;
    }

    update(id : number, dato: MDato){
        let datos: MDato[] = JSON.parse(localStorage.getItem("MiServicioData"));
        let dat: MDato = datos.find((data)=>{return data.id==id});
        if (dat==null)
            return null;
        let indice = datos.indexOf(dat);
        datos[indice].id = dato.id;
        datos[indice].nombre = dato.nombre;
        localStorage.setItem("MiServicioData", JSON.stringify(datos));
        return datos[indice];
    }

    get(id : number){
        let datos: MDato[] = JSON.parse(localStorage.getItem("MiServicioData"));
        return datos.find((data)=>{return data.id==id});
    }

    delete(id: number){
        let datos: MDato[] = JSON.parse(localStorage.getItem("MiServicioData"));
        let dat: MDato = datos.find((data)=>{return data.id==id});
        let indice = datos.indexOf(dat);
        datos.splice(indice, 1);
        localStorage.setItem("MiServicioData", JSON.stringify(datos));
        return datos;
    }


}

export class MDato{
    nombre: string;
    id: number;
    materno: number;
    paterno: string;
    usuario: string;
} ;
