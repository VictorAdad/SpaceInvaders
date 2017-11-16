import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService } from '@services/selects.service';

export class Options {

    public paises: MOption[]      = [];
    public estados: MOption[]     = [];
    public municipios: MOption[]  = [];
    public colonias: MOption[]    = [];
    public localidades: MOption[] = [];


    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
        private select: SelectsService
        ) {
        this.paises      = this.select.paises;
        this.estados     = this.select.estados;
        this.municipios  = this.select.municipios;
        this.colonias    = this.select.colonias;
        this.localidades = this.select.localidad;
    }

    public getEstadoByPais(idPais: number){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/estado/pais/'+idPais+'/options').subscribe((response) => {
                this.estados = this.constructOptions(response);
            });
        }else{
            this.db.searchInNotMatrx("estado",{pais:{id:idPais}}).then(response=>{
                let estados={};
                for(let e in response){
                    estados[""+response[e].id]=response[e].nombre
                }
                this.estados=this.constructOptions(estados);
            });
        }
    }

    public getMunicipiosByEstado(idEstado: number){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/municipio/estado/'+idEstado+'/options').subscribe((response) => {
                this.municipios = this.constructOptions(response);
            });
        }else{
            this.db.searchInNotMatrx("municipio",{estado:{id:idEstado}}).then(response=>{
                let estados={};
                for(let e in response){
                    estados[""+response[e].id]=response[e].nombre
                }
                this.municipios=this.constructOptions(estados);
            });
        }
    }

    public getColoniasByMunicipio(idMunicipio: number){
        this.http.get('/v1/catalogos/colonia/municipio/'+idMunicipio+'/options').subscribe((response) => {
            this.localidades = this.constructOptions(response);
        });
    }

    public getLocalidadByMunicipio(idColonia: number){
        this.http.get('/v1/catalogos/localidad/municipio/'+idColonia+'/options').subscribe((response) => {
            this.localidades = this.constructOptions(response);
        });
    }

    public constructOptions(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        options.sort((a,b)=>{
            if (a.label>b.label) 
                return 1; 
            if (a.label<b.label)
                return -1;
            return 0;
        });

        return options;
    }

    public find(_attr:string, _val:string){
        return this[_attr][_val];
    }

    
}
