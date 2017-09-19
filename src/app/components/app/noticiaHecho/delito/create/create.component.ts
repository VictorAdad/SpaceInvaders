import {Component} from '@angular/core';
import {MdDialog, MD_DIALOG_DATA} from '@angular/material';
import {FormCreateDelitoComponent} from "./formcreate.component"

@Component({
  templateUrl: 'create.component.html',
  styles:[`
  .fondo{
    margin:5%; 
    border-radius: 0; 
    border-collapse: black; 
    border-style: solid;
  }
  `
  ]
})

export class DelitoCreateComponent{

  listaDelitos=[];

  constructor(public dialog: MdDialog) { }
  ngOnInit(){
    
  }
  openDialog() {
        this.dialog.open(FormCreateDelitoComponent, {
            height: 'auto',
            width: 'auto',
            data: {
              lista: this.listaDelitos
            }
        });
      }

}