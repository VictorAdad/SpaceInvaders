import { Component } from '@angular/core';
import { MOption } from '@partials/form/select2/select2.component';
import { DataSource} from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Relacion} from '@models/relacion';
import { EfectoViolenciaGenero} from '@models/efectoViolenciaGenero';
import { TrataPersonas} from '@models/trataPersonas';
import { HostigamientoAcoso} from '@models/hostigamientoAcoso';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { NoticiaHechoGlobal } from '../../global';
import { NoticiaHechoService } from '@services/noticia-hecho.service';
import { CIndexedDB } from '@services/indexedDB';


@Component({
    selector: 'relacion-create',
    templateUrl: './create.component.html',
    styles:[``]
})

export class RelacionCreateComponent extends NoticiaHechoGlobal{
    public relacionForm  : FormGroup;
    public efectoViolenciaForm  : FormGroup;
    public trataPersonasForm  : FormGroup;
    public hostigamientForm  : FormGroup;
    public generalForm:FormGroup;

    public model : Relacion;
    public efectoViolenciaGenero:EfectoViolenciaGenero;
    public trataPersonas:TrataPersonas;
    public hostigamiento:HostigamientoAcoso;

    public casoId: number = null;
    public id: number = null;

    public breadcrumb = [];


    tiposRelacion:MOption[] = [
        { value:'Defensor', label:'Defensor del imputado' },
        { value:'Imputado', label:'Imputado-Víctima-Delito' },
        { value:'Asesor', label:'Asesor jurídico de la víctima' },
        { value:'Representante', label:'Representante de la víctima' }
    ];

    options:MOption[]=[
    {value:"1", label:"Opcion 1"},
    {value:"2", label:"Opcion 2"},
    {value:"3", label:"Opcion 3"}
    ];

    isDefensorImputado: boolean = false;
    isImputadoVictimaDelito: boolean = false;
    isAsesorJuridicoVictima: boolean = false;
    isRepresentanteVictima: boolean = false;
    isTutorVictima: boolean = false;
    isViolenciaGenero: boolean = false;
    isAChange: boolean = false;
    

    efectoData: EfectoViolenciaGenero[] = [
    {id:1,efecto: 'Efecto 1', detalle: 'Detalle 1'},
    {id:1,efecto: 'Efecto 2', detalle: 'Detalle 2'},
    ]
    efectoDisplayedColumns = ['efecto', 'detalle'];
    efectoDataSource = new ExampleDataSource(this.efectoData);

    trataData: TrataPersonas[] = []
    trataDisplayedColumns = ['País de origen', 'Estado de origen','Municipio de origen','País destino','Estado destino','Municipio destino', 'Tipo de trata','Transportación'];
    trataDataSource = new ExampleDataSource(this.trataData);
    
    hostigamientoData: HostigamientoAcoso[] = []
    hostigamientoDisplayedColumns = ['Modalidad', 'Ámbito','Conducta','Detalle','Testigo'];
    hostigamientoDataSource = new ExampleDataSource(this.hostigamientoData);



    victimasOptions:MOption[]=[];
    defensoresOptions:MOption[]=[];
    asesorOptions:MOption[]=[];
    imputadoOptions:MOption[]=[];
    representanteOptions:MOption[]=[];


    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        private optionsNoticia: NoticiaHechoService
        ) {
        super();
    }

    ngOnInit(){
      this.model = new Relacion();
      this.efectoViolenciaGenero= new EfectoViolenciaGenero();
      this.trataPersonas= new TrataPersonas();
      this.hostigamiento= new HostigamientoAcoso;

      this.relacionForm  = new FormGroup({
          'tipo'                      : new FormControl(this.model.tipo, [Validators.required,]),
          'personaCaso'                : new FormGroup({
            'id'                       : new FormControl(this.model.imputado,[Validators.required,]),
            }),
          'personaCasoRelacionada'     : new FormGroup({
            'id'                       : new FormControl(this.model.victima,[Validators.required,]),
            }),
          'detalleDelito'              : new FormGroup({
            'modalidadDelito'              : new FormGroup({               
              'id': new FormControl(this.model.modalidad,[Validators.required,]),
            }),
            'formaComision'            : new FormGroup({               
              'id': new FormControl(this.model.modalidad,[Validators.required,]),
            }),
            'delitoCaso': new FormGroup({               
              'id': new FormControl(this.model.modalidad,[Validators.required,]),
            }),
            'concursoDelito'           : new FormGroup({               
              'id': new FormControl(this.model.modalidad,[Validators.required,]),
            }),
            'clasificacionDelitoOrden' : new FormGroup({               
              'id': new FormControl(this.model.modalidad,[Validators.required,]),
            }),
            'caso': new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'elementosComision'        : new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'clasificacionDelito'      : new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'formaAccion'              : new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'desaparicionConsumada': new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'gradoParticipacion': new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'formaConducta': new FormGroup({
                    'id': new FormControl("",[]),
                }),
            'violenciaGenero'          : new FormControl(this.model.violenciaGenero),
            'flagrancia'               : new FormControl(this.model.flagrancia),  
          }),
          // 'lugar'                    : new FormControl(this.model.lugar,[Validators.required,]),
          
          
          // 'consultorDelito'          : new FormControl(this.model.consultorDelito),
          
          
          
          // 'relacionAcusadoOfendido'  : new FormControl(this.model.relacionAcusadoOfendido),
          
          // 'tipoDesaparicion'         : new FormControl(this.model.tipoDesaparicion),
               
          
          // 'tipoViolenciaGenero'      : new FormControl(this.model.tipoViolenciaGenero),
          // 'victimaDelincuenciaOrganizada': new FormControl(this.model.victimaDelincuenciaOrganizada),
          // 'victimaViolenciaGenero'    : new FormControl(this.model.victimaViolenciaGenero),
          // 'victimaTrata'              :new FormControl(this.model.victimaTrata),
          // 'victimaAcoso'              :new FormControl(this.model.victimaAcoso),
          // 'ordenProteccion'           :new FormControl(this.model.ordenProteccion),

        });
      this.efectoViolenciaForm  = new FormGroup({
          'efecto': new FormControl(this.efectoViolenciaGenero.efecto),
          'detalle': new FormControl(this.efectoViolenciaGenero.detalle),
          
        });
      this.trataPersonasForm  = new FormGroup({
          'paisOrigen': new FormControl(this.trataPersonas.paisOrigen),
          'estadoOrigen': new FormControl(this.trataPersonas.estadoOrigen),
          'municipioOrigen': new FormControl(this.trataPersonas.municipioOrigen),
          'paisDestino': new FormControl(this.trataPersonas.paisDestino),
          'estadoDestino': new FormControl(this.trataPersonas.estadoDestino),
          'municipioDestino': new FormControl(this.trataPersonas.municipioDestino),

        });

      this.hostigamientForm  = new FormGroup({
          'modalidad': new FormControl(this.hostigamiento.modalidad),
          'ambito': new FormControl(this.hostigamiento.modalidad),
          'conducta': new FormControl(this.hostigamiento.conducta),
          'detalleConducta': new FormControl(this.hostigamiento.detalleConducta),
          'testigo': new FormControl(this.hostigamiento.testigo),
          
        });

      this.generalForm = this._fbuilder.group({
        itemRows: this._fbuilder.array([this.relacionForm,this.efectoViolenciaForm,this.trataPersonasForm,this.hostigamientForm])
      }); 

      this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = params['casoId'];
                this.optionsNoticia.setId(this.casoId);
                this.optionsNoticia.getData();
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"})

            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                  this.http.get('/v1/base/relaciones/'+this.id).subscribe(response =>{
                      this.fillForm(response);
                  });
                }else{
                  this.db.get("casos",this.casoId).then(t=>{
                    let relaciones=t["relacion"] as any[];
                    for (var i = 0; i < relaciones.length; ++i) {
                        if ((relaciones[i])["id"]==this.id){
                            this.fillForm(relaciones[i]);
                            break;
                        }
                    }
                   });
                }
            }
        });


      if(this.onLine.onLine){
        this.http.get('/v1/base/casos/'+this.casoId+'/personas-casos').subscribe((response) => {
            response.data.forEach(object => {
                //victima u ofendido
                let persona=object["persona"];
                let tipoInterviniente=object["tipoInterviniente"];
                if (tipoInterviniente["id"] == 8 ||  tipoInterviniente["id"] == 9){
                  this.victimasOptions.push({value: object.id,label:persona["nombre"]+" "+persona["paterno"]+" "+persona["materno"]});
                }
                //defensor publico o defensor privado
                if (tipoInterviniente["id"] == 2 ||  tipoInterviniente["id"] == 10){
                  this.defensoresOptions.push({value: object.id,label:persona["nombre"]+" "+persona["paterno"]+" "+persona["materno"]});
                }
                //Asesor juridico publico o Asesor juridico privado
                if (tipoInterviniente["id"] == 4 ||  tipoInterviniente["id"] == 7){
                  this.asesorOptions.push({value: object.id,label:persona["nombre"]+" "+persona["paterno"]+" "+persona["materno"]});
                }
                //defensor publico o defensor privado
                if (tipoInterviniente["id"] == 5){
                  this.imputadoOptions.push({value: object.id,label:persona["nombre"]+" "+persona["paterno"]+" "+persona["materno"]});
                }
            });

            console.log(this);
            
        });
      }
    }

    save(_valid : any, _model : any):void{
        console.log("Datos a guardar => ",_model);
        if(this.onLine.onLine){
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            this.http.post('/v1/base/relaciones', this.model).subscribe(
                (response) => this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]),
                (error) => console.error('Error', error)
            );
        }else{
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            let temId = Date.now();
            let dato={
                url:'/v1/base/relaciones',
                body:this.model,
                options:[],
                tipo:"post",
                pendiente:true,
                temId: temId
            }
            this.db.add("sincronizar",dato).then(p=>{
              this.db.get("casos",this.casoId).then(caso=>{
                    if (caso){
                        if(!caso["relacion"]){
                            caso["relacion"]=[];
                        }
                        this.model["id"]=temId;
                        caso["relacion"].push(this.model);
                        this.db.update("casos",caso).then(t=>{
                            this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                        });
                    }
                });
            }); 
        }
    }

    public edit(_valid : any, _model : any):void{
        console.log('-> Relacion@edit()', _model);
        if(this.onLine.onLine){
            this.http.put('/v1/base/relaciones/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro acutualizado', response);
            });
        }else{
            let dato={
                url:'/v1/base/relaciones/'+this.id,
                body:_model,
                options:[],
                tipo:"update",
                pendiente:true,
                dependeDe:[this.casoId, this.id]
            }
            this.db.add("sincronizar",dato).then(p=>{
                this.db.get("casos",this.casoId).then(t=>{
                    let relaciones=t["relacion"] as any[];
                    for (var i = 0; i < relaciones.length; ++i) {
                        if ((relaciones[i])["id"]==this.id){
                            relaciones[i]=_model;
                            break;
                        }
                    }
                    console.log("caso",t);
                });
            }); 
        }
    }

    public fillForm(_data){
        this.relacionForm.patchValue(_data);
    }

    activaCamposImputado(opt){
      if (opt){
        // this.relacionForm.controls.modalidad.enable();
        // this.relacionForm.controls.delito.enable();
        // this.relacionForm.controls.formaComision.enable();
        // this.relacionForm.controls.lugar.enable();
        // this.relacionForm.controls.elementosComision.enable();
        // this.relacionForm.controls.formaAccion.enable();
        this.relacionForm.controls.detalleDelito.enable();
      }else{
        // this.relacionForm.controls.modalidad.disable();
        // this.relacionForm.controls.delito.disable();
        // this.relacionForm.controls.formaComision.disable();
        // this.relacionForm.controls.lugar.disable();
        // this.relacionForm.controls.elementosComision.disable();
        // this.relacionForm.controls.formaAccion.disable();
        this.relacionForm.controls.detalleDelito.disable();
      }
    }

    changeTipoRelacion(option){
      console.log('--> '+option);
      this.resetValues();
      switch(option){
        case 'Defensor':{
          this.isDefensorImputado = true;
          this.activaCamposImputado(false);
          break;
        }
        case 'Imputado':{
          this.isImputadoVictimaDelito = true;
          this.activaCamposImputado(true);
          break;
        }
        case 'Asesor':{
          this.isAsesorJuridicoVictima = true;
          this.activaCamposImputado(false);
          break;
        }
        case 'Representante':{
          this.isRepresentanteVictima = true;
          this.activaCamposImputado(false);
          break;
        }
        case 'Tutor':{
          this.isTutorVictima = true;
          this.activaCamposImputado(false);
          break;
        }
      }
    }

    resetValues(){
      this.isDefensorImputado = false;
      this.isImputadoVictimaDelito = false;
      this.isAsesorJuridicoVictima = false;
      this.isRepresentanteVictima = false;
      this.isTutorVictima = false;
    }

    changeViolenciaGenero(status){
      if(status){
        this.isViolenciaGenero = true;
      }else{
        this.isViolenciaGenero = false;
      }
    }


}


  

  
  /**
   * Data source to provide what data should be rendered in the table. The observable provided
   * in connect should emit exactly the data that should be rendered by the table. If the data is
   * altered, the observable should emit that new set of data on the stream. In our case here,
   * we return a stream that contains only one set of data that doesn't change.
   */
  export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    constructor(private data:any[]){super()}

    connect(): Observable<any[]> {
      return Observable.of(this.data);
    }
  
    disconnect() {}
  }