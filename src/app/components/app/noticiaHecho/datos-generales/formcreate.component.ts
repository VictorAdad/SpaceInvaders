import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MdDialogRef,MD_DIALOG_DATA } from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl: './formcreate.component.html',
    styles:[`
      .fondo{
        margin:5%; 
        border-radius: 0; 
        border-collapse: black; 
        border-style: solid;
        background-color: #e9ecef;
      }
      .cuadro{
        border-radius: 0; 
        border-collapse: black; 
        border-style: solid;
      }
      `
      ]
})

export class FormCreateDelitoCasoComponent {

    optionLista=[];
    addList=[];
    listaBuscar=[];
    textSearch:string;
    tabla:CIndexedDB;
    listaDeSeleccionados=[];
    clasificacion:number;
    @Output() emitter = new EventEmitter();

    constructor(
        private _tabla: CIndexedDB,
        @Inject(MD_DIALOG_DATA) private data: {lista:any},
        public dialogRef: MdDialogRef<FormCreateDelitoCasoComponent>
        ){
        this.tabla=_tabla;
    }

    ngOnInit(){
        this.addList=this.data.lista;
        this.dataSourceaddList=new ExampleDataSource([]);
    }

    displayedColumns = ['resultado'];
    dataSource = new ExampleDataSource(this.optionLista);
    dataSourceaddList=new ExampleDataSource([]);
    dataList=[
                
            ];

    buscar(value){
        
        this.tabla.get("catalagos","delitos").then(
        lista=>{
            let lista2 = (lista["arreglo"] as any[]);
            this.optionLista=[];
            for (let item in lista2 ) {
                let cad=""+(lista2[item])["nombre"];
                if ( cad.toUpperCase().indexOf(value.toUpperCase())>-1 ){
                    this.optionLista.push(lista2[item]);
                }
            }
            this.dataSource = new ExampleDataSource(this.optionLista);
        });

        
        
    }

    agregar(e){
        this.listaDeSeleccionados=[];
        this.listaDeSeleccionados.push(e);
        this.dataSourceaddList=new ExampleDataSource(this.listaDeSeleccionados);
    }

    fireEvent(){
        console.log('-> Fire Event', this.dataSourceaddList);
        this.emitter.emit(this.dataSourceaddList);
        this.dialogRef.close();
    }

    cerrar(){
        this.dialogRef.close();
    }
}

export class ExampleDataSource extends DataSource<any> {

  data=[];

  constructor(data: any) {
        super();
        this.data=data;
    }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return Observable.of(this.data);
  }

  disconnect() {}
}




// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';