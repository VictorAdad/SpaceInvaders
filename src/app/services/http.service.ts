import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { _config} from '@app/app.config';
import 'rxjs/add/operator/map'

@Injectable()
export class HttpService {

	private http: Http;
	
	constructor(private _http: Http) {
		this.http = _http;
	}

	public get(_uri: string): Observable<any>{
        return this.http.get(_config.api.host+_uri)
            .map((response: Response) => response.json());
    }

    public post(_uri:string, _data: any): Observable<any>{
        return this.http.post(_config.api.host+_uri, _data)
            .map((response: Response) => response.json());
    }

    public put(_uri:string, _data: any): Observable<any>{
        return this.http.put(_config.api.host+_uri, _data)
            .map((response: Response) => response.json());
    }

    public getFile(_uri: string): Observable<any>{
        return this.http.get(_config.api.host+_uri, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob());
    }
    public getLocal(_uri: string): Observable<any>{
        return this.http.get(_uri, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob());
    }
}