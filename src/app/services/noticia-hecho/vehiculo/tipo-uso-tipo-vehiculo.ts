import { HttpService } from '@services/http.service';
import { Global } from '../global';

export class MatrizTipoUsoTipoVehiculo extends Global{

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
    public tipoUso: string = '';
    public datosTomadosDe: string = '';
    public tipoVehiculo:string = '';
}
