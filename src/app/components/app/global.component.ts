import { GlobalService } from '@services/global.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';

export class GlobalComponent {

	constructor(
        public globalService : GlobalService
	) {

    }

}

export class TableDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private data:BehaviorSubject<any[]>){super()}

  connect(): Observable<any[]> {
    return this.data.asObservable();
  }

  disconnect() {}
}
