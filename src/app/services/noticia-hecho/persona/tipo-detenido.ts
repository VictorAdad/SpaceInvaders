import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizTipoDetenido extends MatrizGlobal{

    public tipoDetencion       = [];
    public tipoReincidencia    = [];
    public cereso              = [];
    
    constructor(
        private db: CIndexedDB
        ) {
        super(db,"tipo_detenido");
        this.selected = new TipoDetenido();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.tipoDetencion === _selected.tipoDetencion
            && _object.tipoReincidencia === _selected.tipoReincidencia 
            && _object.cereso === _selected.cereso);
    }
}

export class TipoDetenido {
    public tipoDetencion     : string = null;
    public tipoReincidencia  : string = null;
    public cereso            : string = null;
}