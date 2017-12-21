import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizMotivoColorClase extends MatrizGlobal{

    public motivoRegistro = [];
    public clase          = [];
    public color          = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"motivo_color_clase");
        this.selected = new MotivoClaseColor();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return _object.motivoRegistro === _selected.motivoRegistro
                && _object.clase === _selected.clase
                && _object.color === _selected.color;
    }

    public clean(){
        this.selected = new MotivoClaseColor();
    }

}

export class MotivoClaseColor {
    public motivoRegistro: string = null;
    public clase: string = null;
    public color: string = null;
}
