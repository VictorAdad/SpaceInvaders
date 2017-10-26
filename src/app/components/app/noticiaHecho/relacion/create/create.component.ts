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
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho/relaciones`,label:"Detalle noticia de hechos"})

            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                  this.http.get('/v1/base/tipo-relacion-persona/'+this.id).subscribe(response =>{
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
        this.colections.add('hostigamiento', 'subjectHostigamiento', _val);
        let form = this.form.get('hostigamientoAcoso') as FormArray;
        form.push(
            this.formRelacion.setHostigamientoForm(
                this.optionsRelacion.matrizModalidadAmbito.finded[0].id || null,
                this.optionsRelacion.matrizConductaDetalle.finded[0].id || null,
                _val.testigo || null
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
            if(this.onLine.onLine){
                this.http.post('/v1/base/tipo-relacion-persona', _model).subscribe(
                    (response) => {
                        this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho/relaciones' ]);
                        resolve("Se creo la relación con éxito");
                    },
                    (error) => {console.error('Error', error); reject(error);}
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
        });

    }

    public fillForm(_data){
        this.form.patchValue({
            tipoRelacionPersona: {
                tipo: _data.tipo,
            }
        });
        let timer = Observable.timer(1);
        let timer2 = Observable.timer(1);
        timer.subscribe(t => {
            console.log('Fill Detalle Delito');
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
            for (var propName in _data.detalleDelito) {
                if (_data.detalleDelito[propName] === null || _data.detalleDelito[propName] === undefined)
                    delete _data.detalleDelito[propName];
            }
            this.form.patchValue(_data.detalleDelito);
            this.isViolenciaGenero = _data.detalleDelito.tieneViolenciaGenero;
            if(this.isViolenciaGenero)
                timer.subscribe(t => {
                    console.log('-> Fill violencia genero');
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
                        this.optionsRelacion.matrizModalidadAmbito.finded.push(_data.detalleDelito.hostigamientoAcoso.modalidad)
                        this.optionsRelacion.matrizConductaDetalle.finded.push(_data.detalleDelito.hostigamientoAcoso.ambito)
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
