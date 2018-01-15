import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {FormCreateDelitoComponent} from "./formcreate.component"
import { CIndexedDB } from '@services/indexedDB';
import {Router} from '@angular/router';
import {Caso} from '@models/caso';
import { HttpService } from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
import { CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
import { AuthenticationService } from "@services/auth/authentication.service";

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
    public masDe3Dias:any;

    id:number;
    caso:Caso;

    listaDelitos=[];
    tabla:CIndexedDB;


    constructor(public dialog: MatDialog, private _tabla: CIndexedDB, private router:Router, private route: ActivatedRoute, private http: HttpService, public onLine: OnLineService, private casoService:CasoService,private auth:AuthenticationService) {
        this.tabla=_tabla;
    }
    ngOnInit(){
        this.auth.masDe3DiasSinConexion().then(r=>{
            let x= r as boolean;
            this.masDe3Dias=r;
        });
        this.route.params.subscribe(params => {
            Logger.log("params",params);
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho/delitos`,label:"Detalle noticia de hechos"})
                this.casoService.find(this.casoId);
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
        var obj=this;
        return new Promise((resolve,reject)=>{
            if (this.listaDelitos.length>0){
                // if (!this.caso["delito"])
                //     this.caso["delito"]=[];
                // this.caso["delito"].push({delitos:this.listaDelitos, principal:false});
                // Logger.log("-> caso", this.caso);
                // this.tabla.update("casos", this.caso).then(
                //     response=>{
                //         Logger.log("Seactualizo", response);
                //         this.listaDelitos=[];
                //         this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho']);
                //     });
                var listaErrores=[];
                var obj=this;
                var guardaLista=function(i,lista:any[], listaErrores:any[]){
                    if (i==lista.length){
                        if (listaErrores.length>0)
                            reject(listaErrores);
                        else
                            resolve("Se agregaron los delitos");
                        obj.casoService.actualizaCaso();
                        obj.router.navigate(['/caso/'+obj.casoId+'/noticia-hecho/delitos']);
                        return;
                    }
                    let item=lista[i];
                    let data={
                        caso:{
                            id:obj.casoId
                        },
                        delito:{
                            id:item["id"]
                        },
                        principal:false
                    }
                    if (obj.onLine.onLine)
                        obj.http.post('/v1/base/delitos-casos',data).subscribe(response => {
                                Logger.log("->",response);
                                guardaLista(i+1,obj.listaDelitos,listaErrores);
                            },
                            error=>{
                                guardaLista(i+1,obj.listaDelitos,listaErrores);
                                listaErrores.push(error);
                            });
                    else{
                        let temId=Date.now();
                        let dato={
                            url:'/v1/base/delitos-casos',
                            body:data,
                            options:[],
                            tipo:"post",
                            pendiente:true,
                            dependeDe:[obj.casoId],
                            temId: temId,
                            username: obj.auth.user.username
                        }
                        obj.tabla.add("sincronizar",dato).then(p=>{
                            //obj.tabla.get("casos",obj.casoId).then(caso=>{
                                var caso = obj.casoService.caso;
                                if (caso){
                                    if(!caso["delitoCaso"]){
                                        caso["delitoCaso"]=[];
                                        Logger.log("ITEM",item)
                                    }
                                    var dat={id:temId,delito:item, principal:false}
                                    caso["delitoCaso"].push(dat);
                                    obj.tabla.update("casos",caso).then(t=>{
                                        this.casoService.actualizaCasoOffline(t);
                                        guardaLista(i+1,obj.listaDelitos, listaErrores);
                                    });
                                }
                            //});
                        });
                    }

                }
                guardaLista(0,this.listaDelitos,listaErrores);
            }else{
                resolve("No hay delitos para guardar");
            }

        });
    }

}


export class Delito{
    id:number;
    principal:boolean;
}
