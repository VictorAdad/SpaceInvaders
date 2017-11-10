import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ActivatedRoute }    from '@angular/router';
import { AuthenticationService } from '@services/auth/authentication.service';
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
export class HomeComponent implements OnInit {

    private db: CIndexedDB;
    private onLine: OnLineService;
    private http: HttpService;
    public casos: Caso[] = [];
    public dataSource: TableService;
    public pag: number = 0;
    public loadList = true;
    public catalogos:any;
    public catalogosKeys:any[];
    @ViewChild(MatPaginator) 
    paginator: MatPaginator;
    

    constructor(
        private route: ActivatedRoute,
        private _db: CIndexedDB,
        private _onLine: OnLineService,
        private _http: HttpService,
        public auth: AuthenticationService
        ) {
        this.db     = _db;
        this.onLine = _onLine;
        this.http   = _http;
    }

    ngOnInit(){
        if(this.onLine.onLine){
            this.page(`/v1/base/casos/titulares/${this.auth.user.username}/page`);
        }else{
            this.db.list('casos').then(list => {
                this.loadList = false;
                for(let object in list){
                    let caso = new Caso();
                    Object.assign(caso, list[object]);
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
        this.page(`/v1/base/casos/titulares/${this.auth.user.username}/page?p=`+_e.pageIndex+'&tr='+_e.pageSize);
    }

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.casos = [];
            this.loadList = false;
            response.data.forEach(object => {
                this.pag = response.totalCount; 
                this.casos.push(Object.assign(new Caso(), object));
                this.dataSource = new TableService(this.paginator, this.casos);
            });
        });
    }

    guardarCaso(caso){
        if(this.onLine.onLine){
            this.db.clear("casos").then(t=>{
                this.db.update("casos",caso).then(t=>{
                    console.log(caso);
                });
            });
        }
        
    }
}