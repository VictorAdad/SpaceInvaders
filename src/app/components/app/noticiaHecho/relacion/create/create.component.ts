import { Component } from '@angular/core';
import { MOption } from '@partials/form/select2/select2.component';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Relacion} from '@models/relacion';
import { EfectoViolenciaGenero} from '@models/efectoViolenciaGenero';
import { TrataPersonas} from '@models/trataPersonas';
import { HostigamientoAcoso} from '@models/hostigamientoAcoso';



@Component({
    selector: 'relacion-create',
    templateUrl: './create.component.html',
    styles:[``]
})

export class RelacionCreateComponent {
    public relacionForm  : FormGroup;
    public efectoViolenciaForm  : FormGroup;
    public trataPersonasForm  : FormGroup;
    public hostigamientForm  : FormGroup;
    public generalForm:FormGroup;

    public model : Relacion;
    public efectoViolenciaGenero:EfectoViolenciaGenero;
    public trataPersonas:TrataPersonas;
    public hostigamiento:HostigamientoAcoso;

    tiposRelacion:MOption[] = [
        { value:'Defensor', label:'Defensor del imputado' },
        { value:'Imputado', label:'Imputado-Víctima-Delito' },
        { value:'Asesor', label:'Asesor jurídico de la víctima' },
        { value:'Representante', label:'Representante de la víctima' },
        { value:'Tutor', label:'Tutor de la víctima' }
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


    constructor(private _fbuilder: FormBuilder) { }
      ngOnInit(){
      this.model = new Relacion();
      this.efectoViolenciaGenero= new EfectoViolenciaGenero();
      this.trataPersonas= new TrataPersonas();
      this.hostigamiento= new HostigamientoAcoso;

      this.relacionForm  = new FormGroup({
          'tipo'                     : new FormControl(this.model.tipo, [Validators.required,]),
          'modalidad'                : new FormControl(this.model.modalidad,[Validators.required,]),
          'delito'                   : new FormControl(this.model.delito,[Validators.required,]),
          'formaComision'            : new FormControl(this.model.formaComision,[Validators.required,]),
          'imputado'                 : new FormControl(this.model.imputado,[Validators.required,]),
          'victimaUOfendido'         : new FormControl(this.model.victimaUOfendido,[Validators.required,]),
          'lugar'                    : new FormControl(this.model.lugar,[Validators.required,]),
          'formaAccion'              : new FormControl(this.model.formaAccion,[Validators.required,]),
          'elementoComision'         : new FormControl(this.model.elementoComision,[Validators.required,]),
          'consultorDelito'          : new FormControl(this.model.consultorDelito),
          'concursoDelito'           : new FormControl(this.model.concursoDelito),
          'clasificacionDelito'      : new FormControl(this.model.clasificacionDelito),
          'clasificacion'            : new FormControl(this.model.clasificacion),
          'consumacion'              : new FormControl(this.model.consumacion),
          'gradoParticipacion'       : new FormControl(this.model.gradoParticipacion),
          'relacionAcusadoOfendido'  : new FormControl(this.model.relacionAcusadoOfendido),
          'formaConducta'            : new FormControl(this.model.formaConducta),
          'tipoDesaparicion'         : new FormControl(this.model.tipoDesaparicion),
          'flagrancia'               : new FormControl(this.model.flagrancia),       
          'violenciaGenero'          : new FormControl(this.model.violenciaGenero),
          'tipoViolenciaGenero'      : new FormControl(this.model.tipoViolenciaGenero),
          'victimaDelincuenciaOrganizada': new FormControl(this.model.victimaDelincuenciaOrganizada),
          'victimaViolenciaGenero'    : new FormControl(this.model.victimaViolenciaGenero),
          'victimaTrata'              :new FormControl(this.model.victimaTrata),
          'victimaAcoso'              :new FormControl(this.model.victimaAcoso),
          'ordenProteccion'           :new FormControl(this.model.ordenProteccion),

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
    }


    save(valid : any, model : any):void{
      console.log('-> Submit', valid, model);
    }

    changeTipoRelacion(option){
      console.log('--> '+option);
      this.resetValues();
      switch(option){
        case 'Defensor':{
          this.isDefensorImputado = true;
          break;
        }
        case 'Imputado':{
          this.isImputadoVictimaDelito = true;
          break;
        }
        case 'Asesor':{
          this.isAsesorJuridicoVictima = true;
          break;
        }
        case 'Representante':{
          this.isRepresentanteVictima = true;
          break;
        }
        case 'Tutor':{
          this.isTutorVictima = true;
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

    displayedColumns = ['efecto', 'detalle'];
    dataSource = new ExampleDataSource();
}

export interface Element {
    efecto: string;
    detalle: string;
  }
  
  const data: Element[] = [
    {efecto: 'Efecto 1', detalle: 'Detalle 1'},
  ];
  
  /**
   * Data source to provide what data should be rendered in the table. The observable provided
   * in connect should emit exactly the data that should be rendered by the table. If the data is
   * altered, the observable should emit that new set of data on the stream. In our case here,
   * we return a stream that contains only one set of data that doesn't change.
   */
  export class ExampleDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Element[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }