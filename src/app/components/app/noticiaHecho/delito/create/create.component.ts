import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {FormCreateDelitoComponent} from "./formcreate.component"
import { CIndexedDB } from '@services/indexedDB';
import {Router} from '@angular/router';
import {Caso} from '@models/caso';
import { HttpService } from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
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
    public breadcrumb = [];

    id:number;
    caso:Caso;

    listaDelitos=[];
    tabla:CIndexedDB;
    

    constructor(public dialog: MatDialog, private _tabla: CIndexedDB, private router:Router, private route: ActivatedRoute, private http: HttpService, private onLine: OnLineService) { 
        this.tabla=_tabla;
    }
    ngOnInit(){
        this.route.params.subscribe(params => {
            console.log("params",params);
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"})

            }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/delitos-casos/'+this.id).subscribe(response =>{
                        this.listaDelitos.push(response);
                    });
                }else{
                  this.tabla.get("casos",this.casoId).then(t=>{
                    let delitos=t["delito"] as any[];
                    for (var i = 0; i < delitos.length; ++i) {
                        if ((delitos[i])["id"]==this.id){
                            this.listaDelitos.push(delitos[i]);
                            break;
                        }
                    }
                   });
                }
                
            }
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
            // if (!this.caso["delito"])
            //     this.caso["delito"]=[];
            // this.caso["delito"].push({delitos:this.listaDelitos, principal:false});
            // console.log("-> caso", this.caso);
            // this.tabla.update("casos", this.caso).then(
            //     response=>{
            //         console.log("Seactualizo", response);
            //         this.listaDelitos=[];
            //         this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);
            //     });

            this.guardaLista(0,this.listaDelitos);
                
            
            
            console.log("Se tiene que crear el servicio de delito", this.listaDelitos);

            
        }
    }

    guardaLista(i,lista:any[]){
        if (i==lista.length){
            this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);
            return;
        }
        let item=lista[i];
        let data={
            caso:{
                id:this.casoId
            },
            delito:{
                id:item["id"]
            },
            principal:false
        }
        this.http.post('/v1/base/delitos-casos',data).subscribe(response => {
            console.log("->",response);
            this.guardaLista(i+1,this.listaDelitos);
        },
        error=>{
            this.guardaLista(i+1,this.listaDelitos);
        });
    }

}


export class Delito{
    id:number;
    principal:boolean;
}