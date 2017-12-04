import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { Caso } from '@models/caso';
import { Persona } from '@models/persona';
import { DelitoCaso } from '@models/delitoCaso';
import { Predenuncia } from '@models/predenuncia';
import { AuthenticationService } from '@services/auth/authentication.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";

@Component({
	templateUrl:'./component.html'
})

export class DetalleCasoComponent implements OnInit{
	
	public id: number = null;
	private route: ActivatedRoute;
	public onLine: OnLineService;
	private http: HttpService;
	public caso: Caso;
	public involucrados:Persona[];
	public delitos:DelitoCaso[];
	public predenuncia:Predenuncia;
	hasPredenuncia:boolean=false;
	hasAcuerdoInicio:boolean=false;
    hasRelacionVictimaImputado:boolean=false;

	constructor(
		_route: ActivatedRoute,
		public _onLine: OnLineService,
		private _http: HttpService,
		public auth: AuthenticationService,
		private db:CIndexedDB
		){
		this.route = _route;
		this.onLine = _onLine;
		this.http   = _http;
		this.caso = new Caso();
		this.predenuncia=new Predenuncia();
	}

	ngOnInit(){
		this.route.params.subscribe(params => {
	    	if(params['id'])
				this.id = +params['id'];
		});
		
		if(this.onLine.onLine){
			this.http.get('/v1/base/casos/'+this.id).subscribe((response) => {
				this.caso = response as Caso;
				this.hasPredenuncia = this.caso.hasPredenuncia;
				this.hasAcuerdoInicio = this.caso.hasAcuerdoInicio;
				this.hasRelacionVictimaImputado = this.caso.hasRelacionVictimaImputado;
                // Logger.log(this.caso)
            });
			this.http.get('/v1/base/personas-casos/casos/'+this.id+'/page').subscribe((response) => {
                this.involucrados = response.data as Persona[];    
                // Logger.log(this.involucrados)
            });
			this.http.get('/v1/base/delitos-casos/casos/'+this.id+'/page').subscribe((response) => {
                this.delitos = response.data as DelitoCaso[];    
                // Logger.log(this.delitos)
            });  
			/*this.http.get('/v1/base/predenuncias/casos/'+this.id).subscribe((response) => {
                this.predenuncia = response.data as Predenuncia;    
                Logger.log(this.predenuncia)
            });  */

        }else{
        	this.db.get("casos", this.id).then(
        		t => {
        			// Logger.log('T', t);
        			let relaciones = t['tipoRelacionPersonas'].filter(object => object['tipo'] === 'Imputado');
            		this.caso = t as Caso;
					this.hasPredenuncia = (typeof t['predenuncias'] !== 'undefined');
					this.hasRelacionVictimaImputado = (relaciones.length > 0);

					// Logger.log('Predenuncia', this.hasPredenuncia);
                }
            );
        }    
 
	}
}
