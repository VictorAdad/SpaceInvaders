import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { SelectsService } from '@services/selects.service';
import { Observable } from 'rxjs/Observable';

export class Options {

    public paises: MOption[]      = [];
    public estados: MOption[]     = [];
    public municipios: MOption[]  = [];
    public colonias: MOption[]    = [];
    public localidad: MOption[] = [];
    public tipoDomicilio: MOption[]= [];


    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
        private select: SelectsService
        ) {
        if (this.select.paises.length==0){
            this.select.getPaises();
            let timer = Observable.timer(1000);
            timer.subscribe(t=>{
                this.paises = this.select.paises;
            });
        }else
            this.paises      = this.select.paises;
        this.estados     = this.select.estados;
        this.municipios  = this.select.municipios;
        this.colonias    = this.select.colonias;
        this.localidad   = this.select.localidad;
        this.tipoDomicilio = this.select.tipoDomicilio;
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
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/colonia/municipio/'+idMunicipio).subscribe((response) => {
                this.colonias = this.constructOptionsColonia(response,true);
            });
        }else{
            this.db.searchInNotMatrx("colonia",{municipio:{id:idMunicipio}}).then(response=>{
                let colonias={};
                for(let e in response){
                    colonias[""+response[e].id+"-"+response[e].cp]=response[e].nombre
                }
                this.colonias=this.constructOptionsColonia(colonias,false);
            });
        }
    }

    public getLocalidadByMunicipio(idMunicipio: number){
        if (this.onLine.onLine) {
            this.http.get('/v1/catalogos/localidad/municipio/'+idMunicipio+'/options').subscribe((response) => {
                this.localidad = this.constructOptions(response);
            });
        }else{
            this.db.searchInNotMatrx("localidad",{municipio:{id:idMunicipio}}).then(response=>{
                let localidad={};
                for(let e in response){
                    localidad[""+response[e].id]=response[e].nombre
                }
                this.localidad=this.constructOptions(localidad);
            });
        }
    }

    public constructOptionsColonia(_data:any, isArray){
        let options: MOption[] = [];
        if (!isArray){
            for (var key in _data) {
                options.push({value: key, label: _data[key]});
            }
        }
        else{
            for (var i=0; i<_data["length"]; i++) {
                options.push({value: ""+_data[i]["id"]+"-"+_data[i]["cp"], label: _data[i]["nombre"]});
            }
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
