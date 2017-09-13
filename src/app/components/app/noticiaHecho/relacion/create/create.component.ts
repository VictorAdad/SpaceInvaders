import { Component } from '@angular/core';
import { MOption } from '@partials/select2/select2.component';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

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

    isAChange: boolean = false;

    valueChangeSelect(option){
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

    isViolenciaGenero: boolean = false;
    valueChangeCheckbox(status){
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