import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizTipoUsoTipoVehiculo extends MatrizGlobal{

    public tipoUso        = [];
    public datosTomadosDe = [];
    public tipoVehiculo   = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"tipo_uso_tipo_vehiculo");
        this.selected = new TipoUsoTipoVehiculo();
        this.getMatriz();
    }

}

export class TipoUsoTipoVehiculo {
    public tipoUso: string = null;
    public datosTomadosDe: string = null;
    public tipoVehiculo:string = null;
}
