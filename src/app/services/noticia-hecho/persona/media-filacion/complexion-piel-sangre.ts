import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizComplexionPielSangre extends MatrizGlobal{

    public tipoComplexion     = [];
    public colorPiel          = [];
    public tipoSangre         = [];
    public factorRhSangre     = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new ComplexionPielSangre();
        this.getMatriz('/v1/catalogos/media-filiacion/complexion-piel-sangre');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.tipoComplexion === _selected.tipoComplexion 
            && _object.colorPiel === _selected.colorPiel
            && _object.tipoSangre === _selected.tipoSangre
            && _object.factorRhSangre === _selected.factorRhSangre
            );
    }
}

export class ComplexionPielSangre {
    public tipoComplexion: string = null;
    public colorPiel: string = null;
    public tipoSangre: string = null;
    public factorRhSangre: string = null;
}
