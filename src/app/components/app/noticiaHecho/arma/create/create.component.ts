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
            'clase'           : new FormControl('', [Validators.required,]),
            'tipo'            : new FormControl(''),
            'subtipo'         : new FormControl(''),
            'calibre'         : new FormControl(''),
            'mecanismo' : new FormControl(''),
            'serie'           : new FormControl(''),
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

        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"})
            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/armas/'+this.id).subscribe(response =>{
                        this.model = response as Arma;
                        this.isArmaFuego=this.model.claseArma.claseArma==="fuego";
                        console.log(this.model);                        
                        this.fillForm(response);
                    });
                }else{
                    this.db.get("casos",this.casoId).then(t=>{
                        let armas=t["arma"] as any[];
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
    }

    public save(valid : any, _model : any):void{
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
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error);
                }
            );
        }else{
            _model.caso.id             = this.casoId;
            if(this.armaServ.claseArma.finded[0])
                _model.claseArma.id        = this.armaServ.claseArma.finded[0].id
            if(this.isArmaFuego){
                if(this.armaServ.calibreMecanismo.finded[0])
                    _model.calibreMecanismo.id = this.armaServ.calibreMecanismo.finded[0].id
            }
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
                        this.model["id"]=temId;
                        caso["arma"].push(_model);
                        this.db.update("casos",caso).then(t=>{
                            this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                        });
                    }
                });
            }); 
        }
    }

    public edit(_valid : any, _model : any):void{
        console.log('Arma Serv', this.armaServ);
        _model.caso.id             = this.casoId;
        if(this.armaServ.claseArma.finded.length>0 && this.armaServ.calibreMecanismo.finded.length>0){
            _model.claseArma.id        = this.armaServ.claseArma.finded[0].id
            if(this.isArmaFuego){
                _model.calibreMecanismo.id = this.armaServ.calibreMecanismo.finded[0].id
            }
    
            console.log('-> Arma@edit()', _model);
            if(this.onLine.onLine){            
                this.http.put('/v1/base/armas/'+this.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
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
                        console.log("caso",t);
                    });
                    //this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                }); 
            }
            
        }else{
            console.log("No se ha encontrado combinación clase de arma, tipo, subtipo o calibre mecanismo")
        }

    }
    public fillForm(_data){
        this.form.patchValue(_data)
        let timer = Observable.timer(1);    
       timer.subscribe(t => {
            this.form.patchValue({
            'tipo': _data.claseArma.tipo,
            'subtipo': _data.claseArma.subtipo,
            'calibre': _data.calibreMecanismo.calibre,
            'mecanismo': _data.calibreMecanismo.mecanismo,
            'serie': _data.serie,
            'matricula': _data.matricula,
            'claseArma' : _data.claseArma.claseArma,
            'calibreMecanismo' : _data.calibreMecanismo
            })
            
        });

    }



    public claseChange(option){
        
        if(option == _config.optionValue.armaFuego){
           this.isArmaFuego=true;
        }
        else{
           this.isArmaFuego=false;
        }
        if(option=="Arma blanca"){
            console.log(option);
           this.isArmaBlanca=true;
        }
        else{
           this.isArmaBlanca=false;
        }
        
        this.armaServ.claseArma.find(option, 'claseArma');
        console.log(this.armaServ.claseArma)
        
    }

    }