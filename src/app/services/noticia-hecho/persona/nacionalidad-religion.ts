import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../matriz-global';

export class MatrizNacionalidadReligion extends MatrizGlobal{

    public nacionalidad    = [];
    public religion        = [];
    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new CejaBoca();
        this.getMatriz('/v1/catalogos/persona/nacionalidad-religion');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.nacionalidad === _selected.nacionalidad 
            && _object.religion === _selected.religion);
    }
}

export class CejaBoca {
    public nacionalidad    : string = '';
    public religion        : string = '';
}