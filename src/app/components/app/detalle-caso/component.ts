import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { Caso } from '@models/caso';

@Component({
	templateUrl:'./component.html'
})

export class DetalleCasoComponent implements OnInit{
	
	public id: number = null;
	private route: ActivatedRoute;
	private onLine: OnLineService;
	private http: HttpService;
	caso: Caso;

	constructor(_route: ActivatedRoute, private _onLine: OnLineService, private _http: HttpService){
		this.route = _route;
		this.onLine = _onLine;
		this.http   = _http;
		this.caso = new Caso();
	}

	ngOnInit(){
		this.route.params.subscribe(params => {
	    	if(params['id'])
				this.id = +params['id'];
		});
		
		if(this.onLine.onLine){
			this.http.get('/v1/base/casos/'+this.id).subscribe((response) => {
                this.caso = response as Caso;
            });
		}
	}
}
