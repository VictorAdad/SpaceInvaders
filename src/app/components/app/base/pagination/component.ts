import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';

@Component({
    templateUrl: './component.html'
})
export class BasePaginationComponent implements OnInit {

    public loadList: boolean = true;

    public pag: number = 0;

    public pageIndex: number = 0;

    public pageSize: number = 10;

    public pageFilter: string = '';

    public dataSource: TableService;

    @ViewChild(MatPaginator) 
    public paginator: MatPaginator;
    

    constructor() {

    }

    ngOnInit(){

    }

}