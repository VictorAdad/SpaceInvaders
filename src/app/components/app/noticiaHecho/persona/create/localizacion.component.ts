import { LosForm } from './persona-fisica-imputado.component';
import { PersonaGlobals } from './persona-fisica-imputado.component';
import { Options } from './options';
import { Component, Input, ViewChild } from '@angular/core';
import { FormArray } from '@angular/forms';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
import { PersonaService } from '@services/noticia-hecho/persona/persona.service';
import { SelectsService} from '@services/selects.service';
import { Logger } from "@services/logger.service";
import { TableService} from '@utils/table/table.service';
import { MatPaginator } from '@angular/material';
import { Observable }  from 'rxjs/Observable';


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
      if(id!=null && typeof id !='undefined' && id != ""){
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
        if(id!=null && typeof id !='undefined' && id != "")
        this.options.getMunicipiosByEstado(id);
    }

    changeMunicipio(id){
        if(id!=null && typeof id !='undefined' && id != ""){
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
    templateUrl : './localizacion.form.html',
    styles :[
        ".latabla{border-style: solid; border-color: rgb(226, 222, 220); border-width: 2px;}",
    ]
})
export class LocalizacionFormComponent{
    @Input()
    public globals: PersonaGlobals;
    public options: Options;
    @Input()
    public indexForm: number;
    public isMexico:boolean=false;

    antIdMunicipio=null;
    idMunicipioBuscadoEnColonia=null;
    idMunicipioBuscadoEnLocalidad=null;
    antIdEstado=null;
    antIdPais=null;
    dataSource=null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    data=[];
    public displayedColumns = ['direccion'];
    mensajeBoton="Agregar";
    cantidad=0;
    form=LosForm.createFormLocalizacion();
    indiceActual=-1;
    idMexico=-1;
    radioTipoResidencia=null;
    loadListLocalidades=false;

    constructor(
        private http: HttpService,
        private onLine: OnLineService,
        private db: CIndexedDB,
        private select: SelectsService
        ){
        // this.options =  new SelectsService(this.http, this.onLine, this.tabla);
    }

    ngOnInit(){
        console.log('<<<<<<Localidades>>>>>', this.select);
        this.idMexico=_config.optionValue.idMexico;
        Logger.log('->LocalizacionForm Globals', this.globals,this.idMexico);
        Logger.log('->LocalizacionForm IndexForm', this.indexForm);
        this.options = new Options(this.http, this.onLine, this.db, this.select);
        this.dataSource = new TableService(this.paginator, this.data);
        const timer = Observable.timer(2000);
        this.globals.form.controls['id'].valueChanges.subscribe(data => {
            Logger.logColor('ID FORM','red',data);
            this.loadListLocalidades = Number.isInteger(data);
          });
        Logger.logColor('--------->','green', this.globals.form.value,this.options);
        this.globals.form.controls['localizacionPersona'].valueChanges.subscribe(data => {
            if (data.length > 0 ) {
                this.agregaLocalizaciones(data);
                this.loadListLocalidades = false;
            }else {
                const timer2 = Observable.timer(2000);
                timer2.subscribe(t => {
                    this.loadListLocalidades = false;
                });
            }
            Logger.logColor('Entre aqui','red');
        });

        this.form.valueChanges.subscribe(
            change => this.globals.formLocalizacion = this.form
        );
    }
    /**
     * En esta funcion van a caer TODAS  las modificaciones del formulario de localizaciones
     * @param data Es un array con todas las localizaciones
     */
    public agregaLocalizaciones(data){
            this.data=data;
            this.dataSource = new TableService(this.paginator, this.data);
    }
    public cancelar(){
        this.mensajeBoton="Agregar";
        this.form.reset();
        this.indiceActual=-1;
        this.radioTipoResidencia=null;
    }  

    editar(localizacion,i){
        Logger.log(localizacion,i);
        if (i==this.indiceActual)
            return;
        this.mensajeBoton="Editar";
        this.indiceActual=i;
        this.form.controls.pais.patchValue(localizacion.pais);
        let timer = Observable.timer(1);
        timer.subscribe(t=>{
            this.form.patchValue(localizacion);
            this.radioTipoResidencia=localizacion.tipoRecidencia;
        });
    }

    agregarNombres(dato){
        if (dato.pais && dato.pais["id"]){
            for (var i=0; i<this.options.paises.length; i++){
                if (dato.pais["id"]==this.options.paises[i]["value"]){
                    dato.pais["nombre"]=""+this.options.paises[i]["label"]
                    break;
                }
            }
        }
        if (dato.estado && dato.estado["id"]){
            for (var i=0; i<this.options.estados.length; i++){
                if (dato.estado["id"]==this.options.estados[i]["value"]){
                    dato.estado["nombre"]=""+this.options.estados[i]["label"]
                    break;
                }
            }
        }
        if (dato.municipio && dato.municipio["id"]){
            for (var i=0; i<this.options.municipios.length; i++){
                if (dato.municipio["id"]==this.options.municipios[i]["value"]){
                    dato.municipio["nombre"]=""+this.options.municipios[i]["label"]
                    break;
                }
            }
        }
        if (dato.colonia && dato.colonia["idCp"]){
            for (var i=0; i<this.options.colonias.length; i++){
                if (dato.colonia["idCp"]==this.options.colonias[i]["value"]){
                    dato.colonia["nombre"]=""+this.options.colonias[i]["label"]
                    break;
                }
            }
        }
        if (dato.localidad && dato.localidad["id"]){
            for (var i=0; i<this.options.localidad.length; i++){
                if (dato.localidad["id"]==this.options.localidad[i]["value"]){
                    dato.localidad["nombre"]=""+this.options.localidad[i]["label"]
                    break;
                }
            }
        }
        if (dato.tipoDomicilio && dato.tipoDomicilio["id"]){
            for (var i=0; i<this.options.tipoDomicilio.length; i++){
                if (dato.tipoDomicilio["id"]==this.options.tipoDomicilio[i]["value"]){
                    dato.tipoDomicilio["nombre"]=""+this.options.tipoDomicilio[i]["label"]
                    break;
                }
            }
        }
    }

    addLocalizacion(dato){
        let localizaciones = this.globals.form.get('localizacionPersona') as FormArray;
        this.agregarNombres(dato);
        //si se esta editando
        Logger.logColor("Datos","pink",this.indiceActual,this.mensajeBoton,dato,this.idMexico);
        if (this.mensajeBoton!="Agregar"){
            //hay que encontar el indice
            localizaciones.controls[this.indiceActual].patchValue(this.form.value);
            this.data[this.indiceActual]=dato;
        }else{//nuevo
            let temForm=LosForm.createFormLocalizacion();
            temForm.patchValue(dato);
            localizaciones.push(temForm);
        }
        this.mensajeBoton="Agregar";
        this.form.reset();
        this.form.valid;
        this.indiceActual=-1;
        this.radioTipoResidencia=null;
        this.cantidad=this.data.length;
    }


    public changePais(id){
        if(id!=null && typeof id !='undefined' && this.antIdPais!=id && id != ""){
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
        this.cleanSelects(true);
    }

    public buscaColonias(){
        Logger.log("Entro Aqui antes de",this.antIdMunicipio,this.idMunicipioBuscadoEnColonia);
        if (this.antIdMunicipio!=this.idMunicipioBuscadoEnColonia){
            this.options.getColoniasByMunicipio(this.antIdMunicipio);
        }
        this.idMunicipioBuscadoEnColonia=this.antIdMunicipio;
    }

    public buscaLocalidades(){
        Logger.log("Entro Aqui antes de",this.antIdMunicipio,this.idMunicipioBuscadoEnLocalidad);
        if (this.antIdMunicipio!=this.idMunicipioBuscadoEnLocalidad){
            this.options.getLocalidadByMunicipio(this.antIdMunicipio);
        }
        this.idMunicipioBuscadoEnLocalidad=this.antIdMunicipio;
    }

    private cleanSelects(municipio){
        if (municipio)
            this.form.controls.municipio.reset();
        this.form.controls.colonia.reset();
        this.form.controls.localidad.reset();
        this.form.controls.cp.reset();
    }

    public changeEstado(id){
        if(id!=null && typeof id !='undefined' && this.antIdEstado!=id && id != ""){
            this.options.getMunicipiosByEstado(id);
            this.cleanSelects(true);
        }
        this.antIdEstado=id;
    }

    public changeMunicipio(id){
        Logger.logColor("MUNICIPIO","purple",this.globals.isFillForm);
        if(id!=null && typeof id !='undefined' && id!=this.antIdMunicipio && id != ""){
            if (!this.globals.isFillForm){
                this.options.getColoniasByMunicipio(id);
                this.options.getLocalidadByMunicipio(id);
                this.idMunicipioBuscadoEnLocalidad=id;
                this.idMunicipioBuscadoEnColonia=id;
            }else{
                // var _data=this.globals.personaCaso;
                // Logger.logColor("PERSONA","brown",this.globals.personaCaso);
                // if (_data.localizacionPersona[i]['colonia'] && _data.localizacionPersona[i]['colonia']["id"])
                //     this.options.colonias=[{value:_data.localizacionPersona[i]['colonia']['id']+"-"+_data.localizacionPersona[i]['colonia']['cp'],label:_data.localizacionPersona[i]['colonia']['nombre']}];
                // if (_data.localizacionPersona[i]['localidad'] && _data.localizacionPersona[i]['localidad']["id"])
                //     this.options.localidad=[{value:_data.localizacionPersona[i]['localidad']['id'],label:_data.localizacionPersona[i]['localidad']['nombre']}];
            }
            this.cleanSelects(false);
        }
        this.antIdMunicipio=id;
    }

    public changeColonia(idCp){
        Logger.log("Colonia",idCp,this.options);
        if (idCp){
            let arr = idCp.split("-");
            console.log('çç',arr, this.options.localidad);
            this.form.controls.cp.patchValue(arr[1]);
            this.form.controls.colonia.patchValue({id:arr[0]});
            let localidadId=parseInt( arr[2] );
            this.form.controls.localidad.patchValue({id: localidadId });
        }

    }

    changeTipoResida(value){
        Logger.log(this.indiceActual,"TIPOResidencia", value, this.form,this.radioTipoResidencia );
        this.form.controls.tipoRecidencia.patchValue(value);
        this.radioTipoResidencia=value;
        // Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls );
        // Logger.log(i,"TIPOResidencia", value, this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoResidencia );
        // this.globals.form.controls.localizacionPersona["controls"][i].controls.tipoRecidencia.patchValue(value);
        // this.form.controls.tipoRecidencia.patchValue(value);
    }

}