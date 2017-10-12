import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MatrizConductaDetalle } from './conducta-detalle';
import { MatrizModalidadAmbito } from './conducta-detalle';

@Injectable()
export class RelacionService {

    public conductaDetalle: MatrizConductaDetalle;
    public modalidadAmbito: MatrizModalidadAmbito;


    constructor(
        private http: HttpService
        ) {

        this.conductaDetalle = new MatrizConductaDetalle(http);
        this.modalidadAmbito = new MatrizModalidadAmbito(http);
    }
    
}


