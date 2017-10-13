import { MatrizGlobal }from '../matriz-global2';
import { CIndexedDB } from '@services/indexedDB';

export class MatrizModalidadAmbito extends MatrizGlobal{

    public modalidad= [];
    public ambito   = [];
    
    constructor(
        private db: CIndexedDB
        ) {
        super(db,"modalidad_ambito");
        this.selected = new ModalidadAmbito();
        this.getMatriz();
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