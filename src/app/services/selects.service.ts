import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { OnLineService} from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';

@Injectable()
export class SelectsService {

    public paises: MOption[]       = [];
    public estados: MOption[]      = [];
    public municipios: MOption[]   = [];
    public colonias: MOption[]     = [];
    public localidad: MOption[]    = [];
    public sexo: MOption[]         = [];
    public escolaridad: MOption[]  = [];
    public ocupacion: MOption[]    = [];
    public estadoCivil: MOption[]  = [];
    public idioma: MOption[]       = [];
    public grupoEtnico: MOption[]  = [];
    public alfabetismo: MOption[]  = [];
    public interprete: MOption[]   = [];
    public adiccion: MOption[]     = [];
    public nacionalidad: MOption[] = [];
    public tipoDomicilio: MOption[]= [];
    public tipoInterviniente: MOption[]= [];
    public peritoMateria: MOption[] = [];
    public tipoExamen: MOption[] = [];
    public denunciaQuerella: MOption[] = [];
    public victimaQuerellante: MOption[] = [];
    public tipoPersona: MOption[] = [];
    public tipoLinea: MOption[] = [];

    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
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
        this.getTipoDomicilio();
        this.getTipoInterviniente();
        this.getAlfabetismo();
        this.getPeritoMateria();
        this.getTipoExamen();
        this.getDenunciaQuerella();
        this.getVictimaQuerellante();
        this.getTipoPersona();
        this.getTipoLinea();
    }

    public getVictimaQuerellante(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/solicitud-preliminar/victima-querellante/options').subscribe((response) => {
                this.victimaQuerellante = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","victima_querellante").then(response=>{
                this.victimaQuerellante = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getDenunciaQuerella(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/solicitud-preliminar/denuncia-querella/options').subscribe((response) => {
                this.denunciaQuerella = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","denuncia_querellante").then(response=>{
                this.denunciaQuerella = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getPeritoMateria(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/solicitud-preliminar/perito-materia/options').subscribe((response) => {
                this.peritoMateria = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","perito_materia").then(response=>{
                this.peritoMateria = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getTipoExamen(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/solicitud-preliminar/tipo-examen/options').subscribe((response) => {
                this.tipoExamen = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","tipo_examen").then(response=>{
                this.tipoExamen = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getPaises(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/pais/options').subscribe((response) => {
                this.paises = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","pais").then(response=>{
                this.paises = this.constructOptions(response["arreglo"]);
            });
        }
    }   

    public getSexo(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/sexo/options').subscribe((response) => {
                this.sexo = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","sexo").then(response=>{
                this.sexo = this.constructOptions(response["arreglo"]);
            });
        }
    }    

    public getTipoInterviniente(){
        if(this.onLine.onLine){
            this.http.get('/v1/base/tipos-intervinientes/options').subscribe((response) => {
                this.tipoInterviniente = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","tipo_interviniente").then(response=>{
                this.tipoInterviniente = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getEscolaridad(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/escolaridad/options').subscribe((response) => {
                this.escolaridad = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","escolaridad").then(response=>{
                this.escolaridad = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getOcupacion(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/ocupacion/options').subscribe((response) => {
                this.ocupacion = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","ocupacion").then(response=>{
                this.ocupacion = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getEstadoCivil(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/estado-civil/options').subscribe((response) => {
                this.estadoCivil = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","estado_civil").then(response=>{
                this.estadoCivil = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getIdioma(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/idioma/options').subscribe((response) => {
                this.idioma = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","idioma").then(response=>{
                this.idioma = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getGrupoEtnico(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/grupo-etnico/options').subscribe((response) => {
                this.grupoEtnico = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","idioma").then(response=>{
                this.grupoEtnico = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getInterprete(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/interprete/options').subscribe((response) => {
                this.interprete = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","interprete").then(response=>{
                this.interprete = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getAdiccion(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/adiccion/options').subscribe((response) => {
                this.adiccion = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","adiccion").then(response=>{
                this.adiccion = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getNacionalidad(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/nacionalidad/options').subscribe((response) => {
                this.nacionalidad = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","nacionalidad").then(response=>{
                this.nacionalidad = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getTipoDomicilio(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/tipo-domicilio/options').subscribe((response) => {
                this.tipoDomicilio = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","tipo_domicilio").then(response=>{
                this.tipoDomicilio = this.constructOptions(response["arreglo"]);
            });
        }
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
    public getEstadoByPaisService(idPais: number){
        return this.http.get('/v1/catalogos/estado/pais/'+idPais+'/options');
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

    public getMunicipiosByEstadoService(idEstado: number){
        return this.http.get('/v1/catalogos/municipio/estado/'+idEstado+'/options');
    }

    public getColoniasByMunicipio(idMunicipio: number){
        this.http.get('/v1/catalogos/colonia/municipio/'+idMunicipio+'/options').subscribe((response) => {
            this.colonias = this.constructOptions(response);
        });
    }

    public getLocalidadByColonias(idColonia: number){
        this.http.get('/v1/catalogos/localidad/colonia/'+idColonia+'/options').subscribe((response) => {
            this.localidad = this.constructOptions(response);
        });
    }

    public getAlfabetismo(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/persona/alfabetismo/options').subscribe((response) => {
                this.alfabetismo = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","alfabetismo").then(response=>{
                this.alfabetismo = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getTipoPersona(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/predenuncia/tipo-persona/options').subscribe((response) => {
                this.tipoPersona = this.constructOptions(response);
            });
        }else{
            this.db.get("catalogos","tipo_persona").then(response=>{
                this.tipoPersona = this.constructOptions(response["arreglo"]);
            });
        }
    }

    public getTipoLinea(){
        if(this.onLine.onLine){
            this.http.get('/v1/catalogos/predenuncia/tipo-linea/options').subscribe((response) => {
                this.tipoLinea = this.constructOptions(response);
            });
        }else{
            // this.db.get("catalogos","tipo_persona").then(response=>{
            //     this.tipoPersona = this.constructOptions(response["arreglo"]);
            // });
        }
    }

    public constructOptions(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }

    public find(_attr:string, _val:string){
        return this[_attr][_val];
    }

    
}
