import { LosForm } from './persona-fisica-imputado.component';
import { PersonaGlobals } from './persona-fisica-imputado.component';
import { Options } from './options';
import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
import { PersonaService } from '@services/noticia-hecho/persona/persona.service';
import { SelectsService} from '@services/selects.service';


@Component({
    selector: 'localizacion',
    templateUrl : './localizacion.component.html'
})
export class LocalizacionComponent{
    @Input()
    globals: PersonaGlobals;
    options: Options;
    isMexico:boolean=false;
    @Input()
    localizaciones: string[] = [];
    public localizacionIndex: number = 0;

    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
        private select: SelectsService,
        public personaServ: PersonaService){
        this.localizaciones.unshift(null);
    }

    ngOnInit(){
        
        console.log('Options: ', this.options);
    }

    changePais(id){
      if(id!=null && typeof id !='undefined'){
      this.isMexico=id==_config.optionValue.idMexico;
      this.options.getEstadoByPais(id);
        for (var i = 0; i < this.options.paises.length; ++i) {
            var pais=this.options.paises[i];
            if(pais.value==id && pais.label=="MEXICO"){
                this.isMexico=true;
            }
        }
       }
    }

    trackByIndex(index, item){
        return index;
    }

    changeEstado(id){
        if(id!=null && typeof id !='undefined')
        this.options.getMunicipiosByEstado(id);
    }

    changeMunicipio(id){
        if(id!=null && typeof id !='undefined'){
            this.options.getColoniasByMunicipio(id);
            this.options.getLocalidadByMunicipio(id);
        }
    }

    changeColonia(id){
        // if(id!=null && typeof id !='undefined')
        //     this.options.getLocalidadByColonias(id);
    }


    addLocalizacion(_e){
        console.log(this.globals.form.value);
        let form = LosForm.createFormLocalizacion();
        this.localizaciones.push(null);
        let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
        localizaciones.push(form);
        console.log(localizaciones.value);
    }

    changeTipoResida(value,i){
        console.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i] );
        console.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls );
        console.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoResidencia );
        this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoRecidencia.patchValue(value);
    }

}

@Component({
    selector: 'localizacion-form',
    templateUrl : './localizacion.form.html'
})
export class LocalizacionFormComponent{
    @Input()
    public globals: PersonaGlobals;
    public options: Options;
    @Input()
    public indexForm: number;
    public isMexico:boolean=false;

    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
        private select: SelectsService
        ){
        // this.options =  new SelectsService(this.http, this.onLine, this.tabla);
    }

    ngOnInit(){
        console.log('->LocalizacionForm Globals', this.globals);
        console.log('->LocalizacionForm IndexForm', this.indexForm);
        this.options = new Options(this.http, this.onLine, this.db, this.select);
    }


    public changePais(id){
      if(id!=null && typeof id !='undefined'){
      this.isMexico=id==_config.optionValue.idMexico;
      this.options.getEstadoByPais(id);
        for (var i = 0; i < this.options.paises.length; ++i) {
            var pais=this.options.paises[i];
            if(pais.value==id && pais.label=="MEXICO"){
                this.isMexico=true;
            }
        }
       }
    }

    public changeEstado(id){
        if(id!=null && typeof id !='undefined')
        this.options.getMunicipiosByEstado(id);
    }

    public changeMunicipio(id){
        if(id!=null && typeof id !='undefined'){
            this.options.getColoniasByMunicipio(id);
            this.options.getLocalidadByMunicipio(id);
        }
    }

    public changeColonia(id){
        // if(id!=null && typeof id !='undefined')
        //     this.options.getLocalidadByColonias(id);
    }

    changeTipoResida(value,i){
        console.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i] );
        console.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls );
        console.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoResidencia );
        this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoRecidencia.patchValue(value);
    }

}