import { Injectable } from '@angular/core';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService } from '@services/onLine.service';

@Injectable()
export class CasoService{

	public id: any;
	public caso: any;

	constructor(
		private db: CIndexedDB,
		private http: HttpService,
		private onLine: OnLineService
		) {}


	public find(_id){
		if(this.id !== _id){
			this.id = _id;
			if(this.onLine.onLine){
				this.http.get(`/v1/base/casos/${this.id}/all`).subscribe(
					this.setOnlineCaso.bind(this)
				)
			}else{
				this.db.get("casos", this.id).then(
	        		this.setCaso.bind(this)
	            );
			}
		}
	}

	public setOnlineCaso(response){
		console.log('Caso@setOnlineCaso')
		this.caso = response;
		this.db.clear("casos").then( t =>{
            this.db.update("casos",this.caso).then( t =>{
            	console.log('Indexed Caso actualizado');
            });
        });
	}

	public setCaso(caso){
		this.caso = caso;
	}
}