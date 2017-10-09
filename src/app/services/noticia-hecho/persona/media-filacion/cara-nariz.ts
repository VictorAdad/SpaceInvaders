import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../../matriz-global';

export class MatrizCaraNariz extends MatrizGlobal {

	public formaCara		= [];
	public raizNariz		= [];
	public dorsoNariz		= [];
	public anchoNariz		= [];
	public baseNariz		= [];
	public alturaNariz		= [];

	constructor (private http: HttpService){
		super(http);
        this.selected = new CaraNariz();
        this.getMatriz('/v1/catalogos/media-filacion/CaraNariz');
	}

	public validate(_object: any, _selected: any): boolean{
        return ( 
            _object.formaCara === _selected.formaCara
            && _object.raizNariz === _selected.raizNariz
            && _object.dorsoNariz === _selected.dorsoNariz
            && _object.anchoNariz === _selected.anchoNariz
            && _object.baseNariz === _selected.baseNariz
            && _object.alturaNariz === _selected.alturaNariz
        )    
    }

}

export class CaraNariz {
        public formaCara: string = '';
        public raizNariz: string = '';
        public dorsoNariz: string = '';
        public anchoNariz: string = '';
        public baseNariz: string = '';
        public alturaNariz: string = '';
}