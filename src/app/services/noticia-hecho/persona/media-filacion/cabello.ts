import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizCabello extends MatrizGlobal{

    public cantidad     = [];
    public color        = [];
    public forma        = [];
    public calvicie     = [];
    public implantacion = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new Cabello();
        this.getMatriz('/v1/catalogos/media-filiacion/cabello');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.cantidad === _selected.cantidad
            && _object.color === _selected.color
            && _object.forma === _selected.forma
            && _object.calvicie=== _selected.calvicie
            && _object.implantacion === _selected.implantacion);
    }
}

export class Cabello {
    public cantidad     : string = '';
    public color        : string = '';
    public forma        : string = '';
    public calvicie     : string = '';
    public implantacion : string = '';
}
