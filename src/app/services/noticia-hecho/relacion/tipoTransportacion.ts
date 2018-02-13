import { MatrizGlobal }from '../matriz-global2';
import { CIndexedDB } from '@services/indexedDB';

export class MatrizTipoTransportacion extends MatrizGlobal{

    public tipo          = [];
    public transportacion= [];
    
    constructor(
        private db:CIndexedDB
        ) {
        super(db,"tipo_transportacion");
        this.selected = new TipoTransportacion();
        this.getMatriz();
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