﻿/*

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
import { Usuario } from './user';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import * as moment from 'moment';

@Injectable()
export class AuthenticationService {

    public isLoggedin: boolean = false;

    public user: Usuario = new Usuario();

    public headers = new Headers();

    public roles:any;

    public subject = new Subject<any>();

    public db:CIndexedDB = null;
    public onLine:OnLineService;

    setDb(db):void{
        this.db=db;
    }
    setOnLine(onLine):void{
        this.onLine=onLine;
    }

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        this.headers.append('Authorization', 'Basic '+environment.oam.tokenApp);
        this.headers.append('X-OAUTH-IDENTITY-DOMAIN-NAME', environment.oam.domainName);

        let session = localStorage.getItem(environment.oam.session);

        if(session != null){
            this.isLoggedin = true;
            let usuario = JSON.parse(localStorage.getItem(environment.oam.session));
            this.user =  new Usuario(usuario);
            let request = this.getUser(usuario.token);

            request.subscribe(
                responseUser => {
                    responseUser['token'] =  usuario.token;
                    this.user = new Usuario(responseUser);
                    localStorage.setItem(environment.oam.session, JSON.stringify(responseUser));
                    this.isLoggedin = true;
                    this.http.get(environment.api.host+'/v1/base/notificaciones/usuario/'+this.user.username+'/sin-leer')
                    .map((response: Response) => response.json())
                    .subscribe( response =>  this.user.sinLeer = response.count );
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

    public login(username: string, password: string): Promise<any>{
        var obj=this;
        return new Promise(
            (resolve, reject ) =>{ 
                if (obj.onLine.onLine){
                    console.log("en linea");
                    var requestToken = this.getToken(username, password);
                    requestToken.subscribe(
                        response => {
                            let requestUser = this.getUser(response.access_token);
                            requestUser.subscribe(responseUser => {
                                console.log('Response User ',responseUser, this );
                                responseUser['token'] =  response.access_token;
                                this.user = new Usuario(responseUser);
                                localStorage.setItem(environment.oam.session, JSON.stringify(responseUser));
                                this.http.get(environment.api.host+'/v1/base/notificaciones/usuario/'+this.user.username+'/sin-leer')
                                .map((response: Response) => response.json())
                                .subscribe( response =>  this.user.sinLeer = response.count );  
                                responseUser["user"]=username;
                                responseUser["pass"]=password;
                                this.db.update("lastLogin",responseUser);
                                resolve("Usuario loguedo con éxito");
                            });
                        },
                        error => {
                            reject(error);
                        }
                    )
                }else{
                    console.log("offline");
                    obj.db.get("lastLogin",username).then(responseUser=>{
                        if (!responseUser){
                            reject("Falló el usuario o contraseña")
                        }
                        else if(responseUser["pass"]!=password){
                            reject("Falló el usuario o contraseña")
                        }else{
                            obj.user = new Usuario(responseUser);
                            localStorage.setItem(environment.oam.session, JSON.stringify(responseUser));
                            obj.http.get(environment.api.host+'/v1/base/notificaciones/usuario/'+obj.user.username+'/sin-leer')
                            .map((response: Response) => response.json())
                            .subscribe( response =>  obj.user.sinLeer = response.count );  
                            resolve("Usuario loguedo con éxito");
                        }
                    })
                }
            }
        );
    }

    public logout(): void {
        // Se elimina usuario del almacenamiento local
        localStorage.removeItem(environment.oam.session);
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

    public masDe3DiasSinConexion(){
        return new Promise( 
            (resolve,reject)=>{
                this.db.get("lastLogin", this.user.username).then(usuario=>{
                    var a=moment(usuario["lastLogin"]);
                    var hoy=moment();
                    var horas=hoy.diff(a, 'hours');
                    resolve(horas>72);
                }).catch(e=>{
                    reject(e);
                });
            });
    }
}



