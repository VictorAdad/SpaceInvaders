import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { Caso } from '@models/caso'
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { CasoService } from '../../../services/caso/caso.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
declare var componentHandler: any;

@Component({
    templateUrl:'./component.html'
})

export class NoticiaHechoComponent implements OnInit, OnDestroy {

    public id: number = null;
    public caso: Caso = new Caso();
    private db: CIndexedDB;
    private sub: any;
    public returnRoute: string = '/';
    public breadcrumb = [];
    public object: any;
    public isTitular = false;

    public casoChangeSubs: Subscription;

    constructor(
        private route: ActivatedRoute,
        private _db: CIndexedDB,
        private onLine: OnLineService,
        private http: HttpService,
        private auth: AuthenticationService,
        private casoServ: CasoService
        ) {
        this.db = _db;
    }

    ngOnInit() {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

        this.casoChangeSubs = this.casoServ.casoChange.subscribe(
            caso => {
                this.isTitular = (this.casoServ.caso.currentTitular.userNameAsignado === this.auth.user.username);
            }
        );

        this.route.params.subscribe(params => {
            if(params['id']){
                this.id = +params['id'];
                this.breadcrumb.push({path:`/caso/${this.id}/detalle`,label:"Detalle del caso"});
                if(this.onLine.onLine){
                    this.http.get('/v1/base/casos/'+this.id).subscribe((response) => {
                        this.object =  response;
                    });
                }else{
                    this.db.get("casos", this.id).then(object => {
                        if (object){
                           this.object =  object;    
                        }
                    });
                }
            }
            this.getReturnRoute();
        });
    }

    ngOnDestroy() {
        this.casoChangeSubs.unsubscribe();
    }

    public hasId(): boolean{
        let hasId = false
        this.sub = this.route.params.subscribe(params => {
            if(params['id'])
                hasId = true;
        });

        return hasId;
    }

    public getReturnRoute(): string{
        if(this.hasId){
            this.returnRoute = `/caso/${this.id}/detalle`;
        }

        return this.returnRoute;
    }
}
