import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'

@Injectable()
export class SelectsService {

    public paises: MOption[]      = [];
    public estados: MOption[]     = [];
    public municipios: MOption[]  = [];
    public sexo: MOption[]        = [];
    public escolaridad: MOption[] = [];
    public ocupacion: MOption[]   = [];
    public estadoCivil: MOption[] = [];
    public idioma: MOption[]      = [];
    public grupoEtnico: MOption[] = [];
    public alfabetismo: MOption[] = [];
    public interprete: MOption[]  = [];
    public adiccion: MOption[]    = [];
    public nacionalidad: MOption[]= [];

    constructor(
        private http: HttpService
        ) {
    }

    public getData(){
        this.getPaises();
        this.getSexo();
        this.getEscolaridad();
        this.getOcupacion();
        this.getEstadoCivil();
        this.getIdioma();
        this.getGrupoEtnico();
        this.getInterprete();
        this.getAdiccion();
        this.getNacionalidad();
    }

    public getPaises(){
        this.http.get('/v1/catalogos/pais/options').subscribe((response) => {
            this.paises = this.constructOptions(response);
        });
    }   

    public getSexo(){
        this.http.get('/v1/catalogos/sexo/options').subscribe((response) => {
            this.sexo = this.constructOptions(response);
        });
    }    

    public getEscolaridad(){
        this.http.get('/v1/catalogos/escolaridad/options').subscribe((response) => {
            this.escolaridad = this.constructOptions(response);
        });
    }

    public getOcupacion(){
        this.http.get('/v1/catalogos/ocupacion/options').subscribe((response) => {
            this.ocupacion = this.constructOptions(response);
        });
    }

    public getEstadoCivil(){
        this.http.get('/v1/catalogos/estado-civil/options').subscribe((response) => {
            this.estadoCivil = this.constructOptions(response);
        });
    }

    public getIdioma(){
        this.http.get('/v1/catalogos/idioma/options').subscribe((response) => {
            this.idioma = this.constructOptions(response);
        });
    }

    public getGrupoEtnico(){
        this.http.get('/v1/catalogos/grupo-etnico/options').subscribe((response) => {
            this.grupoEtnico = this.constructOptions(response);
        });
    }

    public getInterprete(){
        this.http.get('/v1/catalogos/interprete/options').subscribe((response) => {
            this.interprete = this.constructOptions(response);
        });
    }

    public getAdiccion(){
        this.http.get('/v1/catalogos/adiccion/options').subscribe((response) => {
            this.adiccion = this.constructOptions(response);
        });
    }

    public getNacionalidad(){
        this.http.get('/v1/catalogos/nacionalidad/options').subscribe((response) => {
            this.nacionalidad = this.constructOptions(response);
        });
    }

    public getEstadoByPais(idPais: number){
        this.http.get('/v1/catalogos/estado/pais'+idPais+'/options').subscribe((response) => {
            this.estados = this.constructOptions(response);
        });
    }

    public getMunicipiosByEstado(idEstado: number){
        this.http.get('v1/catalogos/municipio/estado/'+idEstado+'/options ').subscribe((response) => {
            this.municipios = this.constructOptions(response);
        });
    }

    private constructOptions(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }

    
}
