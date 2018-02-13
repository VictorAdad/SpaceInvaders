import { CIndexedDB } from '@services/indexedDB';
import { MatrizGlobal } from '../../matriz-global2';

export class MatrizFrenteMenton extends MatrizGlobal {

	public alturaFrente		        = [];
	public inclinacionFrente		= [];
	public anchoFrente		        = [];
	public tipoMenton		        = [];
	public formaMenton		        = [];
	public inclinacionMenton		= [];

	constructor (private db: CIndexedDB){
		super(db,"frente_menton");
        this.selected = new FrenteMenton();
        this.getMatriz();
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
        public alturaFrente: string = null;
        public inclinacionFrente: string = null;
        public anchoFrente: string = null;
        public tipoMenton: string = null;
        public formaMenton: string = null;
        public inclinacionMenton: string = null;
}