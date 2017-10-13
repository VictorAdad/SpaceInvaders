import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../matriz-global';

export class MatrizConductaDetalle extends MatrizGlobal{

    public conducta   = [];
    public detalle     = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new ConductaDetalle();
        this.getMatriz('/v1/catalogos/relacion/conducta-detalle');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.conducta === _selected.conducta 
            && _object.detalle === _selected.detalle
        );
    }
}

export class ConductaDetalle {
    public conducta: string = null;
    public detalle: string = null;
}
