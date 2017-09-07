import { Component, Input } from '@angular/core';

@Component({
	selector : 'text',
  	templateUrl: './text.component.html'
})
export class TextComponent{
	@Input() label : string;
}



