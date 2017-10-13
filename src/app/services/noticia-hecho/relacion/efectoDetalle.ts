import { MatrizGlobal }from '../matriz-global2';
import { CIndexedDB } from '@services/indexedDB';

export class MatrizEfectoDetalle extends MatrizGlobal{

    public efecto = [];
    public detalle= [];
    
    constructor(
        private db:CIndexedDB
        ) {
        super(db,"efecto_detalle");
        this.selected = new EfectoDetalle();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.efecto === _selected.efecto 
            && _object.detalle === _selected.detalle);
    }
}

export class EfectoDetalle {
    public efecto : string = null;
    public detalle: string = null;
}