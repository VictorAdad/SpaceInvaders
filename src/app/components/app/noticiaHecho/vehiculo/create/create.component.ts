import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehiculo } from '@models/vehiculo';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { CIndexedDB } from '@services/indexedDB';
import { MOption } from '@partials/form/select2/select2.component';
import { NoticiaHechoGlobal } from '../../global';

@Component({
    selector: 'vehiculo-create',
    templateUrl: './create.component.html'
})

export class VehiculoCreateComponent extends NoticiaHechoGlobal implements OnInit {
    public form: FormGroup;
    public model: Vehiculo;

    public casoId: number = null;
    public id: number = null;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB
        ) {
        super();
    }

    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
        ];

    ngOnInit() {
        this.model = new Vehiculo();
        this.form = new FormGroup({
            'motivoRegistro': new FormControl(this.model.motivoRegistro, [Validators.required,]),
            'campoVehiculo': new FormControl(this.model.campoVehiculo, [Validators.required,]),
            //'n_tarjeta': new FormControl(this.model.n_tarjeta, [Validators.required,]),
            //'n_economico': new FormControl(this.model.n_economico, [Validators.required,]),
            //'clase': new FormControl(this.model.clase, [Validators.required,]),
            'marca': new FormControl(this.model.marca, [Validators.required,]),
            //'submarca': new FormControl(this.model.submarca, [Validators.required,]),
            'color': new FormControl(this.model.color, [Validators.required,]),
            'modelo': new FormControl(this.model.modelo, [Validators.required,]),
            //'estado_origen_placas': new FormControl(this.model.estado_origen_placas, [Validators.required,]),
            'placas': new FormControl(this.model.placas, [Validators.required,]),
            //'placas_adicionales': new FormControl(this.model.placas_adicionales, [Validators.required,]),
            //'rfv': new FormControl(this.model.rfv, [Validators.required,]),
            'serie': new FormControl(this.model.serie, [Validators.required,]),
            'motor': new FormControl(this.model.motor, [Validators.required,]),
            //'aseguradora': new FormControl(this.model.aseguradora, [Validators.required,]),
            //'factura': new FormControl(this.model.factura, [Validators.required,]),
            //'datos_tomados_de': new FormControl(this.model.datos_tomados_de, [Validators.required,]),
            //'n_poliza': new FormControl(this.model.n_poliza, [Validators.required,]),
            //'valor_estimado': new FormControl(this.model.valor_estimado, [Validators.required,]),
            'tipoUso': new FormControl(this.model.tipoUso, []),
            //'procedencia': new FormControl(this.model.procedencia, [Validators.required,]),
            //'pedimento_de_importacion': new FormControl(this.model.pedimento_de_importacion, [Validators.required,]),
            //'lleva_carga': new FormControl(this.model.lleva_carga, [Validators.required,]),
            //'alterado': new FormControl(this.model.alterado, [Validators.required,]),
            //'señas_particulares': new FormControl(this.model.señas_particulares, [Validators.required,])
        });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
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