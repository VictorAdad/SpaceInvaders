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
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;
    public isLoggedin: boolean;

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        if (localStorage.getItem("currentUser") == null) {
            this.isLoggedin = false;
        }
        else {
             this.isLoggedin = true;
        }
    }

    // login(username: string, password: string): Observable<boolean> {
    login(username: string, password: string){
        //realizando peticion POST a la API del Backend falso
        
        // return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
        //     .map((response: Response) => {
        //         // Si hay un JWT en la respuesta significa que se autenticó correctamente
        //         let token = response.json() && response.json().token;
        //         if (token) {
        //             // Se guarda el JWT token 
        //             this.token = token;

                    // se guarda el nombre del usuario logueado en el Localstorage(donde???)
                    // para preservalo incluso cuando la pagina se refresca
                    // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                    localStorage.setItem('currentUser', JSON.stringify({ username: username}));
                    this.isLoggedin = true;
                
                    // return true;
            //     } else {

            //         return false;
            //     }
            // });
    }

    logout(): void {
        // Se elimina usuario del almacenamiento local
        this.token = null;
        localStorage.removeItem('currentUser');
        this.isLoggedin = false;
    }

    isLoggedIn(): boolean{
        //debugger;
        if (localStorage.getItem("currentUser") == null) {
            this.isLoggedin = false;
            return this.isLoggedin;
        }
        else {
            return true;
        }
    }
}