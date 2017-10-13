import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizMarcaSubmarca extends MatrizGlobal{

    public marca    = [];
    public submarca = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"marca_submarca");
        this.selected = new MarcaSubmarca();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.marca === _selected.marca && _object.submarca === _selected.submarca);
    }
}

export class MarcaSubmarca {
    public marca: string = null;
    public submarca: string = null;
}
