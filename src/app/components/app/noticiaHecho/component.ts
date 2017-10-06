import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { Caso } from '@models/caso'
declare var componentHandler: any;

@Component({
    templateUrl:'./component.html'
})

export class NoticiaHechoComponent implements OnInit{

	public id: number = null;
	public caso: Caso = new Caso();
	private db: CIndexedDB;
	private sub: any;
	public returnRoute: string = '/';

	constructor(
		private route: ActivatedRoute,
		private _db: CIndexedDB
		) {
		this.db = _db;
	}

	ngOnInit(){
		if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

	    this.route.params.subscribe(params => {
	    	if(params['id']){
				this.id = +params['id'];
			}
			this.getReturnRoute();
	    });

	    // this.db.get("casos", this.id).then(object => {
	    // 	this.caso = Object.assign(this.caso, object);
	    // });
	}

	public hasId(): boolean{
		let hasId = false
		this.sub = this.route.params.subscribe(params => {
	    	if(params['id'])
				hasId = true;
	    });

	    return hasId;
	}

	public getReturnRoute(): string{
		if(this.hasId){
			this.returnRoute = `/caso/${this.id}/detalle`;
		}

		return this.returnRoute;
	}
}
