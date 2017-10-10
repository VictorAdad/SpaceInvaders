import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizOreja extends MatrizGlobal{

    public forma                = [];
    public helixOriginal        = [];
    public helixSuperior        = [];
    public helixPosterior       = [];
    public helixAdherencia      = [];
    public lobuloContorno       = [];
    public lobuloAdherencia     = [];
    public lobuloParticularidad = [];
    public lobuloDimension      = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new Oreja();
        this.getMatriz('/v1/catalogos/media-filiacion/oreja');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.forma === _selected.forma 
            && _object.helixOriginal === _selected.helixOriginal
            && _object.helixSuperior === _selected.helixSuperior
            && _object.helixPosterior === _selected.helixPosterior
            && _object.helixAdherencia === _selected.helixAdherencia
            && _object.lobuloContorno === _selected.lobuloContorno
            && _object.lobuloAdherencia === _selected.lobuloAdherencia
            && _object.lobuloParticularidad === _selected.lobuloParticularidad
            && _object.lobuloDimension === _selected.lobuloDimension);
    }
}

export class Oreja {
    public forma: string = null;
    public helixOriginal: string = null;
    public helixSuperior: string = null;
    public helixPosterior: string = null;
    public helixAdherencia: string = null;
    public lobuloContorno: string = null;
    public lobuloAdherencia: string = null;
    public lobuloParticularidad: string = null;
    public lobuloDimension: string = null;
}
