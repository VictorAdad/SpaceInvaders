import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal }from '../matriz-global2';

export class MatrizConductaDetalle extends MatrizGlobal{

    public conducta= [];
    public detalle = [];
    
    constructor(
        private db: CIndexedDB
        ) {
        super(db,"conducta_detalle");
        this.selected = new ConductaDetalle();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.conducta === _selected.conducta 
            && _object.detalle === _selected.detalle);
    }
}

export class ConductaDetalle {
    public conducta: string = null;
    public detalle : string = null;
}