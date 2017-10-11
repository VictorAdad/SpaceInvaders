import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../matriz-global';

export class MatrizIdiomaIdentificacion extends MatrizGlobal{

    public hablaEspaniol        = [];
    public lenguaIndigena       = [];
    public familiaLinguistica   = [];
    public identificacion       = [];
    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new IdiomaIdentificacion ();
        this.getMatriz('/v1/catalogos/persona/idioma');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.hablaEspaniol  === _selected.hablaEspaniol 
            && _object.lenguaIndigena === _selected.lenguaIndigena
            && _object.familiaLinguistica === _selected.familiaLinguistica
            && _object.identificacion === _selected.identificacion);
    }
}

export class IdiomaIdentificacion{
    public hablaEspaniol        : string = null;
    public lenguaIndigena       : string = null;
    public familiaLinguistica   : string = null;
    public identificacion       : string = null;
}