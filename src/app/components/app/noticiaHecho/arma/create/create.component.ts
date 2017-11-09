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

    constructor(
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        public armaServ: ArmaService
        ) {
        super();
        console.log(this.armaServ);
    }

    ngOnInit(){
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
            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/armas/'+this.id).subscribe(response =>{
                        this.model = response as Arma;
                        console.log("Arma->",this.model);
                        if (this.model.claseArma)
                            this.isArmaFuego=this.model.claseArma.claseArma===_config.optionValue.armaFuego;
                        this.fillForm(response);
                    });
                }else{
                    this.db.get("casos",this.casoId).then(t=>{
                        let armas=t["arma"] as any[];
                        for (var i = 0; i < armas.length; ++i) {
                            if ((armas[i])["id"]==this.id){
                                var arma=armas[i];
                                (arma["claseArma"])["claseArma"]=arma["clase"];
                                if (arma["subtipo"])
                                    (arma["claseArma"])["subtipo"]=arma["subtipo"];
                                if (arma["tipo"])
                                    (arma["claseArma"])["tipo"]=arma["tipo"];

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

    public save(_valid:boolean, _model:any){
        return new Promise<any>((resolve, reject) => {
            if(this.onLine.onLine){
                console.log('Arma Serv', this.armaServ);
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
                console.log("MODEL",_model);
                let temId=Date.now();
                let dato={
                    url:'/v1/base/armas',
                    body:_model,
                    options:[],
                    tipo:"post",
                    pendiente:true,
                    dependeDe:[this.casoId],
                    temId: temId
                }
                this.db.add("sincronizar",dato).then(p=>{
                    this.db.get("casos",this.casoId).then(caso=>{
                        if (caso){
                            if(!caso["arma"]){
                                caso["arma"]=[];
                            }
                            _model["id"]=temId;
                            caso["arma"].push(_model);
                            console.log("caso arma", caso["arma"]);
                            this.db.update("casos",caso).then(t=>{
                                console.log("caso arma", t["arma"]);
                                resolve("Se agregó la arma de manera local");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/armas' ]);
                            });
                        }
                    });
                });
            }
        });
    }

    public edit(_valid : any, _model : any){
        return new Promise<any>((resolve, reject) => {
            console.log('Arma Serv', this.armaServ);
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

                console.log('-> Arma@edit()', _model);
                if(this.onLine.onLine){
                    this.http.put('/v1/base/armas/'+this.id, _model).subscribe((response) => {
                        console.log('-> Registro acutualizado', response);
                        resolve("Se actualizó la información del arma");
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
                        dependeDe:[this.casoId, this.id]
                    }
                    this.db.add("sincronizar",dato).then(p=>{
                        this.db.get("casos",this.casoId).then(t=>{
                            let armas=t["arma"] as any[];
                            for (var i = 0; i < armas.length; ++i) {
                                if ((armas[i])["id"]==this.id){
                                    armas[i]=_model;
                                    break;
                                }
                            }
                            this.db.update("casos",t).then(e=>{
                                console.log("caso",t);
                                resolve("Se actualizó la información del arma de manera local");
                            });

                        });
                        //this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                    });
                }

            // }else{
            //     reject("Se actualizó la información del arma de manera local");
            //     console.log("No se ha encontrado combinación clase de arma, tipo, subtipo o calibre mecanismo")
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

        if(option == _config.optionValue.armaFuego){
           this.isArmaFuego=true;
           this.form.controls.tipo.enable();
        }
        else{
           this.isArmaFuego=false;
        }
        if(option==_config.optionValue.armaBlanca){
            console.log(option);
           this.isArmaBlanca=true;
           this.form.controls.tipo.enable();
        }
        else{
           this.isArmaBlanca=false;
        }

        this.armaServ.claseArma.find(option, 'claseArma');
        console.log(this.armaServ.claseArma)

    }

    }
