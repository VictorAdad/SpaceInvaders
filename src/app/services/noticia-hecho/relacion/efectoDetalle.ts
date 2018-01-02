import { MatrizGlobal }from '../matriz-global2';
import { CIndexedDB } from '@services/indexedDB';
/**
 * MatrizEfecto detalle, es de  la forma [{id:"",efecto:"",detalle:"",.},]
 */
export class MatrizEfectoDetalle extends MatrizGlobal{
    /** option de detalle */
    public efecto = [];
    /** option de efecto */
    public detalle= [];
    
    constructor(
        private db:CIndexedDB
        ) {
        super(db,"efecto_detalle");
        this.selected = new EfectoDetalle();
        this.getMatriz(['detalle']);
    }
    /**
     * funcion que hace la operacion de igual entre el _object y _selected
     * @param _object 
     * @param _selected 
     */
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