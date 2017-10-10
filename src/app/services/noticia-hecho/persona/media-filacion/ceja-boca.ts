import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizCejaBoca extends MatrizGlobal{

    public direccionCeja           = [];
    public implantacionCeja        = [];
    public formaCeja               = [];
    public tamanioCeja             = [];
    public tamanioBoca             = [];
    public comisurasBoca           = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new CejaBoca();
        this.getMatriz('/v1/catalogos/media-filiacion/ceja-boca');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.direccionCeja === _selected.direccionCeja 
            && _object.implantacionCeja === _selected.implantacionCeja
            && _object.formaCeja === _selected.formaCeja
            && _object.tamanioCeja === _selected.tamanioCeja
            && _object.tamanioBoca === _selected.tamanioBoca
            && _object.comisurasBoca === _selected.comisurasBoca);
    }
}

export class CejaBoca {
    public direccionCeja: string = null;
    public implantacionCeja: string = null;
    public formaCeja: string = null;
    public tamanioCeja: string = null;
    public tamanioBoca: string = null;
    public comisurasBoca: string = null;
}