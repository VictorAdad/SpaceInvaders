import { HttpService } from '@services/http.service';
import { MatrizGlobal }from '../matriz-global';

export class MatrizDesaparicionConsumacion extends MatrizGlobal{

    public consumacion= [];
    public tipoDesaparicion       = [];
    public relacionAcusadoOfendido          =[];

    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new DesaparicionConsumacion();
        this.getMatriz('/v1/catalogos/modalidad-ambito');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.consumacion === _selected.consumacion 
            && _object.tipoDesaparicion === _selected.tipoDesaparicion 
            && _object.relacionAcusadoOfendido === _selected.relacionAcusadoOfendido );
    }
}

export class DesaparicionConsumacion {
    public consumacion: string = null;
    public tipoDesaparicion       : string = null;
    public relacionAcusadoOfendido          : string = null;
}