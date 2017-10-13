import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizIdiomaIdentificacion extends MatrizGlobal{

    public hablaEspaniol        = [];
    public lenguaIndigena       = [];
    public familiaLinguistica   = [];
    public identificacion       = [];
    
    constructor(
        private db: CIndexedDB
        ) {
        super(db,"idioma_identificacion");
        this.selected = new IdiomaIdentificacion ();
        this.getMatriz();
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