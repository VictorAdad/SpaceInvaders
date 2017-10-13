import { Injectable } from '@angular/core';
import { MatrizMarcaSubmarca } from './marca-submarca';
import { MatrizProcedenciaAseguradora } from './procedencia-aseguradora';
import { MatrizMotivoColorClase } from './motivo-color-clase';
import { MatrizTipoUsoTipoVehiculo } from './tipo-uso-tipo-vehiculo';
import { CIndexedDB } from '@services/indexedDB';

@Injectable()
export class VehiculoService{

    public marcaSubmarca: MatrizMarcaSubmarca;
    public procedenciaAseguradora: MatrizProcedenciaAseguradora;
    public motivoColorClase: MatrizMotivoColorClase;
    public tipoUsoTipoVehiculo: MatrizTipoUsoTipoVehiculo;

    constructor(
        private db:CIndexedDB
        ) {
        this.marcaSubmarca =  new MatrizMarcaSubmarca(db);
        this.procedenciaAseguradora = new MatrizProcedenciaAseguradora(db);
        this.motivoColorClase = new MatrizMotivoColorClase(db);
        this.tipoUsoTipoVehiculo = new MatrizTipoUsoTipoVehiculo(db);
    }

}
