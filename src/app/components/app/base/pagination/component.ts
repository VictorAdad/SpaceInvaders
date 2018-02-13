import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Subscription } from 'rxjs/Subscription';

export class BasePaginationComponent implements OnInit, OnDestroy {

    public loadList: boolean = true;

    public pag: number = 0;

    public pageIndex: number = 0;

    public pageSize: number = 10;

    public pageFilter: string = '';

    public dataSource: TableService;

    public pageSub: Subscription;

    @ViewChild(MatPaginator) 
    public paginator: MatPaginator;
    

    constructor() {

    }

    ngOnInit(){

    }

    ngOnDestroy(){
        if(this.pageSub)
            this.pageSub.unsubscribe();
    }



}