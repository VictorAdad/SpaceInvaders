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
            if (localStorage.getItem('Table_Anexo1_') != null) {
                console.log('Hay tablas anexo1 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo1_');
                localStorage.removeItem('Table_Anexo1_');
                localStorage.setItem('Table_Anexo1_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo2_') != null) {
                console.log('Hay tablas anexo2 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo2_');
                localStorage.removeItem('Table_Anexo2_');
                localStorage.setItem('Table_Anexo2_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo3_') != null) {
                console.log('Hay tablas anexo3 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo3_');
                localStorage.removeItem('Table_Anexo3_');
                localStorage.setItem('Table_Anexo3_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo5_') != null) {
                console.log('Hay tablas anexo3 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo5_');
                localStorage.removeItem('Table_Anexo5_');
                localStorage.setItem('Table_Anexo5_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo6_') != null) {
                console.log('Hay tablas anexo6 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo6_');
                localStorage.removeItem('Table_Anexo6_');
                localStorage.setItem('Table_Anexo6_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo7_') != null) {
                console.log('Hay tablas anexo7 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo7_');
                localStorage.removeItem('Table_Anexo7_');
                localStorage.setItem('Table_Anexo7_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo8.1_') != null) {
                console.log('Hay tablas anexo8 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo8.1_');
                localStorage.removeItem('Table_Anexo8.1_');
                localStorage.setItem('Table_Anexo8.1_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo8.2_') != null) {
                console.log('Hay tablas anexo8 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo8.2_');
                localStorage.removeItem('Table_Anexo8.2_');
                localStorage.setItem('Table_Anexo8.2_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo9_') != null) {
                console.log('Hay tablas anexo9 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo9_');
                localStorage.removeItem('Table_Anexo9_');
                localStorage.setItem('Table_Anexo9_' + form.numeroReferencia, tpr);
            }
            if (localStorage.getItem('Table_Anexo11_') != null) {
                console.log('Hay tablas anexo11 guardadas sin Id...');
                const tpr = localStorage.getItem('Table_Anexo11_');
                localStorage.removeItem('Table_Anexo11_');
                localStorage.setItem('Table_Anexo11_' + form.numeroReferencia, tpr);
            }
            
            
            
            

        });


    }

}
