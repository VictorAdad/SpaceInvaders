import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizNacionalidadReligion extends MatrizGlobal{

    public nacionalidad    = [];
    public religion        = [];
    
    constructor(
        private db: CIndexedDB
        ) {
        super(db,"nacionalidad_religion");
        this.selected = new NacionalidadReligion();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.nacionalidad === _selected.nacionalidad 
            && _object.religion === _selected.religion);
    }
}

export class NacionalidadReligion {
    public nacionalidad    : string = null;
    public religion        : string = null;
}