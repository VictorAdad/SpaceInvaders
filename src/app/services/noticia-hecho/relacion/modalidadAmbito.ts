import { HttpService } from '@services/http.service';
import { MatrizGlobal }from '../matriz-global';

export class MatrizModalidadAmbito extends MatrizGlobal{

    public modalidad= [];
    public ambito   = [];
    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new ModalidadAmbito();
        this.getMatriz('/v1/catalogos/modalidad-ambito');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.modalidad === _selected.modalidad 
            && _object.ambito === _selected.ambito);
    }
}

export class ModalidadAmbito {
    public modalidad: string = null;
    public ambito   : string = null;
}