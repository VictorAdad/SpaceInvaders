import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

@Pipe({name : 'dayPipe'})
export class DayPipe implements PipeTransform {
	transform(date:Date){
		moment.locale('es');
		return capitalize(moment(date).format('dddd'));
	}
}

@Pipe({name : 'monthPipe'})
export class MonthPipe implements PipeTransform {
	transform(date:Date){
		moment.locale('es');
		return capitalize(moment(date).format('MMMM'));
	}
}

@Pipe({name : 'inputPipe'})
export class InputPipe implements PipeTransform {
	transform(date:Date){
		moment.locale('es');
		return moment(date).format('L');
	}
}

@Pipe({name : 'longDate'})
export class LongDate implements PipeTransform {
	transform(date:Date){
		moment.locale('es');
		return moment(date).format('LLL');
	}
}