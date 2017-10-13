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

    public findClaseArma(_e, _tipo:string){
        this.selected[_tipo] = _e;
        this.finded = this.objects.filter(object => {
            return object.motivoRegistro === this.selected.motivoRegistro
                && object.clase === this.selected.clase
                && object.color === this.selected.color;
        });
    }

}

export class MotivoClaseColor {
    public motivoRegistro: string = null;
    public clase: string = null;
    public color: string = null;
}
