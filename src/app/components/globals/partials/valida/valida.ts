import { Component, OnInit, OnDestroy} from '@angular/core';
import { OnLineService } from '../../../../services/onLine.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '../../../../services/logger.service';
import { DialogVistaInvalidaOfflineService } from '../../../../services/onLine/vistaOfflineInvalidaDialog.service';

@Component({
  selector: 'valida-offline',
  template: ''
})
export class ValidaOfflineComponet implements OnInit, OnDestroy{
    subscription: any = null;
    constructor(public onLine: OnLineService, public dialog: DialogVistaInvalidaOfflineService) { 
        Logger.logDarkColor('Ini Componet','yellow');
    }

    ngOnInit(){
        if (!this.onLine.onLine){
            this.dialog.open();
        }
        this.subscription = this.onLine.onLineChange.subscribe(t => {
            var obj = this;
            if (!t) {
                obj.dialog.open();
            }else{
                obj.dialog.close();
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription){ 
            this.subscription.unsubscribe();
        }
    }

}