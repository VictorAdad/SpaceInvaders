import { Component, OnInit, AfterViewInit, Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MD_DIALOG_DATA} from '@angular/material';
import { Http, Response } from '@angular/http';
import { Caso } from '@models/caso';
import { Delito } from '@models/catalogo/delito';
import { GlobalComponent } from '@components-app/global.component';
import { CIndexedDB } from '@services/indexedDB';
import { FormCreateDelitoCasoComponent } from "./formcreate.component";
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { NoticiaHechoGlobal } from '../global';
import { _config} from '@app/app.config';

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent extends NoticiaHechoGlobal implements OnInit{
    public form    : FormGroup;
    public id      : number = null;
    private db     : CIndexedDB;
    private router : Router;
    private dialog : MdDialog;
    private activeRoute : ActivatedRoute;
    private onLine : OnLineService;
    @Input()
    public model   : Caso =  new Caso();
    public delitos : Delito[] = [];
    public delito: Delito;

    public constructor(
        _dialog: MdDialog,
        _db: CIndexedDB,
        _router: Router,
        _activeRoute: ActivatedRoute,
        _onLine: OnLineService,
        private http: HttpService
    ) { 
        super();
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
                        this.http.get('/v1/base/casos/'+this.id).subscribe((response) => {
                            this.form.patchValue(response);
                        });
                    }else{
                        this.db.get("casos", this.id).then(object => {
                            if (object){
                                this.model = object as Caso;
                                this.form.patchValue(this.model);    
                            }
                        });
                    }
                }
                
            }
        });    
    }

    public openDialog() {
        let dialog =  this.dialog.open(FormCreateDelitoCasoComponent, {
            height: 'auto',
            width: 'auto'
        });

        dialog.componentInstance.emitter.subscribe((_delito) => {
            this.delito = _delito;
            this.form.patchValue({'delito' : _delito.nombre});
        });
    }

    public save(_valid : boolean, _model : any):void{
        if(this.onLine.onLine){
            Object.assign(_model, this.model);
            console.log('Model', _model);
            _model.created = null;
            _model.delitoCaso.delito.id =  this.delito.id;
            this.http.post('/v1/base/casos', _model).subscribe((response) => {
                this.router.navigate(['/caso/'+response.id+'/noticia-hecho' ]);
            });
        }else{
            let dato={
                url:'/v1/base/casos',
                body:{
                    titulo:_model.titulo,
                    sintesis:_model.sintesis,
                    delito:_model.delito
                },
                options:[],
                tipo:"post",
                pendiente:true,
                newId:0
            }
            _model.created = new Date();
            this.db.add('casos', _model).then(object => {
                dato["temId"]=object["id"];
                this.db.add("sincronizar",dato).then(p=>{
                    this.router.navigate(['/caso/'+object['id']+'/noticia-hecho' ]);
                });
            });
            
            
        }
    }

    public edit(_valid : boolean, _model : any):void{
        console.log('-> Caso@edit()', _model);
        if(this.onLine.onLine){
            this.http.put('/v1/base/casos/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro actualizado', response);
            });
        }else{
            let dato={
                url:'/v1/base/casos/'+this.id,
                body:_model,
                options:[],
                tipo:"update",
                pendiente:true
            }
            this.db.add("sincronizar",dato).then(p=>{
                console.log('-> Registro acutualizado');
            }); 
        }
    }

    public hasId(): boolean{
        let hasId = false
        this.activeRoute.params.subscribe(params => {
            if(params['id'])
                hasId = true;
        });

        return hasId;
    }

}
