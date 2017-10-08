import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MatrizOreja } from './media-filacion/oreja';
import { MatrizComplexionPielSangre } from './media-filacion/complexion-piel-sangre';

@Injectable()
export class PersonaService {

    public oreja: MatrizOreja;
    public complexionPielSangre: MatrizComplexionPielSangre;

    constructor(
        private http: HttpService
        ) {

        this.oreja = new MatrizOreja(http);
        this.complexionPielSangre = new MatrizComplexionPielSangre(http);
    }
    
}


