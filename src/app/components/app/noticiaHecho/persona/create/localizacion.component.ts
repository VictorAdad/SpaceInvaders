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
import { Logger } from "@services/logger.service";


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
        
        Logger.log('Options: ', this.options);
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
        Logger.log(this.globals.form.value);
        let form = LosForm.createFormLocalizacion();
        this.localizaciones.push(null);
        let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
        localizaciones.push(form);
        Logger.log(localizaciones.value);
    }

    changeTipoResida(value,i){
        Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i] );
        Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls );
        Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoResidencia );
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

    antIdMunicipio=null;
    antIdEstado=null;
    antIdPais=null;

    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
        private select: SelectsService
        ){
        // this.options =  new SelectsService(this.http, this.onLine, this.tabla);
    }

    ngOnInit(){
        Logger.log('->LocalizacionForm Globals', this.globals);
        Logger.log('->LocalizacionForm IndexForm', this.indexForm);
        this.options = new Options(this.http, this.onLine, this.db, this.select);
    }


    public changePais(id){
        if(id!=null && typeof id !='undefined' && this.antIdPais!=id){
            this.isMexico=id==_config.optionValue.idMexico;
            this.options.getEstadoByPais(id);
            for (var i = 0; i < this.options.paises.length; ++i) {
                var pais=this.options.paises[i];
                if(pais.value==id && pais.label=="MEXICO"){
                    this.isMexico=true;
                }
            }
        }
        this.antIdPais=id;
    }

    private cleanSelects(i,municipio){
        if (municipio)
            this.globals.form.controls.localizacionPersona["controls"][i].controls.municipio.reset();
        this.globals.form.controls.localizacionPersona["controls"][i].controls.colonia.reset();
        this.globals.form.controls.localizacionPersona["controls"][i].controls.localidad.reset();
        this.globals.form.controls.localizacionPersona["controls"][i].controls.cp.reset();
    }

    public changeEstado(id,i){
        if(id!=null && typeof id !='undefined' && this.antIdEstado!=id){
            this.options.getMunicipiosByEstado(id);
            this.cleanSelects(i,true);
        }
        this.antIdEstado=id;
    }

    public changeMunicipio(id,i){
        if(id!=null && typeof id !='undefined' && id!=this.antIdMunicipio){
            this.options.getColoniasByMunicipio(id);
            this.options.getLocalidadByMunicipio(id);
            this.cleanSelects(i,false);
        }
        this.antIdMunicipio=id;
    }

    public changeColonia(i,idCp){
        if (idCp){
            let arr = idCp.split("-");
            this.globals.form.controls.localizacionPersona["controls"][i].controls.cp.patchValue(arr[1]);
            this.globals.form.controls.localizacionPersona["controls"][i].controls.colonia.patchValue({id:arr[0]});
        }

    }

    changeTipoResida(value,i){
        Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i] );
        Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls );
        Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoResidencia );
        this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoRecidencia.patchValue(value);
    }

}