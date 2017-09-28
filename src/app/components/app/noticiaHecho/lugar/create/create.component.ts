import { Component,OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Lugar } from '@models/lugar';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { NoticiaHechoGlobal } from '../../global';
import * as moment from 'moment'

@Component({
    selector: 'lugar-create',
    templateUrl: './create.component.html'
})

export class LugarCreateComponent extends NoticiaHechoGlobal implements OnInit{
    public form: FormGroup;
    public model: Lugar;

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
        this.model = new Lugar();
        this.form = new FormGroup({
            'tipo': new FormControl(this.model.tipo, [Validators.required,]),
            'tipoZona': new FormControl(this.model.tipo_zona, [Validators.required,]),
            'calle': new FormControl(this.model.calle, [Validators.required,]),
            'referencias': new FormControl(this.model.referencias, [Validators.required,]),
            'pais': new FormControl(this.model.pais, [Validators.required,]),
            'estado': new FormControl(this.model.estado, [Validators.required,]),
            'municipio': new FormControl(this.model.municipio_delegacion, [Validators.required,]),
            'colonia': new FormControl(this.model.colonia_asentamiento, [Validators.required,]),
            'fecha': new FormControl(this.model.fecha, [Validators.required,]),
            'hora': new FormControl(this.model.hora, [Validators.required,]),
            'cp': new FormControl(this.model.notas, []),
            'dia': new FormControl(this.model.notas, []),
            'descripcion': new FormControl(this.model.notas, []),
            'notas': new FormControl(this.model.notas, []),
            'numExterior': new FormControl(this.model.notas, []),
            'numInterior': new FormControl(this.model.notas, []),
            'refeGeograficas': new FormControl(this.model.notas, []),
        });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
                this.http.get('/v1/base/lugares/'+this.id).subscribe(response =>{
                    this.fillForm(response);
                });
            }
        });
    }

    public save(_valid : any, _model : any):void{
        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        this.model.caso.created = null;
        this.model.fecha = moment(this.model.fecha).format('YYYY-MM-DD');
        if(this.onLine.onLine){
            this.http.post('/v1/base/lugares', this.model).subscribe(
                (response) => {
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error);
                }
            );
        }else{
            let dato={
                url:_config.api.host+'/v1/base/lugares',
                body:this.model,
                options:[],
                tipo:"post",
                pendiente:true
            }
            this.db.add("sincronizar",dato).then(p=>{
                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
            }); 
        }
    }

    public edit(_valid : any, _model : any):void{
        console.log('-> Lugar@edit()', _model);
        Object.assign(this.model, _model);
        this.model.fecha = moment(this.model.fecha).format('YYYY-MM-DD');
        if(this.onLine.onLine){
            this.http.put('/v1/base/lugares/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro acutualizado', response);
            });
        }
    }

    public fillForm(_data){
        _data.fecha = new Date(_data.fecha);
        this.form.patchValue(_data);
    }

}