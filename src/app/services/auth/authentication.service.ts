/*

El servicio de autenticación JWT se utiliza para iniciar sesión y 
cerrar la sesión de la aplicación, para iniciar la sesión registra 
las credenciales de los usuarios en en la api  de l backend falso y 
comprueba la respuesta de un token JWT, si hay una significa que la 
autenticación se ha completado con éxito. 
Almacenamiento y el token guardado en la propiedad AuthenticationService.token. 
La propiedad token es utilizada por otros servicios en la aplicación para establecer 
el encabezado de autorización de las solicitudes HTTP hechas para proteger los puntos 
finales de api. Los detalles de usuario registrados se almacenan en almacenamiento 
local para que el usuario se mantenga conectado si actualizan el navegador y también 
entre sesiones de explorador hasta que se desconecten. Si no desea que el usuario 
permanezca conectado entre actualizaciones o sesiones, el comportamiento podría cambiarse fácilmente almacenando detalles de usuario en algún lugar menos persistente, como el almacenamiento de sesión o en una propiedad del servicio de autenticación.

*/
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { _usuarios } from './usuarios';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;
    public isLoggedin: boolean;
    public user: Usuario;
    public roles: any;

    constructor(private http: Http) {
        // set token if saved in local storage
        // let usuario = JSON.parse(localStorage.getItem('user'))
        // if (localStorage.getItem("user") == null) {
        //     this.isLoggedin = false;
        // }
        // else {
        //     this.user   = new Usuario(usuario);
        //     this.token  = this.user && this.user.token;
        //     this.isLoggedin = true;
        // }

        this.roles = {
            'callCenter': 'callCenter',
            'uai': 'uai',
            'express': 'express',
            'mpuai': 'mpuai',
            'mpi': 'mpi',
            'admin': 'admin',
        }
    }

    // login(username: string, password: string): Observable<boolean> {
    login(username: string, password: string){

        console.log('login()');

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic d2VibG9naWM6V0VMQ09NRTE=');
        headers.append('Content-Type', 'application/json');

        let options = new RequestOptions({ headers: headers })
        let body = {
            "id":"oauthsigiclient",
            "scopes":["AttributesOUD.attrs"],
            "clientType":"CONFIDENTIAL_CLIENT",
            "idDomain":"OAuthSIGIDomain",
            "description":"SIGI Client",
            "name":"OAuthSIGIClient",
            "grantTypes": ["PASSWORD","CLIENT_CREDENTIALS","JWT_BEARER","REFRESH_TOKEN","AUTHORIZATION_CODE"],
            "defaultScope":"AttributesOUD.attrs"
        }

        var request = this.http.post(environment.oam.host, body, options)
            .map((response: Response) => response.json());
        request.subscribe(
            response => console.log('-> Response', response)
        )
    }

    logout(): void {
        // Se elimina usuario del almacenamiento local
        this.token = null;
        localStorage.removeItem('user');
        this.isLoggedin = false;
    }

    isLoggedIn(): boolean{
        //debugger;
        if (localStorage.getItem("user") == null) {
            this.isLoggedin = false;
            return this.isLoggedin;
        }
        else {
            return true;
        }
    }
}

export class Usuario {

    public nombreCompleto: string;
    public username: string;
    public roles: string[];
    public token: string;
    public fiscalia: string;
    public agencia: string;
    public turno: string;
    public autoridad: string;
    public distrito: string;
    public municipio: string;
    
    constructor(_usuario: any) {
        this.nombreCompleto = _usuario.nombreCompleto;
        this.username = _usuario.username;
        this.roles = this.setRoles(_usuario.roles);
        this.fiscalia = _usuario.fiscalia;
        this.agencia = _usuario.agencia;
        this.autoridad = _usuario.autoridad;
        this.turno = _usuario.turno;
        this.distrito = _usuario.distrito;
        this.municipio = _usuario.municipio;
    }

    public setRoles(_roles: string[]): string[]{
        let roles: string[] = [];

        for (let role of _roles) {
            roles.push(role);
        }

        return roles;
    }

    public hasRoles(..._roles): boolean{
        return _roles.some( role => this.roles.includes(role));
    }
}

export class Role {

    public nombre: string;
    
    constructor(_role: string) {
        this.nombre = _role;
    }
}



