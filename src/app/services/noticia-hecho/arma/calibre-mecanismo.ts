import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizCalibreMecanismo extends MatrizGlobal{

    public mecanismo   = [];
    public calibre     = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"calibre_mecanismo");
        this.selected = new CalibreMecanismo();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.mecanismo === _selected.mecanismo && _object.calibre === _selected.calibre);
    }

    public clean(){
        this.selected = new CalibreMecanismo();
    }
}

export class CalibreMecanismo {
    public mecanismo: string = null;
    public calibre: string = null;
}
