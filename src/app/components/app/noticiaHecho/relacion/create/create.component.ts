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
import { SelectsService} from '@services/selects.service';
import { Form } from './form';
import { Options } from './options';


@Component({
    selector: 'relacion-create',
    templateUrl: './create.component.html',
})
export class RelacionCreateComponent extends NoticiaHechoGlobal{
    public formRelacion: Form = new Form();
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
    desaparicionConsumada={
        consumacion:"",
        tipoDesaparicion:"",
        relacionAcusadoOfendido:""
    };
    desaparicionConsumadaSeleccionado=null;

    arrconsumacion=[{label:'si',value:'si'},{label:'no',value:'no'},];
    arrtipoDesaparicion=[{label:'Forzada',value:'Forzada'},{label:'Voluntaria',value:'Voluntaria'},];
    arrrelacionAcusadoOfendido=[{label:'amigo',value:'amigo'},{label:'familiar',value:'familiar'},{label:'conocido',value:'conocido'},{label:'desconocido',value:'desconocido'},];

    arrdelincuenciaOrganizada=[{label:'SI',value:'SI'},{label:'NO',value:'NO'},];
    arrviolenciaGenero=[{label:'SI',value:'SI'},{label:'NO',value:'NO'},];
    arrvictimaTrata=[{label:'SI',value:'SI'},{label:'NO',value:'NO'},];
    arrvictimaAcoso=[{label:'SI',value:'SI'},{label:'NO',value:'NO'},];
    arrordenProteccion=[{label:'SI',value:'SI'},{label:'NO',value:'NO'},];
    arrefecto=[{label:'SI',value:'SI'},{label:'NO',value:'NO'},];
    arrdetalle=[{label:'SABRA',value:'SABRA'},{label:'NO SABE',value:'NO SABE'},];
    arrtipo=[{label:'ELECTRICO',value:'ELECTRICO'},{label:'MECANICO',value:'MECANICO'},];
    arrtransportacion=[{label:'BICICLETA',value:'BICICLETA'},{label:'AUTOMOTOR',value:'AUTOMOTOR'},{label:'CAMIONETA',value:'CAMIONETA'},{label:'AVION',value:'AVION'},];
    // arrmodalidad=[{label:'EXPRESS',value:'EXPRESS'},{label:'CON TIEMPO',value:'CON TIEMPO'},];
    arrambito=[{label:'AMBITO 1',value:'AMBITO 1'},{label:'AMBITO 2',value:'AMBITO 2'},{label:'AMBITO 3',value:'AMBITO 3'},];
    arrconducta=[{label:'APROPIADA',value:'APROPIADA'},{label:'INAPROPIADA',value:'INAPROPIADA'},];
    arrdetalleHostigamineto=[{label:'ESTO ES BUENO',value:'ESTO ES BUENO'},{label:'ESTO ES MALO',value:'ESTO ES MALO'},{label:'BLA BLA',value:'BLA BLA'},{label:'JESUS COMPRO UNOS AUDIFONOS DE 2800',value:'JESUS COMPRO UNOS AUDIFONOS DE 2800'},];
    arrEstadosOrigen=[];
    arrMunicipiosOrigen=[];
    arrEstadosDestino=[];
    arrMunicipiosDestino=[];
    trataPersonasArr=[];

    violenciaGenero={
        delincuenciaOrganizada:null,
        violenciaGenero:null,
        victimaTrata:null,
        victimaAcoso:null,
        ordenProteccion:null
    };
    violenciaGeneroSeleccionado:null;

    efectoDetalle={
        efecto:null,
        detalle:null
    };
    efectoDetalleSeleccionado:null;

    efectoDetalleArr=[];

    tipoTransportacion={
        tipo:null,
        transportacion:null
    }
    tipoTransportacionSeleccionado:null;




    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        private optionsNoticia: NoticiaHechoService,
        private optionsService: SelectsService
        ) {
        super();
        this.optionsRelacion = new Options(http);
    }

    ngOnInit(){
        this.model = new Relacion();
        this.efectoViolenciaGenero= new EfectoViolenciaGenero();
        this.hostigamiento= new HostigamientoAcoso;
        // this.optionsService.getData();

        this.form  = this.formRelacion.form;

      this.generalForm = this._fbuilder.group({
        // itemRows: this._fbuilder.array([this.relacionForm,this.efectoViolenciaForm,this.trataPersonasForm,this.hostigamientForm])
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

            console.log(this);
        });
      }
    }

    saveEfectoViolencia(){
        // this.efectoDetalleArr.push(this.efectoDetalleSeleccionado);
        // this.efectoDataSource = new ExampleDataSource(this.efectoDetalleArr);
        // this.efectoDetalleSeleccionado=null;
        // this.efectoViolenciaForm.patchValue({detalle:""});
        // this.efectoViolenciaForm.patchValue({efecto:""});
    }

    saveTrataPersona(val){
        // val["tipoTransportacion"]=this.tipoTransportacionSeleccionado;
        // console.log("->",val);
        // this.trataPersonasArr.push(val);
        // this.trataDataSource = new ExampleDataSource(this.trataPersonasArr);
        // this.tipoTransportacionSeleccionado=null;
        // this.trataPersonasForm.patchValue({paisOrigen:""});
        // this.trataPersonasForm.patchValue({paisDestino:""});
        // this.trataPersonasForm.patchValue({estadoDestino:""});
        // this.trataPersonasForm.patchValue({estadoDestino:""});
        // this.trataPersonasForm.patchValue({municipioDestino:""});
        // this.trataPersonasForm.patchValue({municipioDestino:""});
        // this.trataPersonasForm.patchValue({tipo:""});
        // this.trataPersonasForm.patchValue({transportacion:""});
        // this.arrMunicipiosDestino=[];
        // this.arrMunicipiosOrigen=[];
        // this.arrEstadosOrigen=[];
        // this.arrEstadosDestino=[];
    }

    saveHostigamiento(val){
        console.log("->",val);
        var dat=val;
        this.db.searchInCatalogo("modalidad_ambito",{modalidad:val["modalidad"],ambito:val["ambito"]}).then(e=>{
            this.db.searchInCatalogo("conducta_detalle",{conducta:val["conducta"],detalle:val["detalle"]}).then(y=>{
                this.hostigamientoData.push({modalidad_ambito:e,conducta_detalle:y, testigo:val["testigo"]});
                this.hostigamientoDataSource = new ExampleDataSource(this.hostigamientoData);

            });
        });
    }

    save(_valid : any, _model : any):void{
        console.log("Datos a guardar => ",_model);
        if(this.onLine.onLine){
            Object.assign(this.model, _model);
            this.model.caso.id = this.casoId;
            ((this.model["detalleDelito"])["desaparicionConsumada"])["id"]=this.desaparicionConsumada["id"];
            console.log(this.model);
            //this.model.detalleDelito.desaparicionConsumada.id=1;
            // this.http.post('/v1/base/relaciones', this.model).subscribe(
            //     (response) => this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]),
            //     (error) => console.error('Error', error)
            // );
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

    activaCamposImputado(opt){
        if (opt){
        // this.form.controls.modalidad.enable();
        // this.form.controls.delito.enable();
        // this.form.controls.formaComision.enable();
        // this.form.controls.lugar.enable();
        // this.form.controls.elementosComision.enable();
        // this.form.controls.formaAccion.enable();
        // this.form.controls.detalleDelito.enable();
        }else{
        // this.form.controls.modalidad.disable();
        // this.form.controls.delito.disable();
        // this.form.controls.formaComision.disable();
        // this.form.controls.lugar.disable();
        // this.form.controls.elementosComision.disable();
        // this.form.controls.formaAccion.disable();
        // this.form.controls.detalleDelito.disable();
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

    set(variable,elemento, value,catalogo){
      (this[variable])[elemento]=value;
      let obj=this;
      this.db.searchInCatalogo(catalogo,this[variable])
        .then(item=>{
          obj[variable+"Seleccionado"]=item;
          //console.log(this[variable+"Seleccionado"]);
        });
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