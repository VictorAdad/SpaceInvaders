import { HttpService } from '@services/http.service';
import { MatrizGlobal }from '../matriz-global';

export class MatrizEfectoDetalle extends MatrizGlobal{

    public efecto = [];
    public detalle= [];
    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new EfectoDetalle();
        this.getMatriz('/v1/catalogos/efecto-detalle');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.efecto === _selected.efecto 
            && _object.detalle === _selected.detalle);
    }
}

export class EfectoDetalle {
    public efecto : string = null;
    public detalle: string = null;
}