import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../../matriz-global2';

export class MatrizComplexionPielSangre extends MatrizGlobal{

    public tipoComplexion     = [];
    public colorPiel          = [];
    public tipoSangre         = [];
    public factorRhSangre     = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"complexion_piel_sangre");
        this.selected = new ComplexionPielSangre();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.tipoComplexion === _selected.tipoComplexion 
            && _object.colorPiel === _selected.colorPiel
            && _object.tipoSangre === _selected.tipoSangre
            && _object.factorRhSangre === _selected.factorRhSangre
            );
    }
}

export class ComplexionPielSangre {
    public tipoComplexion: string = null;
    public colorPiel: string = null;
    public tipoSangre: string = null;
    public factorRhSangre: string = null;
}
