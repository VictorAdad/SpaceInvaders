import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MatrizClaseArma } from './clase-arma';
import { MatrizCalibreMecanismo } from './calibre-mecanismo';

@Injectable()
export class ArmaService {

    public claseArma: MatrizClaseArma;
    public calibreMecanismo: MatrizCalibreMecanismo;

    constructor(
        private http: HttpService
        ) {

        this.claseArma = new MatrizClaseArma(http);
        this.calibreMecanismo = new MatrizCalibreMecanismo(http);
    }
    
}


