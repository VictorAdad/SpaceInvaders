import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { _config} from '@app/app.config';
import { environment } from './../../environments/environment';
import 'rxjs/add/operator/map'
/**
 * Servicio para manejar las peticiones http, la ventaja de tener nuestro propio servicio es que podemos agregar desde aqui header addicionales y comunes en todas las peticiones.
 */
@Injectable()
export class HttpService {

	private http: Http;

	constructor(private _http: Http) {
		this.http = _http;
	}
    /**
     * Funcion para hacer una peticion get
     * @param _uri uri que se utilizara en el servico
     */
	public get(_uri: string): Observable<any>{
        return this.http.get(environment.api.host+_uri)
            .map((response: Response) => response.json());
    }
    /**
     * funcion para hacer el post
     * @param _uri uri que se utilizara en el servico
     * @param _data datos a enviar
     */
    public post(_uri:string, _data: any): Observable<any>{
        return this.http.post(environment.api.host+_uri, _data)
            .map((response: Response) => response.json());
    }
    /**
     * Funcion para hacer un put, nota no hay peticion update.
     * @param _uri uri que se utilizara en el servico
     * @param _data 
     */
    public put(_uri:string, _data: any): Observable<any>{
        return this.http.put(environment.api.host+_uri, _data)
            .map((response: Response) => response.json());
    }
    /**
     * Funcion para solicitar un archivo del servio de documentos
     * @param _uri uri que se utilizara en el servico
     */
    public getFile(_uri: string): Observable<any>{
        return this.http.get(environment.api.host+_uri, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob());
    }
    /**
     * No se ocupa de momento
     * @param _uri uri que se utilizara en el servico
     */
    public getLocal(_uri: string): Observable<any>{
        return this.http.get(_uri, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob());
    }
}
