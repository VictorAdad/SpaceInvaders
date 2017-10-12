import { HttpService } from '@services/http.service';
import { MatrizGlobal }from '../matriz-global';

export class MatrizTipoTransportacion extends MatrizGlobal{

    public tipo          = [];
    public transportacion= [];
    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new TipoTransportacion();
        this.getMatriz('/v1/catalogos/tipo-transportacion');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.tipo === _selected.tipo 
            && _object.transportacion === _selected.transportacion);
    }
}

export class TipoTransportacion {
    public tipo          : string = null;
    public transportacion: string = null;
}