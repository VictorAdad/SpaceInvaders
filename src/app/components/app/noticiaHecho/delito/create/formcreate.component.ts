import { Component, Inject } from '@angular/core';
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

export class FormCreateDelitoComponent {

    optionLista=[];
    addList=[];
    listaBuscar=[];
    textSearch:string;
    tabla:CIndexedDB;
    listaDeSeleccionados=[];
    clasificacion:number;
    constructor(
        private _tabla: CIndexedDB,
        @Inject(MD_DIALOG_DATA) private data: {lista:any},
        public dialogRef: MdDialogRef<FormCreateDelitoComponent>
        ){
        this.tabla=_tabla;
    }

    ngOnInit(){
        this.addList=this.data.lista;
        this.dataSourceaddList=new ExampleDataSource([]);
        this.tabla.list("clasificacionDelitos").then(
            lista=>{
                for (let item in lista) {
                    this.listaBuscar.push({
                        label:lista[item].clasificacion, 
                        value:lista[item].id});
                }
            });
    }

    displayedColumns = ['resultado'];
    dataSource = new ExampleDataSource(this.optionLista);
    dataSourceaddList=new ExampleDataSource([]);
    dataList=[
                
            ];

    buscar(value){
        this.optionLista=[];
        console.log("Clasificacion",this.clasificacion);
        if (this.clasificacion){
            this.tabla.get("catalogoDelitos",IDBKeyRange.only(this.clasificacion),"indiceCatalogoDelito").then(
            lista=>{
                for (let item in lista) {
                    if (lista[item].descripcion.indexOf(value)>-1 || lista[item].clave.indexOf(value)>-1){
                        this.optionLista.push(lista[item]);
                    }
                }
                this.dataSource = new ExampleDataSource(this.optionLista);
            });

        }
        
        // if (value.length>0){
        //     let n = this.dataList.length;
        //     for(let i=0; i<n; i++){
        //         if (this.dataList[i].clave.search(value)>-1 || this.dataList[i].descripcion.search(value)>-1){
        //             this.optionLista.push(this.dataList[i]);
        //         }
        //     }
        // }
            
        // this.dataSource = new ExampleDataSource(this.optionLista);
        
    }

    agregar(e){
        this.listaDeSeleccionados=[];
        this.listaDeSeleccionados.push(e);
        this.dataSourceaddList=new ExampleDataSource(this.listaDeSeleccionados);
    }

    guardar(){
        if (this.listaDeSeleccionados.length>0){
            this.addList.push(this.listaDeSeleccionados[0]);
        }
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