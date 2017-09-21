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

	id: number;
	private sub: any;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(){
		if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

	    this.sub = this.route.params.subscribe(params => {
			this.id = +params['id'];
	    });

	    console.log('-> ID: ', this.id);
	}
}
