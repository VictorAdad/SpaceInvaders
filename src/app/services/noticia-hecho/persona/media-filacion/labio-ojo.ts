import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizLabioOjo extends MatrizGlobal{

    public espesorLabio           = [];
    public alturaNasoLabialLabio  = [];
    public prominenciaLabio       = [];
    public colorOjo               = [];
    public formaOjo               = [];
    public tamanioOjo             = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new LabioOjo();
        this.getMatriz('/v1/catalogos/media-filiacion/labio-ojo');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.espesorLabio === _selected.espesorLabio 
            && _object.alturaNasoLabialLabio === _selected.alturaNasoLabialLabio
            && _object.prominenciaLabio === _selected.prominenciaLabio
            && _object.colorOjo=== _selected.colorOjo
            && _object.formaOjo === _selected.formaOjo
            && _object.tamanioOjo === _selected.tamanioOjo);
    }
}

export class LabioOjo {
    public espesorLabio : string = '';
    public alturaNasoLabialLabio : string = '';
    public prominenciaLabio :string = '';
    public colorOjo : string = '';
    public formaOjo : string = '';
    public tamanioOjo : string = '';
}
