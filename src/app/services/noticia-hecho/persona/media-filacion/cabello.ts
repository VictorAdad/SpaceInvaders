import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../../matriz-global2';

export class MatrizCabello extends MatrizGlobal{

    public cantidad     = [];
    public color        = [];
    public forma        = [];
    public calvicie     = [];
    public implantacion = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"cabello");
        this.selected = new Cabello();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.cantidad === _selected.cantidad
            && _object.color === _selected.color
            && _object.forma === _selected.forma
            && _object.calvicie=== _selected.calvicie
            && _object.implantacion === _selected.implantacion);
    }
}

export class Cabello {
    public cantidad     : string = null;
    public color        : string = null;
    public forma        : string = null;
    public calvicie     : string = null;
    public implantacion : string = null;
}
