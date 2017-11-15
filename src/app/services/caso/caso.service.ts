import { Injectable } from '@angular/core';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService } from '@services/onLine.service';

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
		console.log('Caso@setOnlineCaso')
		this.setCaso(response);
		this.db.clear("casos").then( t =>{
            this.db.update("casos",this.caso).then( t =>{
            	console.log('Indexed Caso actualizado');
            });
        });
        console.log(this.caso);
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

	public getNic(){
		return this.nic;
	}
}