import { MatrizGlobal }from '../matriz-global2';
import { CIndexedDB } from '@services/indexedDB';

export class MatrizDesaparicionConsumacion extends MatrizGlobal{

    public consumacion= [];
    public tipoDesaparicion       = [];
    public relacionAcusadoOfendido          =[];

    
    constructor(
        private db: CIndexedDB
        ) {
        super(db,"desaparicion_consumacion");
        this.selected = new DesaparicionConsumacion();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.consumacion === _selected.consumacion 
            && _object.tipoDesaparicion === _selected.tipoDesaparicion 
            && _object.relacionAcusadoOfendido === _selected.relacionAcusadoOfendido );
    }
}

export class DesaparicionConsumacion {
    public consumacion: string = null;
    public tipoDesaparicion       : string = null;
    public relacionAcusadoOfendido          : string = null;
}