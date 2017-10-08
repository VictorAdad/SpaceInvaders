import { HttpService } from '@services/http.service';
import { Global } from '../global';

export class MatrizCalibreMecanismo extends Global{

    public mecanismo   = [];
    public calibre     = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new CalibreMecanismo();
        this.getMatriz('/v1/catalogos/calibre-mecanismo');
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.mecanismo === _selected.mecanismo && _object.calibre === _selected.calibre);
    }
}

export class CalibreMecanismo {
    public mecanismo: string = '';
    public calibre: string = '';
}
