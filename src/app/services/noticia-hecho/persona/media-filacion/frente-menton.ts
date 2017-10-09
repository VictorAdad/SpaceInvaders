import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizFrenteMenton extends MatrizGlobal {

	public alturaFrente		        = [];
	public inclinacionFrente		= [];
	public anchoFrente		        = [];
	public tipoMenton		        = [];
	public formaMenton		        = [];
	public inclinacionMenton		= [];

	constructor (private http: HttpService){
		super(http);
        this.selected = new FrenteMenton();
        this.getMatriz('/v1/catalogos/media-filiacion/frente-menton');
	}

	public validate(_object: any, _selected: any): boolean{
        return ( 
            _object.alturaFrente === _selected.alturaFrente
            && _object.inclinacionFrente === _selected.inclinacionFrente
            && _object.anchoFrente === _selected.anchoFrente
            && _object.tipoMenton === _selected.tipoMenton
            && _object.formaMenton === _selected.formaMenton
            && _object.inclinacionMenton === _selected.inclinacionMenton
            )
    }

}

export class FrenteMenton {
        public alturaFrente: string = '';
        public inclinacionFrente: string = '';
        public anchoFrente: string = '';
        public tipoMenton: string = '';
        public formaMenton: string = '';
        public inclinacionMenton: string = '';
}