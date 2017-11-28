import { Injectable } from '@angular/core';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService } from '@services/onLine.service';
import * as moment from 'moment';

@Injectable()
export class CasoService{

	public id: any;
	public caso: Caso = new Caso();

	constructor(
		private db: CIndexedDB,
		private http: HttpService,
		private onLine: OnLineService
		) {}


	public find(_id){
		return new Promise<any>(
			(resolve, reject) => {
				if(this.id !== _id){
					this.id = _id;
					if(this.onLine.onLine){
						this.http.get(`/v1/base/casos/${this.id}/all`).subscribe(
							response => {
								resolve(this.setOnlineCaso(response));
							}
						)
					}else{
						this.db.get("casos", this.id).then(
							response => {
			        			resolve(this.setCaso(response));
		        			}
			            );
					}
				}else{
                    resolve("El caso ya esta");
                }
			}
		);
	}

	public setOnlineCaso(response){
		// console.log('Caso@setOnlineCaso')
		this.setCaso(response);
		this.db.clear("casos").then( t =>{
            this.db.update("casos",this.caso).then( t =>{
            	// console.log('Indexed Caso actualizado');
            });
        });
        // console.log(this.caso);
	}

	public setCaso(caso){
		Object.assign(this.caso, caso)
	}
}

export class Caso{
	
	public armas: any[];
	public descripcion: string
	public hasRelacionVictimaImputado: boolean
	public hasPredenuncia: boolean
	public entrevistas: any[];
	public created: number;
	public titulo: string;
	public nic: string;
	public vehiculos: any[];
	public estatus: string;
	public personaCasos: any[];
	public delitoPrincipal: any;
	public predenuncias: any;
	public delitoCaso: any[];
	public id: number;
	public lugares: any[];
	public nuc: string
	public tipoRelacionPersonas: any[];



	public findVictima(){
		console.log('Caso@findVictima', this.personaCasos);
		let personas = this.personaCasos.filter(
			object => { 
				return object.tipoInterviniente.id === _config.optionValue.tipoInterviniente.victima
			}
		);
		return personas[0];
	}

	public formatCreated (){
		moment.locale('es');
       return moment(this.created).format('LL'); 
    }

    public formatHoraCreated(){
    	return moment(this.created).format('LT');
    }

    public formatFecha(_date){
    	let date = '';

    	if(_date != null)
    		date = moment(_date).format('LL')

    	return date;
    }

    //Metódos de persona
    public getAlias(_persona){
		console.log('Caso@getAlias()', _persona);
		if(_persona.persona.aliasNombrePersona.length > 0){
			let nombres =  _persona.persona.aliasNombrePersona.map(object => { return object.nombre });
			return nombres.toString();
		}else{
			return '';
		}
	}

	public getDomicilios(_persona){
		console.log('Caso@getDomicilios()', _persona);
		let domicilios:any[] = [];

		for (let localizacion of _persona.persona.localizacionPersona) {
			let domicilio = '';
			domicilio += ' '+localizacion.calle;
			domicilio += ' '+localizacion.noInterior;
			domicilio += ' '+localizacion.noExterior;
			if(localizacion.colonia != null)
				domicilio += ' '+localizacion.colonia.nombre;
			if(localizacion.municipio  != null)
				domicilio += ' '+localizacion.municipio.nombre;
			if(localizacion.estado)
				domicilio += ' '+localizacion.estado.nombre;

			domicilios.push(domicilio);
		}

		return domicilios.toString();
	}


}