import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../../matriz-global2';

export class MatrizLabioOjo extends MatrizGlobal{

    public espesorLabio           = [];
    public alturaNasoLabialLabio  = [];
    public prominenciaLabio       = [];
    public colorOjo               = [];
    public formaOjo               = [];
    public tamanioOjo             = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"labio_ojo");
        this.selected = new LabioOjo();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.espesorLabio === _selected.espesorLabio 
            && _object.alturaNasoLabialLabio === _selected.alturaNasoLabialLabio
            && _object.prominenciaLabio === _selected.prominenciaLabio
            && _object.colorOjo=== _selected.colorOjo
            && _object.formaOjo === _selected.formaOjo
            && _object.tamanioOjo === _selected.tamanioOjo);
    }
}

export class LabioOjo {
    public espesorLabio : string = null;
    public alturaNasoLabialLabio : string = null;
    public prominenciaLabio :string = null;
    public colorOjo : string = null;
    public formaOjo : string = null;
    public tamanioOjo : string = null;
}
