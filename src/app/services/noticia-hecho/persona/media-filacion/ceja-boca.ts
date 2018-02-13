import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../../matriz-global2';

export class MatrizCejaBoca extends MatrizGlobal{

    public direccionCeja           = [];
    public implantacionCeja        = [];
    public formaCeja               = [];
    public tamanioCeja             = [];
    public tamanioBoca             = [];
    public comisurasBoca           = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"ceja_boca");
        this.selected = new CejaBoca();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.direccionCeja === _selected.direccionCeja 
            && _object.implantacionCeja === _selected.implantacionCeja
            && _object.formaCeja === _selected.formaCeja
            && _object.tamanioCeja === _selected.tamanioCeja
            && _object.tamanioBoca === _selected.tamanioBoca
            && _object.comisurasBoca === _selected.comisurasBoca);
    }
}

export class CejaBoca {
    public direccionCeja: string = null;
    public implantacionCeja: string = null;
    public formaCeja: string = null;
    public tamanioCeja: string = null;
    public tamanioBoca: string = null;
    public comisurasBoca: string = null;
}