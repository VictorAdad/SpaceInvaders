import { MOption } from '@partials/form/select2/select2.component';
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService } from '@services/http.service';

export class Options {

	public presentoLlamada: MOption[]=[];

	public getData(){
		this.getOptions('presentoLlamada', '/v1/catalogos/entrevista/presento-llamadas/options',"presento_llamada");
	}

	constructor(
        private http: HttpService,
        private db:CIndexedDB,
        private onLine:OnLineService
        ) {
    }


    public getOptions(_attr: string, _url: string, _catalogo:string){
        if (this.onLine.onLine){ 
            this.http.get(_url).subscribe((response) => {
                this[_attr] = this.constructOptions(response);
            });   
        }else{
            this.db.get("catalogos",_catalogo).then(cata=>{
                this[_attr] = this.constructOptions( cata["arreglo"] );
            });
        }
    }

    public constructOptions(_data:any){
        let options: MOption[] = [];
        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }

}