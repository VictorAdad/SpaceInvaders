import { Component,OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Lugar } from '@models/lugar';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component';

@Component({
    selector: 'lugar-create',
    templateUrl: './create.component.html'
})

export class LugarCreateComponent implements OnInit{
    public form: FormGroup;
    public model: Lugar;

    public casoId: number = null;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router
        ) { }

    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
        ];

    ngOnInit() {
        this.model = new Lugar();
        this.form = new FormGroup({
            'caso.id': new FormControl(),
            'tipo': new FormControl(this.model.tipo, [Validators.required,]),
            'tipoZona': new FormControl(this.model.tipo_zona, [Validators.required,]),
            'calle': new FormControl(this.model.calle, [Validators.required,]),
            'referencias': new FormControl(this.model.referencias, [Validators.required,]),
            'pais': new FormControl(this.model.pais, [Validators.required,]),
            'estado': new FormControl(this.model.estado, [Validators.required,]),
            'municipio': new FormControl(this.model.municipio_delegacion, [Validators.required,]),
            'colonia': new FormControl(this.model.colonia_asentamiento, [Validators.required,]),
            //'fecha': new FormControl(this.model.fecha, [Validators.required,]),
            'hora': new FormControl(this.model.hora, [Validators.required,])
        });

        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });
    }

    public save(_valid : any, _model : any):void{
        Object.assign(this.model, _model);
        this.model.caso.id = this.casoId;
        this.model.caso.created = null;
        if(this.onLine.onLine){
            this.http.post('/v1/base/lugares', this.model).subscribe(
                (response) => {
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error);
                }
            );
        }
    }
}