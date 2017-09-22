import {Component} from '@angular/core';
import {MdDialog, MD_DIALOG_DATA} from '@angular/material';
import {FormCreateDelitoComponent} from "./formcreate.component"
import { CIndexedDB } from '@services/indexedDB';
import {Router} from '@angular/router';

@Component({
    templateUrl: 'create.component.html',
    styles:[`
        .fondo{
        margin:5%; 
        border-radius: 0; 
        border-collapse: black; 
        border-style: solid;
        }
        `
    ]
})

export class DelitoCreateComponent{

    listaDelitos=[];
    tabla:CIndexedDB;

    constructor(public dialog: MdDialog, private _tabla: CIndexedDB, private router:Router) { 
        this.tabla=_tabla;
    }
    ngOnInit(){

    }
    openDialog() {
        this.dialog.open(FormCreateDelitoComponent, {
            height: 'auto',
            width: 'auto',
            data: {
              lista: this.listaDelitos
            }
            });
        }

    guardar(){
        if (this.listaDelitos.length>0){
            this.tabla.add("delitos",{principal:false}).then(
                t=>{
                    let delito:Delito;
                    delito = t as Delito;
                    for (var i = 0; i < this.listaDelitos.length; ++i) {
                        this.tabla.add("catalogoDelitos_delitos",
                            {    
                                delitoId: delito.id, 
                                catalogoDelitosId:this.listaDelitos[i].id
                            })
                        .then(
                            d=>{
                                console.log("relacion", d);
                            });
                    }
                    this.listaDelitos=[];
                
            });
            
        }
    }

}


export class Delito{
    id:number;
    principal:boolean;
}