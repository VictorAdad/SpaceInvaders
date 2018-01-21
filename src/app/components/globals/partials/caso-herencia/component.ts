import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { Observable } from 'rxjs';
import { MatPaginator, MatDialog } from '@angular/material';
import { HttpService } from '@services/http.service';
import { NoticiaHechoService } from './../../../../services/noticia-hecho.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Caso, CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
import { TableService} from '@utils/table/table.service';
import { Event } from '@angular/router/src/events';
import { ResolveEmit, ConfirmSettings} from '@utils/alert/alert.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'caso-herencia',
    templateUrl: './component.html'
})
export class CasoHerenciaComponent implements OnInit {

    public panelOpenState = true;

    public lugares: any[] = [];

    public personasTipo: any[] = [];

    public delitos: any[] = [];

    public armas: any[] = [];

    public vehiculos: any[] = [];

    @Input()
    public optionPersonas: any[];

    @Input()
    public people: any[];

    @Input()
    public personas: any[];

    @Input()
    public precarga = false;

    @Input()
    public casoId: number;

    @Input()
    public form: FormGroup;

    @Input('heredarFunction')
    public heredarFunction: any;

    @Output()
    public lugarChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public armaChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public vehiculoChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public delitoChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public personasChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Output()
    public heredarChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public heredarSintesisChange: EventEmitter<boolean> = new EventEmitter<boolean>();


    public settings: ConfirmSettings = {
        overlayClickToClose: false,
        showCloseButton: true,
        confirmText: 'Continuar',
        declineText: 'Cancelar',
    };

    public caso: Caso;

    public heredar: boolean;

    public heredarSintesisHechos: boolean;

    constructor(
        public casoServ: CasoService,
        private http: HttpService,
        private _confirmation: ConfirmationService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.heredar = false;
        this.setHeredarDatos(this.heredar);
        this.casoServ.casoChange.subscribe(
            caso => {
                Logger.log('Caso change');
                this.setCaso(caso);
            }
        );
        this.casoServ.find(this.casoId).then(
            response => {
                const timer = Observable.timer(10000);
                this.setCaso(response);

                timer.subscribe(t => {
                    if (this.people) {
                        for (let i = 0; i < this.people.length; i++) {
                            if (navigator.onLine) {
                                this.addPersona(this.people[i].personaCaso.id);
                            } else {
                                this.addPersona(this.people[i].id);
                            }
                        }
                    }
                });
            }
        );
    }

    public setCaso(_caso) {
        Logger.log('Herencia@setCaso()', _caso);
        this.caso = _caso;
        this.personasTipo = this.caso.optionsPersonasTipo();
        this.lugares = this.caso.optionsLugares();
        this.vehiculos = this.caso.optionsVehiculo();
        this.armas = this.caso.optionsArma();
        this.delitos = this.caso.optionsDelito();
        this.personas = [];

        if (this.precarga) {
            this.fillCampos();
        }
    }

    public addPersona(_id) {
        for (let i = 0; i < this.casoServ.caso.personaCasos.length; i++) {
            if (this.casoServ.caso.personaCasos[i].id === _id && !this.isInPersonas(_id)) {
                const response = this.casoServ.caso.personaCasos[i];
                (this.form.controls.personas as FormArray).push(new FormGroup({'id': new FormControl(_id, [])}));
                this.personas.push(response);
                this.personasChanged();
                break;
            }
        }
        // Logger.log('-> Removed person', this.form.controls.personas, this.form);
    }

    public removePersona(_event: any, _id: number) {
        const newPersonas = [];
        this.personas = this.personas.filter( o => o.id !== _id);
        (this.form.controls.personas as FormArray).controls
            = (this.form.controls.personas as FormArray).controls.filter( o => o.value.id !== _id);

        this.personas.forEach(
            o => newPersonas.push({id: o.id})
        );
        (this.form.controls.personas).setValue(
            newPersonas
        );
        // Logger.log('-> Removed person', this.form.controls.personas, this.form);
        this.personasChanged();
    }

    public isInPersonas(_id) {
        for (let i = 0; i < this.personas.length; i++) {
            if (this.personas[i].id === _id) {
                return true;
            }
        }

        return false;
    }

    public setHeredarDatos(checked) {
        this.heredar = checked;

        if (this.heredar) {
            this.form.controls.lugar['controls'].id.enable();
            this.form.controls.delito['controls'].id.enable();
            this.form.controls.vehiculo['controls'].id.enable();
            this.form.controls.arma['controls'].id.enable();
        } else {
            this.form.controls.lugar['controls'].id.disable();
            this.form.controls.delito['controls'].id.disable();
            this.form.controls.vehiculo['controls'].id.disable();
            this.form.controls.arma['controls'].id.disable();
        }

        this.heredarChanged();
    }

    public setHeredarSintesis(checked) {
        this.heredarSintesisHechos = checked;
        this.heredarSintesisChange.emit(this.heredarSintesisHechos);
    }

    public fillCampos() {
        if (this.caso.personaCasos) {
            this.addPersona(this.caso.personaCasos[0].id);
        }
        this.form.patchValue({
            'lugar': {
                'id': this.lugares[0] ? this.lugares[0].value : ''
            },
            'delito': {
                'id': this.delitos[0] ? this.delitos[0].value : ''
            },
            'vehiculo': {
                'id': this.vehiculos[0] ? this.vehiculos[0].value : ''
            },
            'arma': {
                'id': this.armas[0] ? this.armas[0].value : ''
            }
        });
    }

    public heredarDatos() {
        this._confirmation.create('Advertencia', '¿Estás seguro de que deseas heradar estos datos?', this.settings).subscribe(
            (ans: ResolveEmit) => {
                if (ans.resolved) {
                    if (this.heredarFunction) {
                        this.heredarFunction();
                    }

                    if (this.heredarChanged) {
                        this.heredarChanged();
                    }

                    this.panelOpenState = false;

                }
            }
        );
    }

    public changeState() {
        this.panelOpenState = true;
    }

    public lugarChanged(id) {
        this.lugarChange.emit(id);
    }

    public armaChanged(id) {
        this.armaChange.emit(id);
    }

    public delitoChanged(id) {
        this.delitoChange.emit(id);
    }

    public vehiculoChanged(id) {
        this.vehiculoChange.emit(id);
    }

    public personasChanged() {
        this.personasChange.emit(this.personas);
    }

    public heredarChanged() {
        this.heredarChange.emit(this.heredar);
    }

}
