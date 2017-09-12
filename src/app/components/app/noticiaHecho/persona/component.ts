import { Component} from '@angular/core';
import { TableService} from '@utils/table/table.service';

@Component({
	selector : 'persona',
    templateUrl:'./component.html'
})

export class PersonaComponent{
	_columns = ['position', 'name', 'weight', 'symbol'];

}
