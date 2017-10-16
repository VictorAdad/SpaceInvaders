import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
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
import { SelectsService} from '@services/selects.service';
import { Form } from './form';
import { Options } from './options';
import { Colections } from './colections';


@Component({
    selector: 'relacion-create',
    templateUrl: './create.component.html',
})
export class RelacionCreateComponent extends NoticiaHechoGlobal{
    public formRelacion: Form = new Form();
    public colections: Colections = new Colections();

    public optionsRelacion: Options;
    public form  : FormGroup;
    public generalForm:FormGroup;

    public model : Relacion;
    public efectoViolenciaGenero:EfectoViolenciaGenero;
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

    efectoDisplayedColumns = ['efecto', 'detalle'];
    efectoDataSource = new ExampleDataSource([]);

    trataData: TrataPersonas[] = []
    trataDisplayedColumns = ['País de origen', 'Estado de origen','Municipio de origen','País destino','Estado destino','Municipio destino', 'Tipo de trata','Transportación'];
    trataDataSource = new ExampleDataSource(this.trataData);

    hostigamientoData= []
    hostigamientoDisplayedColumns = ['Modalidad', 'Ámbito','Conducta','Detalle','Testigo'];
    hostigamientoDataSource = new ExampleDataSource(this.hostigamientoData);



    victimasOptions:MOption[]=[];
    defensoresOptions:MOption[]=[];
    asesorOptions:MOption[]=[];
    imputadoOptions:MOption[]=[];
    testigoOptions:MOption[]=[];
    representanteOptions:MOption[]=[];


    arrEstadosOrigen=[];
    arrMunicipiosOrigen=[];
    arrEstadosDestino=[];
    arrMunicipiosDestino=[];
    trataPersonasArr=[];



    efectoDetalleArr=[];




    constructor(
        private _fbuilder        : FormBuilder,
        private route            : ActivatedRoute,
        private onLine           : OnLineService,
        private http             : HttpService,
        private router           : Router,
        private db               :CIndexedDB,
        private optionsNoticia   : NoticiaHechoService,
        private optionsService   : SelectsService,
        ) {
        super();
        this.optionsRelacion = new Options(http,db);
    }

    ngOnInit(){
        this.model = new Relacion();
        this.efectoViolenciaGenero= new EfectoViolenciaGenero();
        this.hostigamiento= new HostigamientoAcoso;
        // this.optionsService.getData();

        this.form  = this.formRelacion.form;

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
            this.http.get('/v1/base/personas-casos/casos/'+this.casoId+'/page').subscribe((response) => {
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
                    //testigo
                    if (tipoInterviniente["id"] == 6){
                      this.testigoOptions.push({value: object.id,label:persona["nombre"]+" "+persona["paterno"]+" "+persona["materno"]});
                    }
                });

            });
        }
        this.initForm();
    }

    addEfectoDetalle(_val: any){
        this.colections.add('efectoDetalle', 'subjectEfectoDetalle', _val);
        let form = this.form.get('efectoViolencia') as FormArray;
        form.push(
            this.formRelacion.efectoViolenciaForm(this.optionsRelacion.matrizEfectoDetalle.finded[0].id)
        );
    } 

    addTrataPersonas(_val: any){
        this.colections.add('trataPersonas', 'subjectTrataPersonas', _val);
        let form = this.form.get('trataPersona') as FormArray;
        form.push(this.formRelacion.trataPersonasForm); 
    } 

    addHostigamiento(_val: any){
        this.colections.add('hostigamiento', 'subjectHostigamiento', _val);
        let form = this.form.get('hostigamientoAcoso') as FormArray;
        form.push(
            this.formRelacion.setHostigamientoForm(
                this.optionsRelacion.matrizModalidadAmbito.finded[0].id,
                this.optionsRelacion.matrizConductaDetalle.finded[0].id,
                _val.testigo
            )
        );
    } 

    // saveHostigamiento(val){
    //     console.log("->",val);
    //     var dat=val;
    //     this.db.searchInCatalogo("modalidad_ambito",{modalidad:val["modalidad"],ambito:val["ambito"]}).then(e=>{
    //         this.db.searchInCatalogo("conducta_detalle",{conducta:val["conducta"],detalle:val["detalle"]}).then(y=>{
    //             this.hostigamientoData.push({modalidad_ambito:e,conducta_detalle:y, testigo:val["testigo"]});
    //             this.hostigamientoDataSource = new ExampleDataSource(this.hostigamientoData);

    //         });
    //     });
    // }

    save(_valid : any, _model : any):void{
        if(this.onLine.onLine){
            _model.tipoRelacionPersona.id.caso = this.casoId;
            _model.tipoRelacionPersona.id.personaCaso = _model.tipoRelacionPersona.personaCaso.id;
            _model.tipoRelacionPersona.id.personaCasoRelacionada = _model.tipoRelacionPersona.personaCasoRelacionada.id;
            _model.tipoRelacionPersona.caso.id = this.casoId;
            console.log('-> Model', _model);
            // ((this.model["detalleDelito"])["desaparicionConsumada"])["id"]=this.desaparicionConsumada["id"];
            // this.model.detalleDelito.desaparicionConsumada.id=1;
            this.http.post('/v1/base/tipo-relacion-persona', _model).subscribe(
                (response) => //this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]),
                (error) => console.error('Error', error)
            );
        }else{
            // Object.assign(this.model, _model);
            // this.model.caso.id = this.casoId;
            // let temId = Date.now();
            // let dato={
            //     url:'/v1/base/relaciones',
            //     body:this.model,
            //     options:[],
            //     tipo:"post",
            //     pendiente:true,
            //     temId: temId
            // }
            // this.db.add("sincronizar",dato).then(p=>{
            //   this.db.get("casos",this.casoId).then(caso=>{
            //         if (caso){
            //             if(!caso["relacion"]){
            //                 caso["relacion"]=[];
            //             }
            //             this.model["id"]=temId;
            //             caso["relacion"].push(this.model);
            //             this.db.update("casos",caso).then(t=>{
            //                 this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
            //             });
            //         }
            //     });
            // }); 
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
        this.form.patchValue(_data);
    }

    public initForm(){
        this.form.get('delitoCaso.id').disable();
        this.form.get('elementoComision.id').disable();
        this.form.get('formaAccion.id').disable();
        this.form.get('formaComision.id').disable();
        this.form.get('modalidadDelito.id').disable();
    }

    public activaCamposImputado(){
        this.form.get('delitoCaso.id').enable();
        this.form.get('elementoComision.id').enable();
        this.form.get('formaAccion.id').enable();
        this.form.get('formaComision.id').enable();
        this.form.get('modalidadDelito.id').enable();
    }

    changeTipoRelacion(option){
      console.log('--> '+option);
      this.resetValues();
      switch(option){
        case 'Defensor':{
          this.isDefensorImputado = true;
          this.initForm();
          break;
        }
        case 'Imputado':{
          this.isImputadoVictimaDelito = true;
          this.activaCamposImputado();
          break;
        }
        case 'Asesor':{
          this.isAsesorJuridicoVictima = true;
          this.initForm();
          break;
        }
        case 'Representante':{
          this.isRepresentanteVictima = true;
          this.initForm();
          break;
        }
        case 'Tutor':{
          this.isTutorVictima = true;
          this.initForm();
          break;
        }
      }
    }

    set(variable,elemento, value,catalogo){
      // (this[variable])[elemento]=value;
      // let obj=this;
      // this.db.searchInCatalogo(catalogo,this[variable])
      //   .then(item=>{
      //     obj[variable+"Seleccionado"]=item;
      //     //console.log(this[variable+"Seleccionado"]);
      //   });
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

    changePais(val,arr){
        if (val)
            this.optionsService.getEstadoByPaisService(val).subscribe(estados=>{
                this[arr]=this.optionsService.constructOptions(estados);
            });

    }

    changeEstado(val,arr){
        if (val)
            this.optionsService.getMunicipiosByEstadoService(val).subscribe(municipios=>{
                this[arr]=this.optionsService.constructOptions(municipios);
            });
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