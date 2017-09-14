import { Component } from '@angular/core';
import { MOption } from '@partials/form/select2/select2.component';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Relacion } from '@models/relacion';


@Component({
    selector: 'relacion-create',
    templateUrl: './create.component.html',
    styles:[``]
})

export class RelacionCreateComponent {

    tiposRelacion:MOption[] = [
        { value:'Defensor', label:'Defensor del imputado' },
        { value:'Imputado', label:'Imputado-Víctima-Delito' },
        { value:'Asesor', label:'Asesor jurídico de la víctima' },
        { value:'Representante', label:'Representante de la víctima' },
        { value:'Tutor', label:'Tutor de la víctima' }
    ];
    isDefensorImputado: boolean = false;
    isImputadoVictimaDelito: boolean = false;
    isAsesorJuridicoVictima: boolean = false;
    isRepresentanteVictima: boolean = false;
    isTutorVictima: boolean = false;
    isViolenciaGenero: boolean = false;
    isAChange: boolean = false;
    public form  : FormGroup;
    public model : Relacion;

    constructor(private _fbuilder: FormBuilder) { }
      ngOnInit(){
      this.model = new Relacion();
      /*
   id:number
    tipo: string;
    modalidad: string;
    formaComision: string;
    imputado:string;
    lugar:string;
    consultorDelito:string;
    clasificacionDelito:string;
    elementoComision:string;
    clasificacion:string;
    formaAccion:string;
    consumacion:string;
    gradoParticipacion:string;
    relacionAcusadoOfendido:string;
    formaConducta:string;
    tipoDesaparicion:string;
    flagrancia:boolean;
    violenciasGenero:ViolenciaGenero[];
    tratasPersonas:TrataPersonas[];
    hostigamietosAcosos:HostigamientoAcoso[];
      */
      this.form  = new FormGroup({
          'tipo'                     : new FormControl(this.model.tipo, [Validators.required,]),
          'modalidad'                : new FormControl(this.model.modalidad),
          'formaComision'            : new FormControl(this.model.formaComision),
          'imputado'                 : new FormControl(this.model.imputado),
          'lugar'                    : new FormControl(this.model.lugar),
          'consultorDelito'          : new FormControl(this.model.consultorDelito),
          'clasificacionDelito'      : new FormControl(this.model.clasificacionDelito),
          'elementoComision'         : new FormControl(this.model.elementoComision),
          'clasificacion'            : new FormControl(this.model.clasificacion),
          'formaAccion'              : new FormControl(this.model.formaAccion),
          'consumacion'              : new FormControl(this.model.consumacion),
          'gradoParticipacion'       : new FormControl(this.model.gradoParticipacion),
          'relacionAcusadoOfendido'  : new FormControl(this.model.relacionAcusadoOfendido),
          'formaConducta'            : new FormControl(this.model.formaConducta),
          'tipoDesaparicion'         : new FormControl(this.model.tipoDesaparicion),
          'flagrancia'               : new FormControl(this.model.flagrancia),
          'violenciasGenero'         : new FormControl(this.model.violenciasGenero),
          'tratasPersonas'           : new FormControl(this.model.tratasPersonas),
          'hostigamietosAcosos'      : new FormControl(this.model.hostigamietosAcosos),


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