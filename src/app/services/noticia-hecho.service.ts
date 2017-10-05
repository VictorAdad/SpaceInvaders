import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';

@Injectable()
export class NoticiaHechoService {

    id:number;
    lugares   = [];
    vehiculos = [];
    armas     = [];
    personas  = [];

    constructor(
        private http: HttpService
        ) {
    }

    public setId(_id: number){
        this.id = _id;
    }

    public getData(){
        this.getLugares();
        // this.getVehiculos();
        // this.getArmas();
        // this.getPersonas();
    }

    public getLugares(){
        this.http.get('/v1/base/lugares/casos/'+this.id).subscribe((response) => {
            console.log('getVehiculos()', response);
        });
    }    

    public getVehiculos(){
        this.http.get('/v1/base/vehiculos/casos/'+this.id).subscribe((response) => {
            console.log('getVehiculos()', response);
        });
    }

    public getArmas(){
        this.http.get('/v1/base/armas/casos/'+this.id).subscribe((response) => {
            console.log('getVehiculos()', response);
        });
    }

    public getPersonas(){
        this.http.get('/v1/base/personas/casos/'+this.id).subscribe((response) => {
            console.log('getVehiculos()', response);
        });
    }

    
}
