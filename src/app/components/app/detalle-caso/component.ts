import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	templateUrl:'./component.html',
	styleUrls: ['./component.css']
})

export class DetalleCasoComponent implements OnInit{
	
	id: number = null;

	route: ActivatedRoute;

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
