import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { MOption } from '@partials/form/select2/select2.component'
import { MatrizGlobal } from './matriz-global2';
import { Logger } from "@services/logger.service";

@Injectable()
export class LugarService extends MatrizGlobal{
    /**
     * atributos de la matriz
     */
    public finded         = [];
    public detalleLugar   = [];
    public tipoLugar      = [];
    public tipoZona       = [];
    public dia            = [];

    constructor(
        private http: HttpService,
        private db: CIndexedDB
        ) {
        super(db,"detalle_lugar");
        this.selected =  new DetalleLugar();
        this.getData();
    }

    /**
     * Se obtinenen los optios de cada atributo de la matriz
     */
    public getData(){
        this.getDetalleLugar();
    }
     /**
     * Se obtinenen los optios de cada atributo de la matriz
     */
    public getDetalleLugar(){
        this.db.get("catalogos","detalle_lugar").then(response=>{
            Logger.logColor('------>','green', response );
            this.detalleLugar = response["arreglo"] as any[];
            this.tipoLugar    = this.getUniques(this.detalleLugar, 'tipoLugar');
            this.tipoZona     = this.getUniques(this.detalleLugar, 'tipoZona');
            this.dia = this.getUniques(this.detalleLugar, 'dia');
            var orden = [];
            for (var i = 0; i<7; i++) {
                if (this.dia[i].value == 'LUNES') {
                    orden[0] =  this.dia[i]
                }else if (this.dia[i].value == 'MARTES') {
                    orden[1] =  this.dia[i]
                }else if (this.dia[i].value == 'MIÉRCOLES') {
                    orden[2] =  this.dia[i]
                }else if (this.dia[i].value == 'JUEVES') {
                    orden[3] =  this.dia[i]
                }else if (this.dia[i].value == 'VIERNES') {
                    orden[4] =  this.dia[i]
                }else if (this.dia[i].value == 'SÁBADO') {
                    orden[5] =  this.dia[i]
                }else if (this.dia[i].value == 'DOMINGO') {
                    orden[6] =  this.dia[i]
                }
            }
            this.dia          = orden;
        });
    }
    /**
     * Agrega al selected el atributo _tipo con valor _e y despues filtra.
     * @param _e 
     * @param _tipo 
     */
    public find(_e, _tipo:string){
        if (typeof _e!=="undefined")
            this.selected[_tipo] = _e;
        else
            this.selected[_tipo] = null;

        this.finded = this.detalleLugar.filter(object => {
            return object.tipoLugar === this.selected.tipoLugar && object.tipoZona === this.selected.tipoZona && object.dia === this.selected.dia
        });
        Logger.log('DetalleLugar finded', this.finded, this.selected);
    }
    
}

export class DetalleLugar {

    public tipoLugar: string = null;
    public tipoZona: string = null;
    public dia: string = null;

}
