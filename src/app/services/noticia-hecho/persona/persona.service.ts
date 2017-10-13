import { Injectable } from '@angular/core';
import { MatrizOreja } from './media-filacion/oreja';
import { MatrizComplexionPielSangre } from './media-filacion/complexion-piel-sangre';
import { MatrizCaraNariz } from './media-filacion/cara-nariz';
import { MatrizFrenteMenton } from './media-filacion/frente-menton';
import { MatrizCejaBoca } from './media-filacion/ceja-boca';
import { MatrizLabioOjo } from './media-filacion/labio-ojo';
import { MatrizCabello } from './media-filacion/cabello';
import { MatrizIdiomaIdentificacion } from './idioma-identificacion';
import { MatrizNacionalidadReligion } from './nacionalidad-religion';
import { CIndexedDB } from '@services/indexedDB';

@Injectable()
export class PersonaService {

    public oreja: MatrizOreja;
    public complexionPielSangre: MatrizComplexionPielSangre;
    public caraNariz: MatrizCaraNariz;
    public frenteMenton: MatrizFrenteMenton;
    public cejaBoca: MatrizCejaBoca;
    public labioOjo: MatrizLabioOjo;
    public cabello: MatrizCabello;
    public nacionalidadReligion: MatrizNacionalidadReligion;
    public idiomaIdentificacion: MatrizIdiomaIdentificacion;

    constructor(
        private db: CIndexedDB

        ) {

        this.oreja = new MatrizOreja(db);
        this.complexionPielSangre = new MatrizComplexionPielSangre(db);
        this.caraNariz = new MatrizCaraNariz(db);
        this.frenteMenton = new MatrizFrenteMenton(db);
        this.cejaBoca = new MatrizCejaBoca(db);
        this.labioOjo = new MatrizLabioOjo(db);
        this.cabello = new MatrizCabello(db);
        this.nacionalidadReligion= new MatrizNacionalidadReligion(db);
        this.idiomaIdentificacion= new MatrizIdiomaIdentificacion(db);
    }
    
}


