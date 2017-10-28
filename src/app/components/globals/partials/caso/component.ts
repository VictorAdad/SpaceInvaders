import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
	selector    : 'caso-nic',
  	templateUrl : './component.html'
})
export class CasoNicComponent implements OnInit{

	@Input()
	public id: number;

	public nic: any;

	public nuc: any;

	
	constructor(
		public route: ActivatedRoute,
		public http: HttpService
		){
	}

	ngOnInit(){
		this.getCaso(this.id);
	}

	public getCaso(_id){
        console.log('CasoComponent@getCaso')
		this.http.get('/v1/base/casos/'+this.id).subscribe(
			response => {
				console.log('Caso', response);
            	this.nic = response.nic
        	}
        );
	}
}



