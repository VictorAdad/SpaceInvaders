import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizTipoUsoTipoVehiculo extends MatrizGlobal{

    public tipoUso        = [];
    public datosTomadosDe = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"tipo_uso_tipo_vehiculo");
        this.selected = new TipoUsoTipoVehiculo();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        return _object.datosTomadosDe === _selected.datosTomadosDe
                && _object.tipoVehiculo === _selected.tipoVehiculo;
    }

}

export class TipoUsoTipoVehiculo {
    public tipoUso: string = null;
    public datosTomadosDe: string = null;
}
