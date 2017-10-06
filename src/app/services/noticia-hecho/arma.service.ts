import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { Global } from './global';

@Injectable()
export class ArmaService extends Global{

    public selectedClase = new SelectedClaseArma();
    public findedClase = [];
    public clasesArmas = [];
    public claseArma   = [];
    public tipo        = [];
    public subtipo     = [];

    public selectedCalibre = new SelectedCalibreMecanismo();
    public findedCalibre   = [];
    public calibresMecanismos = [];
    public mecanismo   = [];
    public calibre     = [];

    constructor(
        private http: HttpService
        ) {
        super();
    }


    public getData(){
        this.getClaseArma();
        this.getCalibreMecanismo();
    }

    public getClaseArma(){
        this.http.get('/v1/catalogos/clase-arma').subscribe((response) => {
            this.clasesArmas = response;
            this.claseArma   = this.getUniques(response, 'claseArma');
            this.tipo        = this.getUniques(response, 'tipo');
            this.subtipo     = this.getUniques(response, 'subtipo');
        });
    }

    public getCalibreMecanismo(){
        this.http.get('/v1/catalogos/calibre-mecanismo').subscribe((response) => {
            this.calibresMecanismos = response;
            this.mecanismo    = this.getUniques(response, 'mecanismo');
            this.calibre      = this.getUniques(response, 'calibre ');
        });
    }

    public findClaseArma(_e, _tipo:string){
        this.selectedClase[_tipo] = _e;
        this.findedClase = this.clasesArmas.filter(object => {
            // return object.tipoLugar === this.selectedClase.tipoLugar && object.tipoZona === this.selectedClase.tipoZona && object.dia === this.selectedClase.dia
            return true;
        });
    }

    public findCalibreMecanismo(_e, _tipo:string){
        this.selectedCalibre[_tipo] = _e;
        this.findedCalibre = this.calibresMecanismos.filter(object => {
            // return object.tipoLugar === this.selectedCalibre.tipoLugar && object.tipoZona === this.selectedCalibre.tipoZona && object.dia === this.selectedCalibre.dia
            return true;
        });
    }
    
}

export class SelectedClaseArma {
    public claseArma: string;
    public tipo: string;
    public subtipo: string;
}

export class SelectedCalibreMecanismo {
    public mecanismo: string;
    public calibre: string;

}
