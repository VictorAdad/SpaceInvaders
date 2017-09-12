import { Component} from '@angular/core';
import { TableService} from '@utils/table/table.service';

@Component({
	selector : 'delito',
    templateUrl:'./component.html'
})

export class DelitoComponent{
	_columns = ['position', 'name', 'weight', 'symbol'];

}
