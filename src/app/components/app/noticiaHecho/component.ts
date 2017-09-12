import { Component, OnInit} from '@angular/core';
declare var componentHandler: any;

@Component({
    templateUrl:'./component.html',
    styleUrls  : [
        './styles/material.indigo-pink.min.css',
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
