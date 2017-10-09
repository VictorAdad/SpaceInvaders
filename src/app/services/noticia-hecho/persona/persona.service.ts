import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MatrizOreja } from './media-filacion/oreja';
import { MatrizComplexionPielSangre } from './media-filacion/complexion-piel-sangre';
import { MatrizCaraNariz } from './media-filacion/cara-nariz';
import { MatrizFrenteMenton } from './media-filacion/frente-menton';
import { MatrizCejaBoca } from './media-filacion/ceja-boca';
import { MatrizLabioOjo } from './media-filacion/labio-ojo';
import { MatrizCabello } from './media-filacion/cabello';

@Injectable()
export class PersonaService {

    public oreja: MatrizOreja;
    public complexionPielSangre: MatrizComplexionPielSangre;
    public caraNariz: MatrizCaraNariz;
    public frenteMenton: MatrizFrenteMenton;
    public cejaBoca: MatrizCejaBoca;
    public labioOjo: MatrizLabioOjo;
    public cabello: MatrizCabello;

    constructor(
        private http: HttpService
        ) {

        this.oreja = new MatrizOreja(http);
        this.complexionPielSangre = new MatrizComplexionPielSangre(http);
        this.caraNariz = new MatrizCaraNariz(http);
        this.frenteMenton = new MatrizFrenteMenton(http);
        this.cejaBoca = new MatrizCejaBoca(http);
        this.labioOjo = new MatrizLabioOjo(http);
        this.cabello = new MatrizCabello(http);

    }
    
}


