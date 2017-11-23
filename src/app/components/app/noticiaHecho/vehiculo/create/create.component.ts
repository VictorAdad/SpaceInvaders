import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
        console.log('vehiculoserv', this.vehiculoServ);

        optionsServ.getEstadoByPais(_config.optionValue.idMexico);
    }

    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
        ];

    ngOnInit() {
        this.model = new Vehiculo();
        this.form = new FormGroup({
            'id'  : new FormControl("",[]),
            'motivoRegistro'        : new FormControl("", [Validators.required,]),
            'campoVehiculo'         : new FormControl("", [Validators.required,]),
            'tarjetaCirculacion'    : new FormControl("", []),
            'noEconomico'           : new FormControl("", []),
            'clase'                 : new FormControl("", []),
            'marca'                 : new FormControl("", [Validators.required,]),
            'submarca'              : new FormControl("", [Validators.required,]),
            'color'                 : new FormControl("", [Validators.required,]),
            'modelo'                : new FormControl("", [Validators.required,]),
            'placas'                : new FormControl("", [Validators.required,]),
            'placasAdicionales'     : new FormControl("", []),
            'registroFederalVehiculo': new FormControl("", []),
            'noSerie'               : new FormControl("", [Validators.required,]),
            'noMotor'               : new FormControl("", [Validators.required,]),
            'aseguradora'           : new FormControl("", []),
            'factura'               : new FormControl("", []),
            'datosTomados'          : new FormControl("", []),
            'noPoliza'              : new FormControl("", []),
            'valorEstimado'         : new FormControl("", []),
            'tipoUso'               : new FormControl("", []),
            'procedencia'           : new FormControl("", []),
            'pedimentoImportacion'  : new FormControl("", []),
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

        this.form.controls.pedimentoImportacion.disable();

        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho/vehiculos`,label:"Detalle noticia de hechos"})
                this.casoService.find(this.casoId);
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

    public changeSelect(matrix, value){

    }

    public change(option){
        if (option == "EXTRANJERO") {
            this.isProcedenciaExtranjera = true;
            this.form.controls.pedimentoImportacion.enable();
        }else{
            this.isProcedenciaExtranjera = false;
            this.form.controls.pedimentoImportacion.disable();
        }
    }

    public save(valid : any, _model : any){
        console.log("SI",this.vehiculoServ.tipoUsoTipoVehiculo.finded);
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
        console.log("MODEL@SAVE=>",_model);
        console.log(this.vehiculoServ);
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
        console.log("MODEL@EDIT=>",_model);
        return new Promise((resolve,reject)=>{
            console.log('-> Vechiulo@edit()', _model);
            _model.caso.id      = this.casoId;
            _model.id = this.id;
            if(this.onLine.onLine){
                this.http.put('/v1/base/vehiculos/'+this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    resolve("Se actualizo el vehiculo");
                    obj.vehiculoServ.reset();
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
                            console.log('-> Registro acutualizado');
                        });
                        console.log("caso",t);
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
    }

}
