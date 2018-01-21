import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
//import { Caso } from '@models/caso';
import { Persona } from '@models/persona';
import { DelitoCaso } from '@models/delitoCaso';
import { Predenuncia } from '@models/predenuncia';
import { AuthenticationService } from '@services/auth/authentication.service';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";
import { CasoService, Caso } from '@services/caso/caso.service';
import { Observable} from 'rxjs/Observable';

@Component({
    templateUrl:'./component.html'
})

export class DetalleCasoComponent implements OnInit{

    public id: number = null;
    private route: ActivatedRoute;
    public onLine: OnLineService;
    private http: HttpService;
    public caso: Caso;
    public involucrados:Persona[];
    public delitos:DelitoCaso[];
    public predenuncia:Predenuncia;
    public detalleFecha = new Date()
    hasPredenuncia:boolean=false;
    hasAcuerdoInicio:boolean=false;
    hasRelacionVictimaImputado:boolean=false;

    constructor(
        _route: ActivatedRoute,
        public _onLine: OnLineService,
        private _http: HttpService,
        public auth: AuthenticationService,
        private db:CIndexedDB,
        private casoService: CasoService
        ){
        this.route = _route;
        this.onLine = _onLine;
        this.http   = _http;
        this.caso = new Caso();
        this.predenuncia=new Predenuncia();
        this.detalleFecha = new Date()
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];

                if (this.onLine.onLine) {
                    this.casoService.find(this.id).then(
                        caso => {
                            this.caso = caso;
                            this.hasPredenuncia = this.caso.hasPredenuncia;
                            this.hasAcuerdoInicio = this.caso.hasAcuerdoInicio;
                            this.hasRelacionVictimaImputado = this.caso.hasRelacionVictimaImputado;
                            if (this.caso.predenuncias) {
                                this.detalleFecha = this.caso.predenuncias.created;
                            }
                            this.involucrados = this.caso.personaCasos as Persona[];
                            this.delitos = this.caso.delitoCaso as DelitoCaso[];
                        }
                    );
                    // this.http.get('/v1/base/casos/'+this.id).subscribe((response) => {
                    //     this.caso = response as Caso;
                    //     this.hasPredenuncia = this.caso.hasPredenuncia;
                    //     this.hasAcuerdoInicio = this.caso.hasAcuerdoInicio;
                    //     this.hasRelacionVictimaImputado = this.caso.hasRelacionVictimaImputado;
                    //     // Logger.log(this.caso)
                    // });

                    // this.http.get('/v1/base/casos/'+this.id+'/all').subscribe((response) =>{
                    //     if (response.predenuncias) {
                    //         this.detalleFecha = response.predenuncias.created;            		
                    //     }
                    //     this.involucrados = response.personaCasos as Persona[];
                    //     this.delitos = response.delitoCaso as DelitoCaso[];
                    
                    // })



                }else{
                    this.casoService.actualizaCasoOffline(this.caso = this.casoService.caso);
                    const timer = Observable.timer(1000);
                    timer.subscribe(t=> {
                        this.caso = this.casoService.caso;
                        console.log("CASO->", this.caso);
                        this.hasRelacionVictimaImputado = this.caso.hasRelacionVictimaImputado;
                        this.hasPredenuncia = this.caso['hasPredenuncia'] ? this.caso.hasPredenuncia : false;
                        if (this.caso['personaCasos']) {
                            this.involucrados = this.caso.personaCasos as Persona[];
                        }
                        if (this.caso['delitoCaso']) {
                            this.delitos = this.caso.delitoCaso as DelitoCaso[];
                        }
                    });
                }
            }

        });

    }
}
