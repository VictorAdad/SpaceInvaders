import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { Global } from './global';

@Injectable()
export class LugarService extends Global{

    public selected       = new Selected();
    public finded         = [];
    public detalleLugar   = [];
    public tipoLugar      = [];
    public tipoZona       = [];
    public dia            = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
    }


    public getData(){
        this.getDetalleLugar();
    }

    public getDetalleLugar(){
        this.http.get('/v1/catalogos/detalle-lugar').subscribe((response) => {
            this.detalleLugar = response;
            this.tipoLugar    = this.getUniques(response, 'tipoLugar');
            this.tipoZona     = this.getUniques(response, 'tipoZona');
            this.dia          = this.getUniques(response, 'dia');
        });
    }

    public find(_e, _tipo:string){
        this.selected[_tipo] = _e;
        this.finded = this.detalleLugar.filter(object => {
            return object.tipoLugar === this.selected.tipoLugar && object.tipoZona === this.selected.tipoZona && object.dia === this.selected.dia
        });
    }
    
}

export class Selected {

    public tipoLugar: string;
    public tipoZona: string;
    public dia: string;

}
