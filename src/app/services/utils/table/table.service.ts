import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdPaginator } from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

export class TableService extends DataSource<any> {
	constructor(private _paginator: MdPaginator, private data) {
		super();
	}
  	/** Connect function called by the table to retrieve one stream containing the data to render. */
  	connect(): Observable<any> {
    	const displayDataChanges = [
	      this.data,
	      this._paginator.page,
	    ];

	    return Observable.merge(...displayDataChanges).map(() => {
	      const dat = this.data.slice();

	      // Grab the page's slice of data.
	      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
	      return dat.splice(startIndex, this._paginator.pageSize);
    });
  	}

  	disconnect() {}
}