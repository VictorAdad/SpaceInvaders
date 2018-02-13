import { Component, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { LoadingDialogService } from '../../../services/loading/loading-dialog.service';

@Component({
    templateUrl: './component.html'
})
export class DetalleCasoComponent implements OnInit, OnDestroy {

    public id: number = null;

    private route: ActivatedRoute;

    public onLine: OnLineService;

    private http: HttpService;

    public caso: Caso;

    public involucrados: Persona[];

    public delitos: DelitoCaso[];

    public predenuncia: Predenuncia;

    public detalleFecha = new Date();

    public hasPredenuncia = false;

    public hasAcuerdoInicio = false;

    public hasRelacionVictimaImputado = false;

    public isTitular = false;

    public casoChangeSubs: Subscription;


    constructor(
        _route: ActivatedRoute,
        public _onLine: OnLineService,
        private _http: HttpService,
        public auth: AuthenticationService,
        private db: CIndexedDB,
        private casoService: CasoService,
        private loaderDialog: LoadingDialogService
    ) {
        this.route = _route;
        this.onLine = _onLine;
        this.http = _http;
        this.caso = new Caso();
        this.predenuncia = new Predenuncia();
        this.detalleFecha = new Date();
        this.loaderDialog.setData({
            titulo: 'Cargando información',
            subtitulo: '' 
        });
    }

    ngOnInit() {
        const timer = Observable.timer(1);
        const timer2 = Observable.timer(1);
        timer.subscribe(t => this.loaderDialog.open());
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];

                if (this.onLine.onLine) {
                    this.casoChangeSubs = this.casoService.casoChange.subscribe(
                        caso => {
                            Logger.log('casoChange()', caso);
                            this.caso = this.casoService.caso;
                            this.isTitular = this.caso.currentTitular.userNameAsignado === this.auth.user.username;
                            this.hasPredenuncia = caso.hasPredenuncia;
                            this.hasAcuerdoInicio = caso.hasAcuerdoInicio;
                            this.hasRelacionVictimaImputado = caso.hasRelacionVictimaImputado;
                            if (caso.predenuncias) {
                                this.detalleFecha = caso.predenuncias.created;
                            }
                            this.involucrados = caso.personaCasos as Persona[];
                            this.delitos = caso.delitoCaso as DelitoCaso[];
                            timer2.subscribe(t => this.loaderDialog.close());
                        }
                    );
                    this.casoService.find(this.id).then(t => this.caso = this.casoService.caso);
                } else {
                    this.casoService.actualizaCasoOffline(this.caso = this.casoService.caso);
                    const timer = Observable.timer(1000);
                    timer.subscribe(t => {
                        this.caso = this.casoService.caso;
                        this.isTitular = this.caso.currentTitular.userNameAsignado === this.auth.user.username;
                        this.hasRelacionVictimaImputado = this.caso.hasRelacionVictimaImputado;
                        this.hasPredenuncia = this.caso['hasPredenuncia'] ? this.caso.hasPredenuncia : false;
                        if (this.caso['personaCasos']) {
                            this.involucrados = this.caso.personaCasos as Persona[];
                        }
                        if (this.caso['delitoCaso']) {
                            this.delitos = this.caso.delitoCaso as DelitoCaso[];
                        }
                        timer2.subscribe(t2 => this.loaderDialog.close());
                    });
                }
            }

        });

    }

    ngOnDestroy() {
        if (this.casoChangeSubs) {
            this.casoChangeSubs.unsubscribe();
        }
    }
}
