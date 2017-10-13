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
    delitos   = [];
    //Tipos de Intervinientes
    imputados = [];
    testigos  = [];
    victimas  = [];
    apoderadosLegales = [];
    defensoresPublicos  = [];
    defensoresPrivados  = [];
    representantesLegales  = [];
    asesoresPublicos  = [];
    asesoresPrivados  = [];
    ofendidos  = [];
    policias  = [];

    constructor(
        private http: HttpService
        ) {
    }

    public setId(_id: number){
        this.id = _id;
    }

    public getData(){
        this.getLugares();
        this.getVehiculos();
        this.getArmas();
        // this.getPersonas();
        this.getDelitos()
        this.getInterviniente('apoderadosLegales', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/1`, this.constructOptionsPersona);
        this.getInterviniente('defensoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/2`, this.constructOptionsPersona);
        this.getInterviniente('representantesLegales', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/3`, this.constructOptionsPersona);
        this.getInterviniente('asesoresPrivados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/4`, this.constructOptionsPersona);
        this.getInterviniente('imputados', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/5`, this.constructOptionsPersona);
        this.getInterviniente('testigos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/6`, this.constructOptionsPersona);
        this.getInterviniente('asesoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/7`, this.constructOptionsPersona);
        this.getInterviniente('ofendidos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/8`, this.constructOptionsPersona);
        this.getInterviniente('victimas', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/9`, this.constructOptionsPersona);
        this.getInterviniente('defensoresPublicos', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/10`, this.constructOptionsPersona);
        this.getInterviniente('policias', `/v1/base/personas-casos/casos/${this.id}/tipos-intervinientes/11`, this.constructOptionsPersona);
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
        this.http.get('/v1/base/personas-casos/casos/'+this.id).subscribe((response) => {
            this.personas = this.constructOptionsPersona(response);
        });
    }

    public getDelitos(){
        this.http.get('/v1/base/delitos-casos/casos/'+this.id).subscribe((response) => {
            this.delitos = this.constructOptionsDelito(response);
        });
    }

    public getInterviniente(_attr:string, _url:string, _call:any){
        this.http.get(_url).subscribe((response) => {
            this[_attr] = _call(response);
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

        _data.forEach(object => {
            options.push({value: object.id, label: object.calle});
        });

        return options;
    }

    private constructOptionsArma(_data:any){
        let options: MOption[] = [];

        _data.forEach(object => {
            options.push({value: object.id, label: object.calle});
        });

        return options;
    }

    private constructOptionsPersona(_data:any){
        let options: MOption[] = [];

        _data.forEach(object => {
            options.push({value: object.id, label: object.persona.nombre});
        });

        return options;
    }

    private constructOptionsDelito(_data:any){
        let options: MOption[] = [];

        _data.forEach(object => {
            options.push({value: object.id, label: object.delito.nombre});
        });

        return options;
    }

    
}
