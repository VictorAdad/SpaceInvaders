import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizProcedenciaAseguradora extends MatrizGlobal{

    public procedencia = [];
    public aseguradora = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"procedencia_aseguradora");
        this.selected = new ProcedenciaAseguradora();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return _object.procedencia === _selected.procedencia
                && _object.aseguradora === _selected.aseguradora;
    }

}

export class ProcedenciaAseguradora {
    public procedencia: string = null;
    public aseguradora: string = null;
}
