import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/form/select2/select2.component'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Arma } from '@models/arma';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { NoticiaHechoGlobal } from '../../global';
import { _config} from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ArmaService } from '@services/noticia-hecho/arma/arma.service';

@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})
export class ArmaCreateComponent extends NoticiaHechoGlobal{

    public casoId: number = null;
    public id: number = null;

    clasesArmas:MOption[]=[
        {value:"Arma blanca", label:"Arma blanca"},
        {value:"Arma de fuego", label:"Arma de fuego"},
        {value:"Macana", label:"Macana"},
        {value:"Otra", label:"Otra"}
    ];
    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
    ];
    isArmaFuego  :boolean=false;
    isArmaBlanca :boolean=false;
    public form  : FormGroup;
    public model : Arma;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        private armaServ: ArmaService
        ) {
        super();
    }

    ngOnInit(){
        this.model = new Arma();
        this.form  = new FormGroup({
            'clase'           : new FormControl('', [Validators.required,]),
            'tipo'            : new FormControl(''),
            'subtipo'         : new FormControl(''),
            'calibre'         : new FormControl(''),
            'mecanismoAccion' : new FormControl(''),
            'serie'           : new FormControl(this.model.serie),
            'notas'           : new FormControl(this.model.notas),
            'matricula'       : new FormControl(this.model.matricula),
          });

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/armas/'+this.id).subscribe(response =>{
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
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            
            this.http.post('/v1/base/armas', this.model).subscribe(
                (response) => {
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error);
                }
            );
        }else{
            Object.assign(this.model, _model);
            this.model.caso["id"]= this.casoId;
            // this.model.caso.created = null;
            let temId=Date.now();
            let dato={
                url:'/v1/base/armas',
                body:this.model,
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
                        caso["arma"].push(this.model);
                        this.db.update("casos",caso).then(t=>{
                            this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                        });
                    }
                });
            }); 
        }
    }

    public edit(_valid : any, _model : any):void{
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
    }

    public fillForm(_data){
        this.form.patchValue(_data);
    }



    claseChange(option){
        // this.model.clase=option;

        if(option=="Arma de fuego"){
        	console.log(option);
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
    }

    }