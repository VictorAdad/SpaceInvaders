import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { _config} from '@app/app.config';
import { AuthenticationService } from '@services/auth/authentication.service';
import { GlobalService } from "@services/global.service";
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
/**
 * Servicio para manejar las peticiones http, la ventaja de tener nuestro propio servicio es que podemos agregar desde aqui header addicionales y comunes en todas las peticiones.
 */
@Injectable()
export class HttpService {

	private http: Http;

    private headers: Headers;

	constructor(
        private _http: Http,
        public auth: AuthenticationService,
        public global : GlobalService) {
		this.http = _http;
	}
    /**
     * Funcion para hacer una peticion get
     * @param _uri uri que se utilizara en el servico
     */
	public get(_uri: string): Observable<any>{
        return this.http.get(environment.api.host+_uri, this.getHeaders())
            .map((response: Response) => response.json())
            .catch(this.onError.bind(this));
    }
    /**
     * funcion para hacer el post
     * @param _uri uri que se utilizara en el servico
     * @param _data datos a enviar
     */
    public post(_uri:string, _data: any): Observable<any>{
        return this.http.post(environment.api.host+_uri, _data, this.getHeaders())
            .map((response: Response) => response.json())
            .catch(this.onError.bind(this));
    }
    /**
     * Funcion para hacer un put, nota no hay peticion update.
     * @param _uri uri que se utilizara en el servico
     * @param _data 
     */
    public put(_uri:string, _data: any): Observable<any>{
        return this.http.put(environment.api.host+_uri, _data, this.getHeaders())
            .map((response: Response) => response.json())
            .catch(this.onError.bind(this));
    }
    /**
     * Funcion para solicitar un archivo del servio de documentos
     * @param _uri uri que se utilizara en el servico
     */
    public getFile(_uri: string): Observable<any>{
        return this.http.get(environment.api.host+_uri, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob())
            .catch(this.onError.bind(this));
    }
    /**
     * No se ocupa de momento
     * @param _uri uri que se utilizara en el servico
     */
    public getLocal(_uri: string): Observable<any>{
        return this.http.get(_uri, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob())
            .catch(this.onError.bind(this));
    }

    /**
     * Función para construir los headers default para las peticiones
     * @param _headers Objeto con headers adidcionales para la petición
     */
    private getHeaders(_headers: any = null){
        this.headers = new Headers();
        this.headers.append('SIGI-Token', this.auth.user.token);
        
        return new RequestOptions({ headers: this.headers });
    }

    /**
     * Función para manipular el error de la petición HTTP
     * @param _error Objeto con respuesta de error de la petición
     */
    private onError(_error){
        // console.log('HttpService@onError()', _error);
        // if(_error.status === 401){
        //     console.error('La sesión de usuario ha expirado');
        //     this.auth.isLoggedin = false;
        //     this.global.openSnackBar('Su tiempo de sesión ha expirado');
        // }

        return Observable.throw(_error)
    }


}
