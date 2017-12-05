import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

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
		public http: HttpService,
		public  onLine: OnLineService,
		public db:CIndexedDB
		){
	}

	ngOnInit(){
		this.getCaso(this.id);
	}

	public getCaso(_id){
        // Logger.log('CasoComponent@getCaso');
        if (this.onLine.onLine){
        	this.http.get('/v1/base/casos/'+this.id).subscribe(
				response => {
					// Logger.log('Caso', response);
					if(response.hasPredenuncia){
		            	this.nic = response.nic
		            	this.nuc = response.nuc
	            	}
	        	}
	        );
        }else{
			this.db.get("casos",this.id).then(caso=>{
				//Logger.log("CASO",caso);
				if(caso['hasPredenuncia']){
					this.nic=caso["nic"];
					this.nuc=caso["nuc"];
				}
			});
		}
		// Logger.log(this);
    }
}



