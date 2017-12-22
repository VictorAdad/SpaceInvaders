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
import { Subject } from 'rxjs/Subject';
import { _usuarios } from './usuarios';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

    public isLoggedin: boolean = false;

    public user: Usuario = new Usuario();

    public headers = new Headers();

    public roles:any;

    public subject = new Subject<any>();

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        this.headers.append('Authorization', 'Basic '+environment.oam.tokenApp);
        this.headers.append('X-OAUTH-IDENTITY-DOMAIN-NAME', environment.oam.domainName);

        let session = localStorage.getItem(environment.oam.session);

        if(session != null){
            this.isLoggedin = true;
            let usuario = JSON.parse(localStorage.getItem(environment.oam.session));
            let request = this.getUser(usuario.token);

            request.subscribe(
                responseUser => {
                    responseUser['token'] =  usuario.token;
                    this.user = new Usuario(responseUser);
                    localStorage.setItem(environment.oam.session, JSON.stringify(this.user));
                    this.isLoggedin = true;
                },
                error => this.isLoggedin = false
            );
        }


        this.roles = {
            'callCenter': 'Call Center',
            'uai': 'uai',
            'express': 'express',
            'mpuai': 'mpuai',
            'mpi': 'M.P.I',
            'admin': 'Admin',
        }
    }

    public login(username: string, password: string){

        var requestToken = this.getToken(username, password);
        requestToken.subscribe(
            response => {
                let requestUser = this.getUser(response.access_token);

                requestUser.subscribe(responseUser => {
                    console.log('Response User '+responseUser );
                    responseUser['token'] =  response.access_token;
                    this.user = new Usuario(responseUser);
                    localStorage.setItem(environment.oam.session, JSON.stringify(this.user));
                    this.isLoggedin = true;
                });
            }
        )
    }

    public logout(): void {
        // Se elimina usuario del almacenamiento local
        localStorage.removeItem('user');
        this.isLoggedin = false;
    }

    private getToken(_username, _password){
        let body = `grant_type=PASSWORD&username=${_username}&password=${_password}&scope=AttributesOUD.attrs`
        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(environment.oam.host+'/oauth2/rest/token', body, options)
            .map((response: Response) => response.json());
    }

    private getUser(_token){
        let options = new RequestOptions({ headers: this.headers });

        return this.http.get(environment.oam.host+'/oauth2/rest/token/info?access_token='+_token, options)
            .map((response: Response) => response.json());

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
    
    constructor(_usuario: any =  null) {
        if(_usuario != null){
            console.log('New Usuario()', _usuario);
            this.nombreCompleto = _usuario.sub;
            this.username = _usuario.sub;
            this.roles = this.setRoles(_usuario.Roles);
            this.token = _usuario.token;
            this.fiscalia = _usuario.Municipio;
            this.agencia = _usuario.Municipio;
            this.autoridad = _usuario.Municipio;
            this.turno = _usuario.Turno;
            // this.distrito = _usuario.distrito;
            this.municipio = _usuario.Municipio;
        }
    }

    public setRoles(_roles: string): string[]{
        let roles: string[] = _roles.split('\\,');

        return roles;
    }

    public hasRoles(..._roles): boolean{
        if(this.roles)
            return _roles.some( role => this.roles.includes(role));
        else
            return false;   
     }
}

export class Role {

    public nombre: string;
    
    constructor(_role: string) {
        this.nombre = _role;
    }
}



