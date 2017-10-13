import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { MOption } from '@partials/form/select2/select2.component'
import { MatrizGlobal } from './matriz-global2';

@Injectable()
export class LugarService extends MatrizGlobal{

    public selected       = new Selected();
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
        this.getData();
    }


    public getData(){
        this.getDetalleLugar();
    }

    public getDetalleLugar(){
        this.db.get("catalogos","detalle_lugar").then(response=>{
            this.detalleLugar = response["arreglo"] as any[];
            this.tipoLugar    = this.getUniques(this.detalleLugar, 'tipoLugar');
            this.tipoZona     = this.getUniques(this.detalleLugar, 'tipoZona');
            this.dia          = this.getUniques(this.detalleLugar, 'dia');
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

    public tipoLugar: string=null;
    public tipoZona: string=null;
    public dia: string=null;

}
