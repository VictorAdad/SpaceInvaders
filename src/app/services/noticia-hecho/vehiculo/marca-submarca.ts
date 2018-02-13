import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizMarcaSubmarca extends MatrizGlobal{

    public tipoVehiculo = [];
    
    public marca        = [];
    public submarca     = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"marca_submarca");
        this.selected = new MarcaSubmarca();
        this.getMatriz(['marca', 'submarca']);
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.tipoVehiculo === _selected.tipoVehiculo 
            && _object.marca === _selected.marca 
            && _object.submarca === _selected.submarca);
    }

    public clean(){
        this.selected = new MarcaSubmarca();
    }
}

export class MarcaSubmarca {
    public tipoVehiculo:string = null;
    public marca: string = null;
    public submarca: string = null;
}
