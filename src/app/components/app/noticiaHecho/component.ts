import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var componentHandler: any;

@Component({
    templateUrl:'./component.html',
    styleUrls  : [
        './styles/tabs.css'
    ]
})

export class NoticiaHechoComponent implements OnInit{

	id: number = null;
	private sub: any;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(){
		if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

	    this.sub = this.route.params.subscribe(params => {
	    	if(params['id'])
				this.id = +params['id'];
	    });

	    console.log('-> ID: ', this.id);
	}

	hasId(): boolean{
		let hasId = false
		this.sub = this.route.params.subscribe(params => {
	    	if(params['id'])
				hasId = true;
	    });

	    return hasId;
	}
}
