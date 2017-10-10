import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../matriz-global';

export class MatrizTipoUsoTipoVehiculo extends MatrizGlobal{

    public tipoUso        = [];
    public datosTomadosDe = [];
    public tipoVehiculo   = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new TipoUsoTipoVehiculo();
        this.getMatriz('/v1/catalogos/tipo-uso-vehiculo');
    }

}

export class TipoUsoTipoVehiculo {
    public tipoUso: string = null;
    public datosTomadosDe: string = null;
    public tipoVehiculo:string = null;
}
