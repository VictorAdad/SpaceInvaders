import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { MatrizMarcaSubmarca } from './marca-submarca';
import { MatrizProcedenciaAseguradora } from './procedencia-aseguradora';
import { MatrizMotivoColorClase } from './motivo-color-clase';
import { MatrizTipoUsoTipoVehiculo } from './tipo-uso-tipo-vehiculo';

@Injectable()
export class VehiculoService{

    public marcaSubmarca: MatrizMarcaSubmarca;
    public procedenciaAseguradora: MatrizProcedenciaAseguradora;
    public motivoColorClase: MatrizMotivoColorClase;
    public tipoUsoTipoVehiculo: MatrizTipoUsoTipoVehiculo;

    constructor(
        private http: HttpService
        ) {
        this.marcaSubmarca =  new MatrizMarcaSubmarca(http);
        this.procedenciaAseguradora = new MatrizProcedenciaAseguradora(http);
        this.motivoColorClase = new MatrizMotivoColorClase(http);
        this.tipoUsoTipoVehiculo = new MatrizTipoUsoTipoVehiculo(http);
    }

}
