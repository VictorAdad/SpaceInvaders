import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    public casoId: number = null;

    listaDelitos=[];
    tabla:CIndexedDB;
    

    constructor(public dialog: MdDialog, private _tabla: CIndexedDB, private router:Router, private route: ActivatedRoute) { 
        this.tabla=_tabla;
    }
    ngOnInit(){
        this.route.params.subscribe(params => {
            if(params['id'])
                this.casoId = +params['id'];
        });

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
            //primero creamos un delito en la tabla de delitos
            this.tabla.add("delitos",{principal:false}).then(
                t=>{
                    //para cada elemento de la lista listaDelitos
                    //lo agregamos en la tabla intermedia catalogoDelitos_delitos
                    let delito:Delito;
                    delito = t as Delito;
                    for (var i = 0; i < this.listaDelitos.length; ++i) {
                        this.tabla.add("catalogoDelitos_delitos",
                            {    
                                delitoId: delito.id, 
                                catalogoDelitosId:this.listaDelitos[i].id
                            })
                        .then(d=>{});
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