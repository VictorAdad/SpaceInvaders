import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'

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
            this.lugares = this.constructOptionsLugar(response);
        });
    }    

    public getVehiculos(){
        this.http.get('/v1/base/vehiculos/casos/'+this.id).subscribe((response) => {
            this.vehiculos = this.constructOptionsVehiculo(response);
        });
    }

    public getArmas(){
        this.http.get('/v1/base/armas/casos/'+this.id).subscribe((response) => {
            this.armas = this.constructOptionsArma(response);
        });
    }

    public getPersonas(){
        this.http.get('/v1/base/personas/casos/'+this.id).subscribe((response) => {
            this.personas = this.constructOptionsPersona(response);
        });
    }

    private constructOptionsLugar(_data:any){
        let options: MOption[] = [];


        _data.forEach(object => {
            options.push({value: object.id, label: object.calle});
        });

        return options;
    }

    private constructOptionsVehiculo(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }

    private constructOptionsArma(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }

    private constructOptionsPersona(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }

    
}
