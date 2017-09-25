import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	templateUrl:'./component.html'
})

export class DetalleCasoComponent implements OnInit{
	
	public id: number = null;
	private route: ActivatedRoute;

	constructor(_route: ActivatedRoute){
		this.route = _route;
	}

	ngOnInit(){
		this.route.params.subscribe(params => {
	    	if(params['id'])
				this.id = +params['id'];
	    });
	}
}
