import { HttpService } from '@services/http.service';
import { Global } from '../global';

export class MatrizMarcaSubmarca extends Global{

    public marca    = [];
    public submarca = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new MarcaSubmarca();
        this.getMatriz('/v1/catalogos/marca-submarca');
    }

    public validate(_object: any, _selected: any): boolean{
        return (_object.marca === _selected.marca && _object.submarca === _selected.submarca);
    }
}

export class MarcaSubmarca {
    public marca: string = '';
    public submarca: string = '';
}
