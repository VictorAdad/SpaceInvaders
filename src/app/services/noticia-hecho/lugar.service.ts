import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { Global } from './global';

@Injectable()
export class LugarService extends Global{

    public detalleLugar   = [];
    public tipoLugar      = [];
    public tipoZona       = [];
    public dia            = [];

    constructor(
        private http: HttpService
        ) {
        super();
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
    
}
