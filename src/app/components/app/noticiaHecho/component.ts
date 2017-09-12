import { Component, OnInit} from '@angular/core';
declare var componentHandler: any;

@Component({
    templateUrl:'./component.html',
    styleUrls  : [
        './styles/tabs.css'
    ]
})

export class NoticiaHechoComponent implements OnInit{
	ngOnInit(){
		if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
	}
}
