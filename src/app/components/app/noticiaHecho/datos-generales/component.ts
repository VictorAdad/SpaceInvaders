import { Component, OnInit, AfterViewInit, Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MD_DIALOG_DATA} from '@angular/material';
import { Http, Response } from '@angular/http';
import { Caso } from '@models/caso';
import { GlobalComponent } from '@components-app/global.component';
import { CIndexedDB } from '@services/indexedDB';
import { FormCreateDelitoCasoComponent } from "./formcreate.component";
import { OnLineService } from '@services/onLine.service';
import { Observable } from 'rxjs';
import { _config} from '@app/app.config';
import 'rxjs/add/operator/map'

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent implements OnInit{
    public form    : FormGroup;
    public id      : number = null;
    private db     : CIndexedDB;
    private router : Router;
    private dialog : MdDialog;
    private activeRoute : ActivatedRoute;
    private onLine : OnLineService;
    @Input()
    public model   : Caso;

    public constructor(
        _dialog: MdDialog,
        _db: CIndexedDB,
        _router: Router,
        _activeRoute: ActivatedRoute,
        _onLine: OnLineService,
        private http: Http
    ) { 
        this.db = _db;
        this.router = _router;
        this.activeRoute = _activeRoute;
        this.dialog = _dialog;
        this.onLine = _onLine;
    }

    ngOnInit(){
        this.form  = new FormGroup({
            'titulo'   : new FormControl('', [Validators.required]),
            'sintesis' : new FormControl('', [Validators.required]),
            'delito'   : new FormControl('', [Validators.required])
        });
        this.activeRoute.params.subscribe(params => {
            if(this.hasId){
                this.id = +params['id'];
                if (!isNaN(this.id)){
                    if(this.onLine.onLine){
                        this.find(this.id).subscribe((response) => {
                            this.form.patchValue(response);
                        });
                    }else{
                        this.db.get("casos", this.id).then(object => {
                            this.model = object as Caso;
                            this.form.patchValue(this.model);
                        });
                    }
                }
                
            }
        });    
    }

    public openDialog() {
        let dialog =  this.dialog.open(FormCreateDelitoCasoComponent, {
            height: 'auto',
            width: 'auto',
            data: {
              // lista: this.listaDelitos
            }
        });

        const sub = dialog.componentInstance.emitter.subscribe((_list) => {
            this.form.patchValue({'delito' : _list.data[0].descripcion});
        });
    }

    public save(_valid : any, _model : any):void{
        if(this.onLine.onLine){
            this.post(_model).subscribe((response) => {
                console.log('Caso guardado en la BD', response);
                this.router.navigate(['/caso/'+response['id']+'/noticia-hecho' ]);
            });
        }else{
            _model.personas=[];
            _model.delitos=[];
            _model.lugares=[];
            _model.vehiculos=[];
            _model.armas=[];
            _model.documentos=[];
            _model.titulares=[];
            _model.relaciones=[];
            console.log('-> Caso@save()', _model);
            _model.created = new Date();
            this.db.add('casos', _model).then(object => {
                this.router.navigate(['/caso/'+object['id']+'/noticia-hecho' ]);
            });
        }
    }

    public edit(_valid : any, _model : any):void{
        console.log('-> Caso@edit()', _model);
        _model.created = new Date();
        this.db.add('casos', _model).then(object => {
            
        });
    }

    public validForm(): string{
        return !this.form.valid ? 'No se han llenado los campos requeridos' : ''
    }

    public hasId(): boolean{
        let hasId = false
        this.activeRoute.params.subscribe(params => {
            if(params['id'])
                hasId = true;
        });

        return hasId;
    }

    private post(_model: Caso): Observable<Caso>{
        return this.http.post(_config.api.host+'/v1/base/casos', _model)
            .map((response: Response) => response.json());
    }

    private find(_id: number): Observable<Caso>{
        return this.http.get(_config.api.host+'/v1/base/casos/'+_id)
            .map((response: Response) => response.json());
    }

}
