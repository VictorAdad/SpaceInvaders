import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../matriz-global';

export class MatrizCalibreMecanismo extends MatrizGlobal{

    public mecanismo   = [];
    public calibre     = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new CalibreMecanismo();
        this.getMatriz('/v1/catalogos/arma/calibre-mecanismo');
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.mecanismo === _selected.mecanismo && _object.calibre === _selected.calibre);
    }
}

export class CalibreMecanismo {
    public mecanismo: string = null;
    public calibre: string = null;
}
