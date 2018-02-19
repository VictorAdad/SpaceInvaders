import { EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';


export class InformeBaseComponent implements OnInit {

    @Input()
    public form: FormGroup;

    public static userOption = false;

    public static idInforme = '';

    constructor() {
    }

    ngOnInit() {
        console.log('**** IdInforme: ', InformeBaseComponent.idInforme);
    }
    public save(form) {

        console.log('-->>>>>>>>> ' + InformeBaseComponent.idInforme);

        const idInfo = InformeBaseComponent.idInforme;

        if (typeof idInfo !== 'undefined') {
            localStorage.removeItem('Principal_' + idInfo);
        }
        return new Promise((resolve, reject) => {
            resolve('Form valido');
            const fecha = new Date();
            form.fechaCreacion = fecha;
            console.log('+++numRef: ', form.numeroReferencia);
            localStorage.setItem('Principal_' + form.numeroReferencia, JSON.stringify(form));
            if (localStorage.getItem('Table_PR') != null) {
                console.log('Hay tablas PR guardadas sin Id...');
                const tpr = localStorage.getItem('Table_PR');
                localStorage.removeItem('Table_PR');
                localStorage.setItem('Table_PR' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_R') != null) {
                console.log('Hay tablas R guardadas sin Id...');
                const tpr = localStorage.getItem('Table_R');
                localStorage.removeItem('Table_R');
                localStorage.setItem('Table_R' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_A') != null) {
                console.log('Hay tablas A guardadas sin Id...');
                const tpr = localStorage.getItem('Table_A');
                localStorage.removeItem('Table_A');
                localStorage.setItem('Table_A' + form.numeroReferencia, tpr);
            }

        });


    }

}
