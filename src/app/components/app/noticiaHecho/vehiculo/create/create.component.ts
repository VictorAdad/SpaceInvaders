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


    constructor(
        public optionsServ: SelectsService,
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        public vehiculoServ: VehiculoService
        ) {
        super();
        console.log('vehiculoserv', this.vehiculoServ);

        optionsServ.getEstadoByPais(1);
    }

    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
        ];

    ngOnInit() {
        this.model = new Vehiculo();
        this.form = new FormGroup({
            'motivoRegistro'        : new FormControl("", [Validators.required,]),
            'campoVehiculo'         : new FormControl("", [Validators.required,]),
            'tarjetaCirculacion'    : new FormControl("", [Validators.required,]),
            'economico'           : new FormControl("", [Validators.required,]),
            'clase'                 : new FormControl("", [Validators.required,]),
            'marca'                 : new FormControl("", [Validators.required,]),
            'submarca'              : new FormControl("", [Validators.required,]),
            'color'                 : new FormControl("", [Validators.required,]),
            'modelo'                : new FormControl("", [Validators.required,]),
            'placas'                : new FormControl("", [Validators.required,]),
            'placasAdicionales'     : new FormControl("", [Validators.required,]),
            'registroFederal'       : new FormControl("", [Validators.required,]),
            'serie'                 : new FormControl("", [Validators.required,]),
            'motor'                 : new FormControl("", [Validators.required,]),
            'aseguradora'           : new FormControl("", [Validators.required,]),
            'factura'               : new FormControl("", [Validators.required,]),
            'datosTomados'          : new FormControl("", [Validators.required,]),
            'poliza'                : new FormControl("", [Validators.required,]),
            'valorEstimado'         : new FormControl("", [Validators.required,]),
            'tipoUso'               : new FormControl("", []),
            'procedencia'           : new FormControl("", [Validators.required,]),
            'pedimentoImportacion'  : new FormControl("", [Validators.required,]),
            'llevaCarga'            : new FormControl(""),
            'alterado'              : new FormControl(""),
            'senasParticulares'     : new FormControl("", [Validators.required,]),
            'notas'                 : new FormControl("", []),

            'marcaSubmarca'         : new FormGroup({
                'id' : new FormControl("",[])
            }),
            'procedenciaAseguradora': new FormGroup({
                'id'  : new FormControl("",[])
            }),
            'tipoUsoVehiculo'       : new FormGroup({
                'id'    : new FormControl("",[])
            }),
            'caso'                  : new  FormGroup({
                'id'    : new FormControl("",[])
            }),
            'estadoOrigen'  : new FormGroup({
                'id'    : new FormControl("",[]),
            }), 
            'motivoColorClase'       : new FormGroup({
                'id': new FormControl("",[]),
            })  

        });

        this.form.controls.pedimentoImportacion.disable();

        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"})
             }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/vehiculos/'+this.id).subscribe(response =>{
                        this.fillForm(response);
                    });
                }else{
                    this.db.get("casos",this.casoId).then(t=>{
                        let vehiculos=t["vehiculo"] as any[];
                        for (var i = 0; i < vehiculos.length; ++i) {
                            if ((vehiculos[i])["id"]==this.id){
                                this.fillForm(vehiculos[i]);
                                break;
                            }
                        }
                    });
                }
                
            }
        });
        this.validateForm(this.form);
    }

    public change(option){
        if (option == "cdmx") {
            this.isProcedenciaExtranjera = true;
            this.form.controls.pedimentoImportacion.enable();
        }else{
            this.isProcedenciaExtranjera = false;
            this.form.controls.pedimentoImportacion.disable();
        }
    }

    public save(valid : any, _model : any){
        return new Promise<any>((resolve, reject)=>{
            if(this.onLine.onLine){
                Object.assign(this.model, _model);
                this.model.caso.id = this.casoId;
                // this.model.caso.created = null;
                this.http.post('/v1/base/vehiculos', this.model).subscribe(
                    (response) => {
                        this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/vehiculos' ]);
                        resolve("Se creo el vehículo con éxito");
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
                    this.db.get("casos",this.casoId).then(caso=>{
                        if (caso){
                            if(!caso["vehiculo"]){
                                caso["vehiculo"]=[];
                            }
                            this.model["id"]=temId;
                            caso["vehiculo"].push(this.model);
                            this.db.update("casos",caso).then(t=>{
                                resolve("Se creo el vehículo de manera local");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/vehiculos' ]);
                            });
                        }
                    });
                }); 

            }
        });
	}

    public edit(_valid : any, _model : any){
        return new Promise((resolve,reject)=>{
            console.log('-> Vechiulo@edit()', _model);
            if(this.onLine.onLine){
                this.http.put('/v1/base/vehiculos/'+this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    resolve("Se actualizo el vehiculo");
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
                    this.db.get("casos",this.casoId).then(t=>{
                        let vehiculos=t["vehiculo"] as any[];
                        _model["id"]=this.id;
                        for (var i = 0; i < vehiculos.length; ++i) {
                            if ((vehiculos[i])["id"]==this.id){
                                vehiculos[i]=_model;
                                break;
                            }
                        }
                        this.db.update("casos", t).then(r=>{
                            resolve("vehiculo actualizado");
                            console.log('-> Registro acutualizado');
                        });
                        console.log("caso",t);
                    });
                }); 
            }
        });
    }

    public fillForm(_data){
        this.form.patchValue(_data);
    }

}