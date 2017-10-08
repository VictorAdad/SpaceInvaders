import { HttpService } from '@services/http.service';
import { Global } from '../global';

export class MatrizClaseArma extends Global{

    public claseArma   = [];
    public tipo        = [];
    public subtipo     = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new ClaseArma();
        this.getMatriz('/v1/catalogos/clase-arma');
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.claseArma === _selected.claseArma && _object.tipo === _selected.tipo && _object.subtipo === _selected.subtipo);
    }
}

export class ClaseArma {
    public claseArma: string = '';
    public tipo: string = '';
    public subtipo: string = '';
}
