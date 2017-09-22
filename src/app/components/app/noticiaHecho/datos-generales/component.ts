import { Component, OnInit, Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Caso } from '@models/caso';
import { GlobalComponent } from '@components-app/global.component';
import { LoaderComponent } from '@partials/loader/component';
import { MdDialog } from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent implements OnInit{
    public form    : FormGroup;
    public id      : number = null;
    private db     : CIndexedDB;
    private router : Router;
    private activeRoute : ActivatedRoute;
    @Input()
    public model   : Caso;

    public constructor(
        private _fbuilder: FormBuilder,
        _db: CIndexedDB,
        _router: Router,
        _activeRoute: ActivatedRoute
    ) { 
        this.db = _db;
        this.router = _router;
        this.activeRoute = _activeRoute;
    }

    ngOnInit(){
        if(this.model == null){
            this.model = new Caso();
            this.form  = new FormGroup({
                'titulo'   : new FormControl(this.model.titulo,   [Validators.required]),
                'sintesis' : new FormControl(this.model.sintesis, [Validators.required]),
                'delito'   : new FormControl(this.model.delito,   [Validators.required])
            });
        }else{
            var json = JSON.stringify(this.modelo);
            this.form  = new FormGroup({
                'titulo'   : new FormControl(this.model.titulo),
                'sintesis' : new FormControl(this.model.sintesis),
                'delito'   : new FormControl(this.model.delito)
            });
            console.log('model', this.model.titulo);
            this.form.setValue({
                'titulo' : this.model.titulo,
                'sintesis' : this.model.sintesis,
                'delito' : this.model.delito
            },{ emitEvent: true});
            console.log('-> Form', this.form);
            console.log('-> Form', this.form.value);
            console.log('-> Form', this.form);
        }

        this.activeRoute.params.subscribe(params => {
            if(params['id'])
                this.id = +params['id'];
        });
    }

    public save(_valid : any, _model : any):void{
        console.log('-> Caso@save()', _model);
        _model.created = new Date();
        this.db.add('casos', _model).then(object => {
            this.router.navigate(['/caso/'+object['id']+'/noticia-hecho' ]);
        });
    }

    public validForm(): string{
        return !this.form.valid ? 'No se han llenado los campos requeridos' : ''
    }

}
