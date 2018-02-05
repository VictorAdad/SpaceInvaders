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
import { Logger } from "@services/logger.service";
import { Cadena } from "@services/utils/cadena";
import { SelectsService} from '@services/selects.service';

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent extends NoticiaHechoGlobal implements OnInit{
    public form    : FormGroup;
    public id      : number = null;
    public masDe3Dias:any;
    private db     : CIndexedDB;
    private router : Router;
    private dialog : MatDialog;
    private activeRoute : ActivatedRoute;
    public onLine : OnLineService;
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
        private casoService: CasoService,
        public options: SelectsService
    ) {
        super();
        this.db = _db;
        this.router = _router;
        this.activeRoute = _activeRoute;
        this.dialog = _dialog;
        this.onLine = _onLine;

    }

    ngOnInit(){
        this.options.getData();
        this.auth.masDe3DiasSinConexion().then(r=>{
            let x= r as boolean;
            this.masDe3Dias=r;
        });
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
            'distrito' : new FormControl('', []), 
        });
        this.activeRoute.parent.params.subscribe(params => {
            if(this.hasId){
                this.id = +params['id'];
                Logger.log(this.casoService);
                if (!isNaN(this.id)){
                    this.casoService.find(this.id);
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
                                    let model = this.casoService.caso;
                                    Logger.log(model);
                                    this.form.patchValue(model);
                                    if (model["delitoPrincipal"] != null) {
                                        Logger.log("DELITO principal");
                                        this.form.patchValue({
                                            'delito' : model["delitoPrincipal"].nombre
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

    public copiaJson(original){
        if (typeof original=="object"){
            var obj={};
            for(let item in original)
                obj[item]=this.copiaJson(original[item]);
            return obj;
        }else
            return original;
    }

    public save(_valid : boolean, _model : any):Promise<any>{
        Object.assign(_model, this.model);
        Logger.log('Model', _model);
        // _model["agencia"]={id:1};
        _model["nic"]=this.generateNIC(_model);
        // _model["estatus"]={id:1};
        _model['distrito'] = Cadena.quitaAcentos(this.auth.user.distrito);

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

                let temId=Date.now();
                Logger.log('temID', temId);
                Logger.log("MODEL",_model);
                this.db.add('casos', _model).then(object => {
                    Logger.log('object', object);
                    var id=object["id"];
                    _model["id"]="";
                    _model['estatusSincronizacion']='no sincronizado';
                    let dato={
                        url:'/v1/base/casos',
                        body:_model,
                        options:[],
                        tipo:"post",
                        pendiente:true,
                        newId:0,
                        temId:id,
                        otrosID:[{id:id},{delitoCaso:{id:id+1}}],
                        username: this.auth.user.username
                    }
                    this.db.add("sincronizar",dato).then(p=>{
                        Logger.log('p', p);
                        // _model["id"] = temId;
                        resolve("Se creó el caso de manera local");
                        var copiaModel = this.copiaJson(_model);
                        copiaModel["id"]=id;
                        copiaModel["delitoCaso"]=[{id:id+1, principal:true, delito:{id: copiaModel["delitoCaso"].delito.id,nombre:this.delito.nombre}  }];
                        copiaModel["titulares"]=[{a:0}];
                        copiaModel["titulares"].pop();
                        copiaModel["titulares"].push((_model["titulares"])["0"]);
                        copiaModel['username'] = this.auth.user.username
                        this.db.update('casos', copiaModel).then(p=>{
                            Logger.log("actualizacion",p);
                            this.casoService.caso=copiaModel;
                            this.casoService.id=copiaModel["id"];
                            this.casoService.actualizaCasoOffline(p);
                            this.router.navigate(['/caso/'+id+'/noticia-hecho/datos-generales' ]);
                            this.casoService.actualizaCasoOffline(p);
                        });
                    });

                });
            }
        });
    }

    public edit(_valid : boolean, _model : any):Promise<any>{
        _model['distrito'] = Cadena.quitaAcentos(this.auth.user.distrito);
        return new Promise((resolve,reject)=>{
            Logger.log('-> Caso@edit()', _model);
            if(this.onLine.onLine){
                this.http.put('/v1/base/casos/'+this.id, _model).subscribe((response) => {
                    resolve("Caso actualizado");
                    this.casoService.actualizaCaso();
                },e=>{
                    reject(e);
                });
            }else{
                let dato={
                    url:'/v1/base/casos/'+this.id,
                    body:_model,
                    options:[],
                    tipo: 'update',
                    pendiente:true,
                    username: this.auth.user.username
                }
                this.db.add('sincronizar', dato).then(p => {
                    var t = this.casoService.caso;
                    t['titulo'] = _model['titulo'];
                    t['descripcion'] = _model['descripcion'];
                    this.db.update('casos', t).then(e => {
                        Logger.log('caso', t);
                        resolve('Se actualizó el caso de manera local');
                        this.casoService.actualizaCasoOffline(t);
                        Logger.log('-> Registro acutualizado');
                    });
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
        let nic: string = '';
        let user = this.auth.user;
        if(this.onLine.onLine){
            nic = `${user.fiscalia}/${user.agencia}/${this.pad(parseInt(user.turno), 2)}/${user.autoridad}/${this.pad(this.delito.id, 3)}/NICID/${(new Date()).getFullYear().toString().substr(-2)}/${this.pad((new Date()).getMonth() + 1, 2)}`;
        } else {
            nic = `${user.fiscalia}/${user.agencia}/${this.pad(parseInt(user.turno), 2)}/${user.autoridad}/${this.pad(this.delito.id, 3)}/${this.createUUID()}/${(new Date()).getFullYear().toString().substr(-2)}/${this.pad((new Date()).getMonth() + 1, 2)}`;
        }
        return nic;
    }

    createUUID() {
        var s = ""+Date.now();
        return s.slice(-5);
    }

    private pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

}
