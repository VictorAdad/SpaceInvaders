import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdPaginator } from '@angular/material';


export class TableService extends DataSource<any> {
    constructor(private _paginator: MdPaginator, private data) {
        super();
    }
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Element[]> {
        return Observable.of(this.data);
    }

    disconnect() {}
}