import { Component, OnInit, AfterViewInit, Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { Http, Response } from '@angular/http';
import { Caso } from '@models/caso';
import { Delito } from '@models/catalogo/delito';
import { GlobalComponent } from '@components-app/global.component';
import { CIndexedDB } from '@services/indexedDB';
import { FormCreateDelitoCasoComponent } from "./formcreate.component";
import { AuthenticationService } from '@services/auth/authentication.service';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { NoticiaHechoGlobal } from '../global';
import { _config} from '@app/app.config';
import { CasoService } from '@services/caso/caso.service'
import { Observable }                  from 'rxjs/Observable';

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent extends NoticiaHechoGlobal implements OnInit{
    public form    : FormGroup;
    public id      : number = null;
    private db     : CIndexedDB;
    private router : Router;
    private dialog : MatDialog;
    private activeRoute : ActivatedRoute;
    private onLine : OnLineService;
    @Input()
    public model   : Caso =  new Caso();
    public delitos : Delito[] = [];
    public delito: Delito;

    public constructor(
        _dialog: MatDialog,
        _db: CIndexedDB,
        _router: Router,
        _activeRoute: ActivatedRoute,
        _onLine: OnLineService,
        private http: HttpService,
        private auth: AuthenticationService,
        private casoService: CasoService
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
            'descripcion' : new FormControl('', [Validators.required]),
            'delito'   : new FormControl('', [Validators.required]),
            'titulares': new FormArray([
                new FormGroup({
                    'fechaAsignacion': new FormControl(new Date()),
                    'userNamePropietario': new FormControl(this.auth.user.username),
                    'userNameAsignado': new FormControl(this.auth.user.username),
                    'vigente': new FormControl(true),
                })
            ]),
        });
        this.activeRoute.parent.params.subscribe(params => {
            if(this.hasId){
                this.id = +params['id'];
                this.casoService.find(this.id);
                console.log(this.casoService);
                if (!isNaN(this.id)){
                    if(this.onLine.onLine){
                        this.http.get('/v1/base/casos/'+this.id).subscribe((response) => {
                            this.form.patchValue(response);
                            if (response.delitoPrincipal != null) {
                                this.form.patchValue({
                                    'delito' : response.delitoPrincipal.nombre
                                });
                            }
                            
                        });
                    }else{
                        //this.db.get("casos", this.id).then(object => {
                            let timer = Observable.timer(1);
                            timer.subscribe(t => {
                                if (this.casoService.caso){
                                    this.model = this.casoService.caso as Caso;
                                    console.log(this.model);
                                    this.form.patchValue(this.model); 
                                    if (this.model["delitoPrincipal"] != null) {
                                        console.log("DELITO principal");
                                        this.form.patchValue({
                                            'delito' : this.model["delitoPrincipal"].nombre
                                        });
                                    }   
                                }
                            });
                           
                        //});
                    }
                }
                
            }
        });
        this.validateForm(this.form);  
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

    public save(_valid : boolean, _model : any):Promise<any>{
        Object.assign(_model, this.model);
        console.log('Model', _model);
        // _model["agencia"]={id:1};
        _model["nic"]=this.generateNIC(_model);
        // _model["estatus"]={id:1};

        _model.created = null;
        _model.delitoCaso.delito.id =  this.delito.id;
        return new Promise((resolve,reject)=>{
            if(this.onLine.onLine){
                
                this.http.post('/v1/base/casos', _model).subscribe((response) => {
                    resolve("Se creó con éxito el Caso");
                    this.router.navigate(['/caso/'+response.id+'/noticia-hecho/datos-generales' ]);
                },e=>{
                    reject(e);
                });
            }else{
                delete _model["created"];
                // let temId=Date.now();
                // console.log('temID', temId);
                // console.log("MODEL",_model);
                // let dato={
                //     url:'/v1/base/casos',
                //     body:_model,
                //     options:[],
                //     tipo:"post",
                //     pendiente:true,
                //     newId:0,
                //     temId:temId
                // }
                // this.db.add("sincronizar",dato).then(p=>{
                //     console.log('temID', temId);
                //     _model["id"] = temId;
                //     this.db.add('casos', _model).then(object => {
                //         console.log('object', object);
                //         resolve("Se creó el caso de manera local");
                //         this.router.navigate(['/caso/'+object['id']+'/noticia-hecho/datos-generales' ]);
                //     });
                // });
                
                let temId=Date.now();
                console.log('temID', temId);
                console.log("MODEL",_model);
                this.db.add('casos', _model).then(object => {
                    console.log('object', object);
                    var id=object["id"];
                    _model["id"]="";
                    let dato={
                        url:'/v1/base/casos',
                        body:_model,
                        options:[],
                        tipo:"post",
                        pendiente:true,
                        newId:0,
                        temId:id
                    }
                    this.db.add("sincronizar",dato).then(p=>{
                        console.log('p', p);
                        // _model["id"] = temId;
                        resolve("Se creó el caso de manera local");
                        this.router.navigate(['/caso/'+id+'/noticia-hecho/datos-generales' ]);
                    });

                });
            }
        });
    }

    public edit(_valid : boolean, _model : any):Promise<any>{
        return new Promise((resolve,reject)=>{
            console.log('-> Caso@edit()', _model);
            if(this.onLine.onLine){
                this.http.put('/v1/base/casos/'+this.id, _model).subscribe((response) => {
                    resolve("Caso actualizado");
                },e=>{
                    reject(e);
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
                    resolve("Se actualizó el caso de manera local");
                    console.log('-> Registro acutualizado');
                }); 
            }
        });
    }

    public hasId(): boolean{
        let hasId = false
        this.activeRoute.parent.params.subscribe(params => {
            if(params['id'])
                hasId = true;
        });

        return hasId;
    }

    public generateNIC(_caso: any): string{
        console.log('caso ', _caso.delitoCaso.delito.id);
        let nic: string = '';
        let user = this.auth.user;
        nic=`${user.fiscalia}/${user.agencia}/${user.turno}/${user.autoridad}/${this.pad(this.delito.id, 3)}/00126/${(new Date()).getFullYear().toString().substr(-2)}/${this.pad((new Date()).getMonth(), 2)}`

        return nic;
    }

    private pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

}
