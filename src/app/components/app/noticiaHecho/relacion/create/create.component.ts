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
import { TrataPersonas } from './colections';
import { CasoService } from '@services/caso/caso.service';


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
        { value:'Defensor del imputado', label:'Defensor del imputado' },
        { value:'Imputado víctima delito', label:'Imputado víctima delito' },
        { value:'Asesor jurídico de la víctima', label:'Asesor jurídico de la víctima' },
        { value:'Representante de la víctima', label:'Representante de la víctima' }
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

    trataData = []
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

    casoOffline=null;




    constructor(
        private _fbuilder        : FormBuilder,
        private route            : ActivatedRoute,
        private onLine           : OnLineService,
        private http             : HttpService,
        private router           : Router,
        private db               : CIndexedDB,
        private optionsNoticia   : NoticiaHechoService,
        private optionsService   : SelectsService,
        private casoService:CasoService
        ) {
        super();
        this.optionsRelacion = new Options(http,db,onLine);
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

    ngOnInit(){
        this.model = new Relacion();
        this.efectoViolenciaGenero= new EfectoViolenciaGenero();
        this.hostigamiento= new HostigamientoAcoso;
        
        this.form  = this.formRelacion.form;

        this.route.params.subscribe(params => {
            if(params['casoId']){
                this.casoId = params['casoId'];

                //this.optionsNoticia.setId(this.casoId);
                //this.optionsNoticia.getData();
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho/relaciones`,label:"Detalle noticia de hechos"})
                this.casoService.find(this.casoId).then(r=>{this.casoOffline=this.casoService.caso;});

                if(this.onLine.onLine){
                    this.optionsNoticia.setId(this.casoId, this.casoOffline);
                    this.optionsNoticia.getData();
                    this.optionsService.getData();
                    this.optionsRelacion.getData();
                }else{
                    //this.db.list("casos").then(caso=>{
                    this.casoService.find(this.casoId).then(r=>{
                        this.casoOffline=this.casoService.caso;
                        this.optionsNoticia.setId(this.casoId, this.casoOffline);
                        this.optionsNoticia.getData();
                        this.optionsService.getData();
                        this.optionsRelacion.getData();
                        console.log("TODA LA VISTA",this);
                    });
                }
            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                  this.http.get('/v1/base/tipo-relacion-persona/'+this.id).subscribe(response =>{
                      this.fillForm(response);
                  });
                }else{
                    //this.db.get("casos",this.casoId).then(caso=>{
                    this.casoService.find(this.casoId).then(r=>{
                        var caso= this.casoService.caso;
                        if (caso["tipoRelacionPersonas"]){
                            for (var i = 0; i < caso["tipoRelacionPersonas"].length; ++i) {
                                if (caso["tipoRelacionPersonas"][i]["id"]==this.id){
                                    this.fillForm(caso["tipoRelacionPersonas"][i]);
                                    break;
                                }
                            }
                        }
                        console.log(this.casoOffline);
                    });
                  // this.db.get("casos",this.casoId).then(t=>{
                  //   let relaciones=t["relacion"] as any[];
                  //   for (var i = 0; i < relaciones.length; ++i) {
                  //       if ((relaciones[i])["id"]==this.id){
                  //           this.fillForm(relaciones[i]);
                  //           break;
                  //       }
                  //   }
                  //  });
                }
            }
            console.log(this);
        });


        // if(this.onLine.onLine){
            
        // }else{
        //     this.db.get("casos",this.casoId).then(caso=>{
        //         console.log("CASO----->",caso)
        //         var personasID=caso["personas"];
        //         this.db.list("personas").then(personas=>{
        //             console.log("Personas locales",personas);
        //         });
        //     })
        // }
        // this.initForm();
        this.validateForm(this.form);
    }

    addEfectoDetalle(_val: any){
        this.colections.add('efectoDetalle', 'subjectEfectoDetalle', _val);
        let form = this.form.get('efectoViolencia') as FormArray;
        if(this.optionsRelacion.matrizEfectoDetalle.finded[0])
            form.push(
                this.formRelacion.efectoViolenciaForm(this.optionsRelacion.matrizEfectoDetalle.finded[0].id)
            );
    }

    addTrataPersonas(_val: any){
        console.log('Add TrataPersonas', _val);
        if(this.optionsRelacion.matrizTipoTransportacion.finded[0])
            _val.tipoTransportacion.id = this.optionsRelacion.matrizTipoTransportacion.finded[0].id;
        this.colections.add(
            'trataPersonas',
            'subjectTrataPersonas',
            new TrataPersonas(
                _val,
                this.optionsService,
                this.arrEstadosOrigen,
                this.arrMunicipiosOrigen,
                this.arrEstadosDestino,
                this.arrMunicipiosDestino,
                this.optionsRelacion
            )
        );
        let form = this.form.get('trataPersona') as FormArray;
        form.push(this.formRelacion.trataPersonasForm);
    }

    addHostigamiento(_val: any){
        console.log("HOSTIGAMIENTO",_val);
        if (_val["ambito"]){
            _val["conductaDetalle"]=this.optionsRelacion.matrizConductaDetalle.finded[0];
            _val["modalidadAmbito"]=this.optionsRelacion.matrizModalidadAmbito.finded[0];
        }
        this.colections.add('hostigamiento', 'subjectHostigamiento', _val);
        let form = this.form.get('hostigamientoAcoso') as FormArray;
        var idModalidadAmbito=this.optionsRelacion.matrizModalidadAmbito.finded[0]?this.optionsRelacion.matrizModalidadAmbito.finded[0].id:null;
        var idConductaDetalle=this.optionsRelacion.matrizConductaDetalle.finded[0]?this.optionsRelacion.matrizConductaDetalle.finded[0].id:null;
        var idTestigo=_val.testigo?_val.testigo.id:null;
        if (_val["ambito"]){
            idTestigo=_val.testigo;
        }
        form.push(
            this.formRelacion.setHostigamientoForm(
                idModalidadAmbito,
                idConductaDetalle,
                idTestigo
            )
        );
    }

    save(_valid : any, _model : any){
        return new Promise((resolve,reject)=>{
            _model.tipoRelacionPersona.caso.id = this.casoId;
            _model.tieneViolenciaGenero = this.isViolenciaGenero;
            if(_model.tieneViolenciaGenero)
                if(this.optionsRelacion.matrizViolenciaGenero.finded[0])
                    _model.violenciaGenero.id = this.optionsRelacion.matrizViolenciaGenero.finded[0].id;
            if (this.optionsRelacion.matrizDesaparicionConsumacion.finded[0]){
                _model["desaparicionConsumacion"]["id"]=this.optionsRelacion.matrizDesaparicionConsumacion.finded[0].id;
            }
            console.log("MODELO",_model,this.optionsRelacion.matrizDesaparicionConsumacion);
            if(this.onLine.onLine){
                this.http.post('/v1/base/tipo-relacion-persona', _model).subscribe(
                    (response) => {
                        this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/relaciones' ]);
                        resolve("Se creo la relación con éxito");
                    },
                    (error) => {reject(error)}
                );
            }else{

                let temId = Date.now();
                let copia = temId;
                let dependeDe=[];
                var otrosID=[];
                otrosID.push({id:temId});
                //solo se depende del caso cuando se crea
                dependeDe.push(this.casoId);
                //depende del delito del caso
                if (_model["delitoCaso"])
                    dependeDe.push(_model["delitoCaso"].id);


                if (_model["tipoRelacionPersona"]){
                    let item=_model["tipoRelacionPersona"];
                    console.log("ITEM",item);
                    //depende del arma del caso
                    if (item["armaTipoRelacionPersona"] && item["armaTipoRelacionPersona"][0].arma.id){
                        dependeDe.push(item["armaTipoRelacionPersona"][0].arma.id);
                        temId++;
                        var jason = JSON.parse('{"armaTipoRelacionPersona":{ "'+0+'":{"id":'+temId+'} } }');
                        otrosID.push(jason);
                    }
                    //depende del lugar del caso
                    if (item["lugarTipoRelacionPersona"] && item["lugarTipoRelacionPersona"][0].lugar.id){
                        dependeDe.push(item["lugarTipoRelacionPersona"][0].lugar.id);
                        temId++;
                        var jason = JSON.parse('{"lugarTipoRelacionPersona":{ "'+0+'":{"id":'+temId+'} } }');
                        otrosID.push(jason);
                    }
                    //depende del lugar del vehiculo
                    if (item["vehiculoTipoRelacionPersona"] && item["vehiculoTipoRelacionPersona"][0].vehiculo.id){
                        dependeDe.push(item["vehiculoTipoRelacionPersona"][0].vehiculo.id);
                        temId++;
                        var jason = JSON.parse('{"vehiculoTipoRelacionPersona":{ "'+0+'":{"id":'+temId+'} } }');
                        otrosID.push(jason);
                    }
                    //depende de la persona
                    if (item["personaCaso"].id){
                        dependeDe.push(item["personaCaso"].id);
                    }
                    //depende de la persona
                    if (item["personaCasoRelacionada"].id){
                        dependeDe.push(item["personaCasoRelacionada"].id);
                    }
                       
                }
                console.log("SI");
                for (var i = 0; i < _model["hostigamientoAcoso"].length; ++i) {
                    console.log(_model["hostigamientoAcoso"][i]);
                    temId++;
                    var jason = JSON.parse('{"detalleDelito":{"hostigamientoAcoso":{ "'+i+'":{"id":'+temId+'} } } }');
                    otrosID.push(jason);
                    //depende de la persona
                    if (_model["hostigamientoAcoso"][i].testigo.id){
                        dependeDe.push(_model["hostigamientoAcoso"][i].testigo.id);
                    }
                }
                console.log("SI");
                for (var i = 0; i < _model["trataPersona"].length; ++i) {
                    temId++;
                    var jason = JSON.parse('{"detalleDelito":{"trataPersona":{ "'+i+'":{"id":'+temId+'} } } }');
                    otrosID.push(jason);
                }
                console.log("SI");
                for (var i = 0; i < _model["efectoViolencia"].length; ++i) {
                    temId++;
                    var jason = JSON.parse('{"detalleDelito":{"efectoViolencia":{ "'+i+'":{"id":'+temId+'} } } }');
                    otrosID.push(jason);
                }
                console.log("SI");
                let dato={
                    url:'/v1/base/tipo-relacion-persona',
                    body:_model,
                    options:[],
                    tipo:"post",
                    pendiente:true,
                    temId: temId,
                    dependeDe:dependeDe,
                    otrosID:otrosID

                }
                console.log("MODELO",_model);
                this.db.add("sincronizar",dato).then(p=>{

                  console.log("NO",this.casoId);
                      console.log("NO",this.casoOffline);
                        if (this.casoOffline){
                            let caso=this.casoOffline;
                            if(!caso["tipoRelacionPersonas"]){
                                let x:Array<any>=[];
                                caso["tipoRelacionPersonas"]=x;
                            }
                            _model["id"]=copia;
                            for (var i = 0; i < _model["hostigamientoAcoso"].length; ++i) {
                                copia++;
                                let item = (_model["hostigamientoAcoso"])[i];
                                item["id"]=copia;
                            }
                            for (var i = 0; i < _model["trataPersona"].length; ++i) {
                                copia++;
                                let item = (_model["trataPersona"])[i];
                                item["id"]=copia;
                            }
                            for (var i = 0; i < _model["efectoViolencia"].length; ++i) {
                                copia++;
                                let item = (_model["efectoViolencia"])[i];
                                item["id"]=copia;
                            }
                            console.log(caso["tipoRelacionPersonas"]);
                            var relacion={
                                armaTipoRelacionPersona:_model["tipoRelacionPersona"]["armaTipoRelacionPersona"],
                                detalleDelito:{
                                    clasificacionDelito:_model["clasificacionDelito"],
                                    clasificacionDelitoOrden:_model["clasificacionDelitoOrden"],
                                    concursoDelito:_model["concursoDelito"],
                                    delitoCaso:_model["delitoCaso"],
                                    desaparicionConsumacion:_model["desaparicionConsumacion"],
                                    efectoViolencia:_model["efectoViolencia"],
                                    elementoComision:_model["elementoComision"],
                                    flagrancia:_model["flagrancia"],
                                    formaAccion:_model["formaAccion"],
                                    formaComision:_model["formaComision"],
                                    formaConducta:_model["formaConducta"],
                                    hostigamientoAcoso:_model["hostigamientoAcoso"],
                                    id:copia,
                                    modalidadDelito:_model["modalidadDelito"],
                                    tieneViolenciaGenero:_model["tieneViolenciaGenero"],
                                    trataPersona:_model["trataPersona"],
                                    violnciaGenero:_model["violnciaGenero"]
                                },
                                id:copia,
                                lugarTipoRelacionPersona:_model["tipoRelacionPersona"]["lugarTipoRelacionPersona"],
                                personaCaso:_model["tipoRelacionPersona"]["personaCaso"],
                                personaCasoRelacionada:_model["tipoRelacionPersona"]["personaCasoRelacionada"],
                                tipo:_model["tipoRelacionPersona"]["tipo"],
                                vehiculoTipoRelacion:_model["tipoRelacionPersona"]["vehiculoTipoRelacionPersona"]
                            }
                            caso["tipoRelacionPersonas"].push(relacion);
                            console.log("NO");
                            console.log("MODELO",_model, caso);
                            this.db.update("casos",caso).then(t=>{
                                console.log("NO",t);
                                resolve("Se creo la relación con éxito");
                                this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/relaciones' ]);
                            });
                        }
                    
                }); 
            }
        });
    }

    public edit(_valid : any, _model : any){
        return new Promise((resolve,reject)=>{
            console.log('-> Relacion@edit()', _model);
            if(_model.tieneViolenciaGenero)
                if(this.optionsRelacion.matrizViolenciaGenero.finded[0])
                    _model.violenciaGenero.id = this.optionsRelacion.matrizViolenciaGenero.finded[0].id;
            if(this.onLine.onLine){
                this.http.put('/v1/base/detalle-delitos/'+_model.id, _model).subscribe((response) => {
                    console.log('-> Registro acutualizado', response);
                    resolve("Se actualizó la relación con éxito");
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
                        resolve("Se actualizó la relación de manera local");
                    });
                });
            }
        });

    }

    public fillForm(_data){
        this.form.patchValue({
            tipoRelacionPersona: {
                tipo: _data.tipo,
            }
        });
        console.log('tipo persona->',this.form.controls.tipoRelacionPersona);
        let timer = Observable.timer(1);
        let timer2 = Observable.timer(1);
        timer.subscribe(t => {


           this.form.patchValue({
                tipoRelacionPersona: {
                    personaCaso: {
                        id: _data.personaCaso.id,
                    },
                    personaCasoRelacionada: {
                        id: _data.personaCasoRelacionada.id
                    }

                }
            });

            let tipoPersonaFormGroup:FormGroup=this.form.controls.tipoRelacionPersona as FormGroup;

            let lugarFormArray:FormArray =tipoPersonaFormGroup.controls.lugarTipoRelacionPersona as FormArray;
            let lugarFormGroup:FormGroup = lugarFormArray.controls[0] as FormGroup;
            if (_data.lugarTipoRelacionPersona[0])
                lugarFormGroup.patchValue({lugar: {id:_data.lugarTipoRelacionPersona[0].lugar.id,}});

            let armasFormArray:FormArray =tipoPersonaFormGroup.controls.armaTipoRelacionPersona as FormArray;
            let armasFormGroup:FormGroup = armasFormArray.controls[0] as FormGroup;
            if (_data.armaTipoRelacionPersona[0] && _data.armaTipoRelacionPersona[0].arma)
                armasFormGroup.patchValue({arma: {id:_data.armaTipoRelacionPersona[0]?_data.armaTipoRelacionPersona[0].arma.id:null,}});

            let vehiculoFormArray:FormArray =tipoPersonaFormGroup.controls.vehiculoTipoRelacionPersona as FormArray;
            let vehiculoFormGroup:FormGroup = vehiculoFormArray.controls[0] as FormGroup;
            if (_data.vehiculoTipoRelacionPersona && _data.vehiculoTipoRelacionPersona[0] && _data.vehiculoTipoRelacionPersona[0].vehiculo)
                vehiculoFormGroup.patchValue({vehiculo: {id:_data.vehiculoTipoRelacionPersona[0]?_data.vehiculoTipoRelacionPersona[0].vehiculo.id:null,}});

            console.log('Fill Detalle Delito');

            for (var propName in _data.detalleDelito) {
                if (_data.detalleDelito[propName] === null || _data.detalleDelito[propName] === undefined)
                    delete _data.detalleDelito[propName];
            }
            this.form.patchValue(_data.detalleDelito);
            this.isViolenciaGenero = _data.detalleDelito.tieneViolenciaGenero;
            if(this.isViolenciaGenero && _data.detalleDelito.violenciaGenero!= null)
                timer.subscribe(t => {
                    console.log('-> Fill violencia genero');
                    this.formRelacion.violenciaGenero = this.cleanNulls(this.formRelacion.violenciaGenero);
                    this.formRelacion.violenciaGenero.patchValue(_data.detalleDelito.violenciaGenero);
                    for (var object of _data.detalleDelito.efectoViolencia) {
                        this.optionsRelacion.matrizEfectoDetalle.finded.push(object.efectoDetalle);
                        this.addEfectoDetalle(object.efectoDetalle);
                    }
                    for (var object of _data.detalleDelito.trataPersona) {
                        this.formRelacion.trataPersonasForm.patchValue(object);
                        this.optionsRelacion.matrizTipoTransportacion.finded.push(object.tipoTransportacion);
                        this.addTrataPersonas(object);
                    }
                    for (var object of _data.detalleDelito.hostigamientoAcoso) {
                        if (object.modalidadAmbito){
                            this.optionsRelacion.matrizModalidadAmbito.finded.push(object.modalidadAmbito)
                        }
                        if (object.modalidadAmbito){
                            this.optionsRelacion.matrizConductaDetalle.finded.push(object.conductaDetalle)
                        }
                        this.addHostigamiento(object);
                    }
                });
        });
    }

    public initForm(){
        this.form.get('delitoCaso.id').disable();
        this.form.get('elementoComision.id').disable();
        this.form.get('formaAccion.id').disable();
        this.form.get('formaComision.id').disable();
        this.form.get('modalidadDelito.id').disable();
        this.form.controls.tipoRelacionPersona['controls'].lugarTipoRelacionPersona.disable();
        console.log('H---->',this.form.get('tipoRelacionPersona'))
    }

    public activaCamposImputado(){
        this.form.get('delitoCaso.id').enable();
        this.form.get('elementoComision.id').enable();
        this.form.get('formaAccion.id').enable();
        this.form.get('formaComision.id').enable();
        this.form.get('modalidadDelito.id').enable();
        this.form.controls.tipoRelacionPersona['controls'].lugarTipoRelacionPersona.enable();
    }

    changeTipoRelacion(option){
      console.log('--> '+option);
      this.resetValues();
      switch(option){
        case 'Defensor del imputado':{
          this.isDefensorImputado = true;
          this.initForm();
          break;
        }
        case 'Imputado víctima delito':{
          this.isImputadoVictimaDelito = true;
          this.activaCamposImputado();
          break;
        }
        case 'Asesor jurídico de la víctima':{
          this.isAsesorJuridicoVictima = true;
          this.initForm();
          break;
        }
        case 'Representante de la víctima':{
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
        if (val != null)
            this.optionsService.getEstadoByPaisService(val).subscribe(estados=>{
                this[arr]=this.optionsService.constructOptions(estados);
            });

    }

    changeEstado(val,arr){
        if (val != null)
            this.optionsService.getMunicipiosByEstadoService(val).subscribe(municipios=>{
                this[arr]=this.optionsService.constructOptions(municipios);
            });
    }

    find(_attr, _object):string {
        if(_object)
            return _object[_attr];

        return null;
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
