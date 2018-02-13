import { Injectable } from '@angular/core';
import { CIndexedDB } from '@services/indexedDB';
import { MatrizClaseArma } from './clase-arma';
import { MatrizCalibreMecanismo } from './calibre-mecanismo';

@Injectable()
export class ArmaService {

    public claseArma: MatrizClaseArma;
    public calibreMecanismo: MatrizCalibreMecanismo;

    constructor(
        private db: CIndexedDB
        ) {

        this.claseArma = new MatrizClaseArma(db);
        this.calibreMecanismo = new MatrizCalibreMecanismo(db);
    }
    
}


