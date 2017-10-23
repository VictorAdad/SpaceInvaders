import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../matriz-global2';

export class MatrizClaseArma extends MatrizGlobal{

    public claseArma   = [];
    public tipo        = [];
    public subtipo     = [];

    constructor(
        private db: CIndexedDB
        ) {
        super(db,"clase_arma");
        this.selected = new ClaseArma();
        this.getMatriz();
    }

    public validate(_object: any, _selected: any): boolean{
        // console.log('object', _object, 'Selected', _selected);
        // console.log(_object.claseArma === _selected.claseArma && _object.tipo === _selected.tipo && _object.subtipo === _selected.subtipo);
        return (_object.claseArma === _selected.claseArma && _object.tipo === _selected.tipo && _object.subtipo === _selected.subtipo);
    }
}

export class ClaseArma {
    public claseArma: string = null;
    public tipo: string = null;
    public subtipo: string = null;
}
