import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute }    from '@angular/router';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { AuthenticationService } from '@services/auth/authentication.service';
import { CasoService } from '@services/caso/caso.service';
import { CIndexedDB } from '@services/indexedDB';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { TableService } from '@utils/table/table.service';
import { Caso } from '@models/caso';
import { _catalogos } from '@components-app/catalogos/catalogos';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent extends BasePaginationComponent implements OnInit {

    private db: CIndexedDB;

    private onLine: OnLineService;

    private http: HttpService;

    public casos: Caso[] = [];

    public catalogos:any;

    public catalogosKeys:any[];

    public dataSource: any;


    constructor(
        private route: ActivatedRoute,
        private _db: CIndexedDB,
        private _onLine: OnLineService,
        public auth: AuthenticationService,
        private _http: HttpService,
        public caso: CasoService
        ) {
        super();
        this.db     = _db;
        this.onLine = _onLine;
        this.http   = _http;
    }

    ngOnInit(){
        if(this.onLine.onLine){
            this.page();
        }else{
            this.db.list('casos').then(list => {
                const lista = (list as any[]).filter( caso => caso.username == this.auth.user.username);
                this.loadList = false;
                for(let object in lista){
                    let caso = new Caso();
                    Object.assign(caso, lista[object]);
                    this.casos.push(caso);
                    this.dataSource = new TableService(this.paginator, this.casos);
                }
            });
        }

        if(this.auth.user.hasRoles(this.auth.roles.admin)){
            this.catalogos = _catalogos;
            this.catalogosKeys = Object.keys(this.catalogos);
        }
    }

    public changePage(_e){
        console.log('changePage()', _e);
        this.dataSource = null;
        this.pageIndex  = _e.pageIndex;
        this.pageSize   = _e.pageSize;
        this.page();
    }

    public filterPage(_event){
        if(typeof _event == 'string'){
            this.dataSource = null;
            this.pageFilter = _event;
            this.page();
        }
    }

    public page(){
        this.loadList = true;

        if(this.pageSub)
            this.pageSub.unsubscribe();

        this.pageSub = this.http.get(
            `/v1/base/casos/titulares/${this.auth.user.username}/page?f=${this.pageFilter}&p=${this.pageIndex}&tr=${this.pageSize}`
        ).subscribe(
            (response) => {
                this.casos = [];
                this.loadList = false;
                response.data.forEach(object => {
                    this.pag = response.totalCount;
                    this.casos.push(Object.assign(new Caso(), object));
                    this.dataSource = new TableService(this.paginator, this.casos);
                });
            },
            (error) => {
                this.loadList = false
            }
        );
    }

    guardarCaso(caso){
        this.caso.find(caso.id)

    }
}
