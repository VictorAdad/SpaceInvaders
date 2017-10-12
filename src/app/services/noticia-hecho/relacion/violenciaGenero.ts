import { HttpService } from '@services/http.service';
import { MatrizGlobal }from '../matriz-global';

export class MatrizViolenciaGenero extends MatrizGlobal{

    public delincuenciaOrganizada= [];
    public violenciaGenero       = [];
    public victimaTrata          =[];
    public victimaAcoso          =[];
    public ordenProteccion       =[];
    
    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new ViolenciaGenero();
        this.getMatriz('/v1/catalogos/modalidad-ambito');
    }

    public validate(_object: any, _selected: any): boolean{
        return (
            _object.delincuenciaOrganizada === _selected.delincuenciaOrganizada 
            && _object.violenciaGenero === _selected.violenciaGenero 
            && _object.victimaTrata === _selected.victimaTrata 
            && _object.victimaAcoso === _selected.victimaAcoso 
            && _object.ordenProteccion === _selected.ordenProteccion);
    }
}

export class ViolenciaGenero {
    public delincuenciaOrganizada: string = null;
    public violenciaGenero       : string = null;
    public victimaTrata          : string = null;
    public victimaAcoso          : string = null;
    public ordenProteccion       : string = null;
}