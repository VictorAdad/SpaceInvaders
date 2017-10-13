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

}

export class ProcedenciaAseguradora {
    public procedencia: string = null;
    public aseguradora: string = null;
}
