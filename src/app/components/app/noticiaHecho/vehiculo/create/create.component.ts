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
        private optionsServ: SelectsService,
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        private vehiculoServ: VehiculoService
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
            'nTarjeta'             : new FormControl("", [Validators.required,]),
            'nEconomico'           : new FormControl("", [Validators.required,]),
            'clase'                 : new FormControl("", [Validators.required,]),
            'marca'                 : new FormControl("", [Validators.required,]),
            'submarca'              : new FormControl("", [Validators.required,]),
            'color'                 : new FormControl("", [Validators.required,]),
            'modelo'                : new FormControl("", [Validators.required,]),
            'placas'                : new FormControl("", [Validators.required,]),
            'placasAdicionales'    : new FormControl("", [Validators.required,]),
            'rfv'                   : new FormControl("", [Validators.required,]),
            'serie'                 : new FormControl("", [Validators.required,]),
            'motor'                 : new FormControl("", [Validators.required,]),
            'aseguradora'           : new FormControl("", [Validators.required,]),
            'factura'               : new FormControl("", [Validators.required,]),
            'datosTomadosDe'      : new FormControl("", [Validators.required,]),
            'nPoliza'              : new FormControl("", [Validators.required,]),
            'valorEstimado'        : new FormControl("", [Validators.required,]),
            'tipoUso'               : new FormControl("", []),
            'procedencia'           : new FormControl("", [Validators.required,]),
            'pedimentoDeImportacion': new FormControl("", [Validators.required,]),
            'llevaCarga'           : new FormControl("", [Validators.required,]),
            'alterado'              : new FormControl("", [Validators.required,]),
            'señasParticulares'    : new FormControl("", [Validators.required,]),
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
            'estadoOrigenPlacas'  : new FormGroup({
                'id'    : new FormControl("",[]),
            }), 
            'motivoColorClase'       : new FormGroup({
                'id': new FormControl("",[]),
            })  

        });

        this.form.controls.pedimentoDeImportacion.disable();

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
    }

    public change(option){
        if (option == "cdmx") {
            this.isProcedenciaExtranjera = true;
            this.form.controls.pedimentoDeImportacion.enable();
        }else{
            this.isProcedenciaExtranjera = false;
        }
    }

    public save(valid : any, _model : any):void{
        if(this.onLine.onLine){
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            // this.model.caso.created = null;
            this.http.post('/v1/base/vehiculos', this.model).subscribe(
                (response) => this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]),
                (error) => console.error('Error', error)
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
                            this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                        });
                    }
                });
            }); 

        }
	}

    public edit(_valid : any, _model : any):void{
        console.log('-> Vechiulo@edit()', _model);
        if(this.onLine.onLine){
            this.http.put('/v1/base/vehiculos/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro acutualizado', response);
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
                    for (var i = 0; i < vehiculos.length; ++i) {
                        if ((vehiculos[i])["id"]==this.id){
                            vehiculos[i]=_model;
                            break;
                        }
                    }
                    console.log("caso",t);
                });
                console.log('-> Registro acutualizado');
            }); 
        }
    }

    public fillForm(_data){
        this.form.patchValue(_data);
    }

}