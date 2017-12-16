import { Validation } from '@services/validation/validation.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehiculo } from '@models/vehiculo';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { MOption } from '@partials/form/select2/select2.component';
import { NoticiaHechoGlobal } from '../../global';
import { VehiculoService } from '@services/noticia-hecho/vehiculo/vehiculo.service';
import { SelectsService} from '@services/selects.service';
import { Observable }  from 'rxjs/Observable';
import { CasoService } from '@services/caso/caso.service';
import { _config} from '@app/app.config';
import { Logger } from "@services/logger.service";

@Component({
    selector: 'vehiculo-create',
    templateUrl: './create.component.html'
})

export class VehiculoCreateComponent extends NoticiaHechoGlobal implements OnInit {
    public form: FormGroup;
    public model: Vehiculo;

    public casoId: number = null;
    public id: number = null;
    public breadcrumb = [];
    public isProcedenciaExtranjera: boolean =false;
    public regexPlaca = /^(?:\s*[a-zA-Z0-9]{1,}\s*)*$/
    public isOneFilled:boolean=false;
    public hintObligatorio="Campo obligatorio";
    public isRobo:boolean=false;

    constructor(
        public optionsServ: SelectsService,
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        public vehiculoServ: VehiculoService,
        public casoService:CasoService
        ) {
        super();
        optionsServ.getEstadoByPais(_config.optionValue.idMexico);

        let timer = Observable.timer(1000);
        timer.subscribe(t => {
            vehiculoServ.marcaSubmarca.submarca = [];
            Logger.log('vehiculoserv', this.vehiculoServ);
        });

    }

    ngOnInit() {
        this.model = new Vehiculo();
        this.form = new FormGroup({
            'id'  : new FormControl("",[]),
            'motivoRegistro'        : new FormControl("", []),
            'campoVehiculo'         : new FormControl("", []),
            'tarjetaCirculacion'    : new FormControl("", []),
            'noEconomico'           : new FormControl("", []),
            'clase'                 : new FormControl("", []),
            'marca'                 : new FormControl("", []),
            'submarca'              : new FormControl("", []),
            'color'                 : new FormControl("", []),
            'modelo'                : new FormControl("", [Validators.required]),
            'placas'                : new FormControl("", [Validators.required]),
            'placasAdicionales'     : new FormControl("", []),
            'registroFederalVehiculo': new FormControl("", []),
            'noSerie'               : new FormControl("", [Validators.required]),
            'noMotor'               : new FormControl("", [Validators.required]),
            'aseguradora'           : new FormControl("", []),
            'factura'               : new FormControl("", []),
            'datosTomados'          : new FormControl("", []),
            'noPoliza'              : new FormControl("", []),
            'valorEstimado'         : new FormControl("", []),
            'tipoUso'               : new FormControl("", []),
            'procedencia'           : new FormControl("", []),
            'pedimentoImportancion' : new FormControl("", []),
            'llevaCarga'            : new FormControl(""),
            'alterado'              : new FormControl(""),
            'seniasParticulares'     : new FormControl("", []),
            'notas'                 : new FormControl("", []),

            'marcaSubmarca'         : new FormGroup({
                'id' : new FormControl("",[])
            }),
            'procedenciaAseguradora': new FormGroup({
                'id'  : new FormControl("",[])
            }),
            'tipoUsoTipoVehiculo'       : new FormGroup({
                'id'    : new FormControl("",[])
            }),
            'caso'                  : new  FormGroup({
                'id'    : new FormControl("",[])
            }),
            'estadoOrigenPlacas'  : new FormGroup({
                'id'    : new FormControl("",[]),
            }),
            'motivoRegistroColorClase'       : new FormGroup({
                'id': new FormControl("",[]),
            })

        });

        this.form.controls.pedimentoImportancion.disable();

        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho/vehiculos`,label:"Detalle noticia de hechos"})
                this.casoService.find(this.casoId).then(r=>{
                  console.log(this.casoService)
                  this.validateDelitoRobo(this.casoService.caso);
                });


             }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/vehiculos/'+this.id).subscribe(response =>{
                        this.fillForm(response);
                        this.form.controls.id.patchValue(this.id);
                    });
                }else{
                    //this.db.get("casos",this.casoId).then(t=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var t=this.casoService.caso;
                        let vehiculos=t["vehiculos"] as any[];
                        for (var i = 0; i < vehiculos.length; ++i) {
                            if ((vehiculos[i])["id"]==this.id){
                                this.fillForm(vehiculos[i]);
                                this.form.controls.id.patchValue(this.id);
                                break;
                            }
                        }
                    });
                }

            }
        });
        let timer = Observable.timer(1);
        timer.subscribe(t => {
            this.validateForm(this.form);
        });
    }

    public validateDelitoRobo(caso){
      console.log('Casoooo',caso)

      let isRoboSecundario=false;
      caso.delitoCaso.forEach(delito => {
        if(delito.delitonombre==_config.optionValue.delito.robo){
          isRoboSecundario=true;
        }
      });

      if(caso.delitoPrincipal.nombre==_config.optionValue.delito.robo || isRoboSecundario)
      {
        /*
          VIN
          Placas
          No. de Motor
          Modelo
        */
        this.isRobo=true;
        this.isOneFilled=true;
        console.log(this.isOneFilled)
        console.log(this.form.value)
      }
      else{
        this.hintObligatorio="";
        console.log('not robo')
        this.form.controls.placas.setValidators([]);
        this.form.controls.modelo.setValidators([]);
        this.form.controls.noSerie.setValidators([]);
        this.form.controls.noMotor.setValidators([]);

        this.form.controls.placas.updateValueAndValidity();
        this.form.controls.modelo.updateValueAndValidity();
        this.form.controls.noSerie.updateValueAndValidity();
        this.form.controls.noMotor.updateValueAndValidity();

        this.isOneFilled=this.atLeastOneFilled(this.form);
        //console.log('Al menos uno',this.isOneFilled);

      }

    }
public validate(form: FormGroup){
  this.validateForm(form)
 console.log('isRobo',this.isRobo);
 if(!this.isRobo)
  {
    this.isOneFilled= this.atLeastOneFilled(form);
  }
 console.log('is one filled',this.isOneFilled)

}
    public atLeastOneFilled(form: FormGroup) {
      console.log(form);
      for (let i=1; i<Object.keys(form.controls).length; i++)
      {  let keys= Object.keys(form.controls)
         const control = form.get(keys[i]);
        if (control instanceof FormControl) {
          if(control.value !== '' && control.value!==undefined )
            { console.log('true',control);return true;}
      } else if (control instanceof FormGroup) {
            if(this.atLeastOneFilled(control))
              return true;
      } else if (control instanceof FormArray){
        for (let i=1; i<Object.keys(form.controls).length; i++)
        {  let keys= Object.keys(form.controls)
          const controlArray = control.controls[keys[i]];
          if (controlArray instanceof FormControl) {
            if(control.value !== '' && control.value!==undefined )
            { console.log('true',control);return true;}
          } else if (controlArray instanceof FormGroup) {
              if(this.atLeastOneFilled(controlArray))
              { console.log('true',control);return true;}
            }
         }
      }

      }
      return false;

    }



    public changeSelect(matrix, value){

    }

    public change(option){
        if (option == "EXTRANJERO") {
            this.isProcedenciaExtranjera = true;
            this.form.controls.pedimentoImportancion.enable();
        }else{
            this.isProcedenciaExtranjera = false;
            this.form.controls.pedimentoImportancion.disable();
        }
    }

    public save(valid : any, _model : any){
        Logger.log("SI",this.vehiculoServ.tipoUsoTipoVehiculo.finded);
        if (this.vehiculoServ.tipoUsoTipoVehiculo.finded[0]){
            _model.tipoUsoTipoVehiculo.id=this.vehiculoServ.tipoUsoTipoVehiculo.finded[0].id;
            _model.tipoUsoTipoVehiculo["tipoVehiculo"]=this.vehiculoServ.tipoUsoTipoVehiculo.finded[0].tipoVehiculo;
        }
        if (this.vehiculoServ.marcaSubmarca.finded[0]){
            _model.marcaSubmarca.id=this.vehiculoServ.marcaSubmarca.finded[0].id;
            _model.marcaSubmarca["marca"]=this.vehiculoServ.marcaSubmarca.finded[0].marca;
        }
        if (this.vehiculoServ.procedenciaAseguradora.finded[0])
            _model.procedenciaAseguradora.id=this.vehiculoServ.procedenciaAseguradora.finded[0].id;
        if (this.vehiculoServ.motivoColorClase.finded[0]){
            _model.motivoRegistroColorClase.id=this.vehiculoServ.motivoColorClase.finded[0].id;
            _model.motivoRegistroColorClase["color"]=this.vehiculoServ.motivoColorClase.finded[0].color;
        }
        Logger.log("MODEL@SAVE=>",_model);
        Logger.log(this.vehiculoServ);
        return new Promise<any>((resolve, reject)=>{
            if(this.onLine.onLine){
                Object.assign(this.model, _model);
                this.model.caso.id = this.casoId;
                // this.model.caso.created = null;
                this.http.post('/v1/base/vehiculos', this.model).subscribe(
                    (response) => {
                        this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/vehiculos' ]);
                        resolve("Se creo el vehículo con éxito");
                        this.vehiculoServ.reset();
                        this.casoService.actualizaCaso();
                    },
                    (error) => reject(error)
                );
            }else{
                Object.assign(this.model, _model);
                this.model.caso.id = this.casoId;
                // this.model.caso.created = null;
                let temId=Date.now();
                let dato={
                    url:'/v1/base/vehiculos',
                    body:this.model,
                    options:[],
                    tipo:"post",
                    pendiente:true,
                    dependeDe:[this.casoId],
                    temId: temId
                }
                this.db.add("sincronizar",dato).then(p=>{
                    //this.db.get("casos",this.casoId).then(caso=>{
                        var caso=this.casoService.caso;
                        if (caso){
                            if(!caso["vehiculos"]){
                                caso["vehiculos"]=[];
                            }
                            this.model["id"]=temId;
                            caso["vehiculos"].push(this.model);
                            this.db.update("casos",caso).then(t=>{
                                resolve("Se creo el vehículo de manera local");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/vehiculos' ]);
                                this.vehiculoServ.reset();
                            });
                        }
                    //});
                });

            }
        });
	}

    public edit(_valid : any, _model : any){
        var obj=this;
        if (this.vehiculoServ.tipoUsoTipoVehiculo.finded[0]){
            _model.tipoUsoTipoVehiculo.id=this.vehiculoServ.tipoUsoTipoVehiculo.finded[0].id;
            _model.tipoUsoTipoVehiculo["tipoVehiculo"]=this.vehiculoServ.tipoUsoTipoVehiculo.finded[0].tipoVehiculo;
        }
        if (this.vehiculoServ.marcaSubmarca.finded[0]){
            _model.marcaSubmarca.id=this.vehiculoServ.marcaSubmarca.finded[0].id;
            _model.marcaSubmarca["marca"]=this.vehiculoServ.marcaSubmarca.finded[0].marca;
        }
        if (this.vehiculoServ.procedenciaAseguradora.finded[0])
            _model.procedenciaAseguradora.id=this.vehiculoServ.procedenciaAseguradora.finded[0].id;
        if (this.vehiculoServ.motivoColorClase.finded[0]){
            _model.motivoRegistroColorClase.id=this.vehiculoServ.motivoColorClase.finded[0].id;
            _model.motivoRegistroColorClase["color"]=this.vehiculoServ.motivoColorClase.finded[0].color;
        }
        Logger.log("MODEL@EDIT=>",_model);
        return new Promise((resolve,reject)=>{
            Logger.log('-> Vechiulo@edit()', _model);
            _model.caso.id      = this.casoId;
            _model.id = this.id;
            if(this.onLine.onLine){
                this.http.put('/v1/base/vehiculos/'+this.id, _model).subscribe((response) => {
                    Logger.log('-> Registro acutualizado', response);
                    resolve("Se actualizo el vehiculo");
                    obj.vehiculoServ.reset();
                    obj.casoService.actualizaCaso();
                },e=>{
                    reject(e);
                });
            }else{
                let dato={
                    url:'/v1/base/vehiculos/'+this.id,
                    body:_model,
                    options:[],
                    tipo:"update",
                    pendiente:true,
                    dependeDe:[this.casoId, this.id]
                }
                this.db.add("sincronizar",dato).then(p=>{
                    //this.db.get("casos",this.casoId).then(t=>{
                        var t=this.casoService.caso;
                        let vehiculos=t["vehiculos"] as any[];
                        _model["id"]=this.id;
                        for (var i = 0; i < vehiculos.length; ++i) {
                            if ((vehiculos[i])["id"]==this.id){
                                vehiculos[i]=_model;
                                break;
                            }
                        }
                        this.db.update("casos", t).then(r=>{
                            resolve("vehiculo actualizado");
                            this.vehiculoServ.reset();
                            Logger.log('-> Registro acutualizado');
                        });
                        Logger.log("caso",t);
                    //});
                });
            }
        });
    }

    public fillForm(_data){
        var rec = function(x){
            if (typeof x == "object"){
                for(let i in x){
                    if (x[i]==null || typeof x[i] =="undefined"){
                        delete x[i];
                    }
                    if (typeof x[i]=="object")
                        rec(x[i]);
                }
            }
        }
        rec(_data);
        if(this.onLine.onLine){
            if (_data.marcaSubmarca){
                _data["marca"]=_data.marcaSubmarca.marca;
                _data["submarca"]=_data.marcaSubmarca.submarca;
                let timer = Observable.timer(1);
                timer.subscribe(t => {
                  this.marcaChange(_data.marcaSubmarca.marca)
                });
            }
            if (_data.motivoRegistroColorClase){
                _data["clase"]=_data.motivoRegistroColorClase.clase;
                _data["color"]=_data.motivoRegistroColorClase.color;
                _data["motivoRegistro"]=_data.motivoRegistroColorClase.motivoRegistro;
            }
            if (_data.procedenciaAseguradora){
                _data["aseguradora"]=_data.procedenciaAseguradora.aseguradora;
                _data["procedencia"]=_data.procedenciaAseguradora.procedencia;
            }
            if (_data.tipoUsoTipoVehiculo){
                _data["tipoUso"]=_data.tipoUsoTipoVehiculo.tipoUso;
                _data["campoVehiculo"]=_data.tipoUsoTipoVehiculo.tipoVehiculo;
                _data["datosTomados"]=_data.tipoUsoTipoVehiculo.datosTomadosDe;
            }
        }
        this.form.patchValue(_data);
        let timer = Observable.timer(1);
        timer.subscribe(t => {
            this.form.controls.pedimentoImportancion.setValue(_data.pedimentoImportancion);
        });


    }

    public marcaChange(_event){
        console.log('Marca Change',_event)
        this.vehiculoServ.marcaSubmarca.find(_event, 'marca');
        this.vehiculoServ.marcaSubmarca.filterBy(_event, 'marca', 'submarca');

    }

}
