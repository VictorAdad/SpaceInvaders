import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { AuthenticationService } from '@services/auth/authentication.service';
import { HttpService } from '@services/http.service';
import { TableService } from '@utils/table/table.service';

@Component({
    templateUrl: './notificaciones.component.html',
})
export class NotificacionesComponent extends BasePaginationComponent implements OnInit {

    public columns: any = ['contenido'];

    constructor(
        public auth: AuthenticationService,
        private http: HttpService
        ) {
        super();
    }

    ngOnInit(){
        this.dataSource = new TableService(this.paginator, []);
        this.page();
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
            `/v1/base/notificaciones/usuario/${this.auth.user.username}/page?f=${this.pageFilter}&p=${this.pageIndex}&tr=${this.pageSize}`
        ).subscribe(
            (response) => {
                this.pag = response.totalCount; 
                this.dataSource = new TableService(this.paginator, response.data);
            },
            (error) => {

            }
        );
    }
}