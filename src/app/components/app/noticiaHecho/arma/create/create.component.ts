import { ClaseArma } from './../../../../../models/arma';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/form/select2/select2.component'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Arma,CalibreMecanismo } from '@models/arma';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { NoticiaHechoGlobal } from '../../global';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ArmaService } from '@services/noticia-hecho/arma/arma.service';
import { Observable } from 'rxjs';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
import { AuthenticationService } from "@services/auth/authentication.service";
@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})
export class ArmaCreateComponent extends NoticiaHechoGlobal{

    public casoId: number = null;
    public id: number = null;
    public data: any = null;
    public breadcrumb = [];
    isArmaFuego  :boolean=false;
    isArmaBlanca :boolean=false;
    public form  : FormGroup;
    public model : Arma;
    public masDe3Dias:any;

    constructor(
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        public armaServ: ArmaService,
        private casoService: CasoService,
        public auth:AuthenticationService
        ) {
        super();
        Logger.log(this.armaServ);
    }

    ngOnInit(){
        this.auth.masDe3DiasSinConexion().then(r=>{
            let x= r as boolean;
            this.masDe3Dias=r;
        });
        this.model=new Arma();
        this.form  = new FormGroup({
            'id': new FormControl(''),
            'clase'           : new FormControl('', [Validators.required,]),
            'tipo'            : new FormControl('', [Validators.required,]),
            'subtipo'         : new FormControl(''),
            'calibre'         : new FormControl(''),
            'mecanismo' : new FormControl(''),
            'serie'           : new FormControl(null),
            'notas'           : new FormControl(''),
            'matricula'       : new FormControl(''),
            'caso'            : new FormGroup({
                'id' : new FormControl(''),
            }),
            'claseArma' : new FormGroup({
                'id' : new FormControl(''),
            }),
            'calibreMecanismo' : new FormGroup({
                'id' : new FormControl(''),
            }),
          });

        this.form.controls.tipo.disable();

        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho/armas`,label:"Detalle noticia de hechos"})
                this.casoService.find(this.casoId);
            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/armas/'+this.id).subscribe(response =>{
                        this.model = response as Arma;
                        Logger.log("Arma->",this.model);
                        if (this.model.claseArma)
                            this.isArmaFuego=this.model.claseArma.claseArma===_config.optionValue.armaFuego;
                        this.fillForm(response);
                    });
                }else{
                    //this.db.get("casos",this.casoId).then(t=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var t=this.casoService.caso;
                        let armas=t["armas"] as any[];
                        for (var i = 0; i < armas.length; ++i) {
                            if ((armas[i])["id"]==this.id){
                                this.fillForm(armas[i]);
                                break;
                            }
                        }
                    });
                }
            }
        });
        this.validateForm(this.form);
    }

    ngOnDestroy(){
        this.armaServ.claseArma.clean();
        this.armaServ.calibreMecanismo.clean();
    }

    public save(_valid:boolean, _model:any){
        return new Promise<any>((resolve, reject) => {
            if(this.onLine.onLine){
                _model.caso.id             = this.casoId;
                if(this.armaServ.claseArma.finded[0])
                    _model.claseArma.id        = this.armaServ.claseArma.finded[0].id
                if(this.isArmaFuego){
                    if(this.armaServ.calibreMecanismo.finded[0])
                        _model.calibreMecanismo.id = this.armaServ.calibreMecanismo.finded[0].id
                }

                this.http.post('/v1/base/armas', _model).subscribe(
                    (response) => {
                        this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/armas' ]);
                        resolve("Se agregó la arma con éxito");
                        this.casoService.actualizaCaso();
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }else{
                _model.caso.id             = this.casoId;
                if(this.armaServ.claseArma.finded[0]){
                    _model.claseArma.id        = this.armaServ.claseArma.finded[0].id;
                    _model.claseArma["claseArma"]=this.armaServ.claseArma.finded[0].claseArma;
                    _model.claseArma["subTipo"]=this.armaServ.claseArma.finded[0].subtipo;
                    _model.claseArma["tipo"]=this.armaServ.claseArma.finded[0].tipo;
                }
                if(this.isArmaFuego){
                    if(this.armaServ.calibreMecanismo.finded[0]){
                        _model.calibreMecanismo.id = this.armaServ.calibreMecanismo.finded[0].id
                        _model.calibreMecanismo["calibre"]=this.armaServ.calibreMecanismo.finded[0].calibre;
                        _model.calibreMecanismo["mecanismo"]=this.armaServ.calibreMecanismo.finded[0].mecanismo;
                    }
                }
                Logger.log("MODEL",_model);
                let temId=Date.now();
                let dato={
                    url:'/v1/base/armas',
                    body:_model,
                    options:[],
                    tipo:"post",
                    pendiente:true,
                    dependeDe:[this.casoId],
                    temId: temId,
                    username: this.auth.user.username
                }
                this.db.add("sincronizar",dato).then(p=>{
                    //this.db.get("casos",this.casoId).then(caso=>{
                        var caso=this.casoService.caso;
                        if (caso){
                            if(!caso["armas"]){
                                caso["armas"]=[];
                            }
                            _model["id"]=temId;
                            caso["armas"].push(_model);
                            Logger.log("caso arma", caso["armas"]);
                            this.db.update("casos",caso).then(t=>{
                                Logger.log("caso arma", t["armas"]);
                                resolve("Se agregó la arma de manera local");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/armas' ]);
                            });
                        }
                    //});
                });
            }
        });
    }

    public edit(_valid : any, _model : any){
        return new Promise<any>((resolve, reject) => {
            Logger.log('Arma Serv', this.armaServ);
            _model.caso.id             = this.casoId;
            //if(this.armaServ.claseArma.finded.length>0 && this.armaServ.calibreMecanismo.finded.length>0){
                if(this.armaServ.claseArma.finded[0]){
                    _model.claseArma.id        = this.armaServ.claseArma.finded[0].id;
                    _model.claseArma["claseArma"]=this.armaServ.claseArma.finded[0].claseArma;
                    _model.claseArma["subTipo"]=this.armaServ.claseArma.finded[0].subtipo;
                    _model.claseArma["tipo"]=this.armaServ.claseArma.finded[0].tipo;
                }
                if(this.isArmaFuego){
                    if(this.armaServ.calibreMecanismo.finded[0]){
                        _model.calibreMecanismo.id = this.armaServ.calibreMecanismo.finded[0].id
                        _model.calibreMecanismo["calibre"]=this.armaServ.calibreMecanismo.finded[0].calibre;
                        _model.calibreMecanismo["mecanismo"]=this.armaServ.calibreMecanismo.finded[0].mecanismo;
                    }
                }

                Logger.log('-> Arma@edit()', _model);
                if(this.onLine.onLine){
                    this.http.put('/v1/base/armas/'+this.id, _model).subscribe((response) => {
                        Logger.log('-> Registro acutualizado', response);
                        resolve("Se actualizó la información del arma");
                        this.casoService.actualizaCaso();
                    },e=>{
                        reject(e);
                    });
                }else{
                    //this.model.caso["id"]= this.casoId;
                    let dato={
                        url:'/v1/base/armas/'+this.id,
                        body:_model,
                        options:[],
                        tipo:"update",
                        pendiente:true,
                        dependeDe:[this.casoId, this.id],
                        username: this.auth.user.username
                    }
                    this.db.add("sincronizar",dato).then(p=>{
                        //this.db.get("casos",this.casoId).then(t=>{
                            var t=this.casoService.caso;
                            let armas=t["armas"] as any[];
                            for (var i = 0; i < armas.length; ++i) {
                                if ((armas[i])["id"]==this.id){
                                    armas[i]=_model;
                                    break;
                                }
                            }
                            this.db.update("casos",t).then(e=>{
                                Logger.log("caso",t);
                                resolve("Se actualizó la información del arma de manera local");
                            });

                        //});
                        //this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                    });
                }

            // }else{
            //     reject("Se actualizó la información del arma de manera local");
            //     Logger.log("No se ha encontrado combinación clase de arma, tipo, subtipo o calibre mecanismo")
            // }
        });

    }

     eliminaNulos(x){
                if (typeof x == "object"){
                    for(let i in x){
                        if (x[i]==null || typeof x[i] =="undefined"){
                            delete x[i];
                        }
                        if (typeof x[i]=="object")
                            this.eliminaNulos(x[i]);
                    }
                }
            } 
    public fillForm(_data){
        this.eliminaNulos(_data);
        this.form.patchValue(_data)
        let timer = Observable.timer(1);
        if (_data.claseArma)
            this.form.patchValue({
                'clase': _data.claseArma.claseArma
            });
        timer.subscribe(t => {
            this.form.patchValue({
                'serie': _data.serie,
                'matricula': _data.matricula,
                })
            if (_data.claseArma)
                this.form.patchValue({
                'tipo': _data.claseArma.tipo,
                'subtipo': _data.claseArma.subtipo,
                'claseArma' : _data.claseArma.claseArma,
                })
            if (_data.calibreMecanismo)
                this.form.patchValue({
                'calibre': _data.calibreMecanismo.calibre,
                'mecanismo': _data.calibreMecanismo.mecanismo,
                'calibreMecanismo' : _data.calibreMecanismo
                })

        });

    }



    public claseChange(option){

        let timer = Observable.timer(1);

        if(option == _config.optionValue.armaFuego || option==_config.optionValue.armaBlanca){
           this.isArmaFuego  = (option == _config.optionValue.armaFuego) ;
           this.isArmaBlanca = (option==_config.optionValue.armaBlanca);
           timer.subscribe(t => {
               this.form.controls.tipo.enable();
           });
        }
        else{
           this.isArmaFuego  = false;
           this.isArmaBlanca = false;
           timer.subscribe(t => {
               this.form.controls.tipo.disable();
           });
        }

        Logger.log(this.armaServ.claseArma)
        this.armaServ.claseArma.find(option, 'claseArma');
        this.armaServ.claseArma.filterBy(option, 'claseArma', 'tipo');
        

    }

    public tipoChange(_event){
        this.armaServ.claseArma.find(_event, 'tipo');
        this.armaServ.claseArma.filterBy(_event, 'tipo', 'subtipo');
    }

}
