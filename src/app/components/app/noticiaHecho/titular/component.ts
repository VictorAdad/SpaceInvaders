import { Component, ViewChild, Inject, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePaginationComponent } from '@components-app/base/pagination/component';
import { AuthenticationService } from '@services/auth/authentication.service';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService } from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
import { NotifyService} from '@services/notify/notify.service';
import { TableService} from '@utils/table/table.service';
import { MOption } from '@partials/form/select2/select2.component'
import { _usuarios } from '@services/auth/usuarios';
import { Logger } from "@services/logger.service";
import { CasoService } from '../../../../services/caso/caso.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    templateUrl: 'tranferir.component.html'
})
export class TransferirComponent extends BasePaginationComponent implements OnInit {

    public agencias: MOption[] = [];
    public usuarios: MOption[] = [];
    public form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<TransferirComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {casoId: any},
        private http: HttpService,
        private router: Router,
        private auth: AuthenticationService,
        private notify: NotifyService,
        private casoServ: CasoService
       ) {
        super();
    }

    ngOnInit() {
        const users = Object.keys(_usuarios);
        this.form =  new FormGroup({
            'userNamePropietario': new FormControl('Propietario'),
            'agencia': new FormControl('', [Validators.required]),
            'userNameAsignado': new FormControl('', [Validators.required]),
            'userNameAsignacion': new FormControl(this.auth.user.username),
            'fechaAsignacion': new FormControl(new Date()),
            'caso': new FormGroup({
                'id': new FormControl(''),
            })
        });

        this.http.get('/v1/administration/ldap/agencias').subscribe(
            response => {
                for (const object of response) {
                    this.agencias.push({value: object.name, label: object.name});
                }
            }
        );

        this.form.controls.agencia.valueChanges.subscribe(this.findByAgencia.bind(this));
    }

    public close() {
        this.dialogRef.close();
    }

    public findByAgencia(_agencia: string) {
        console.log('findAgencia()', _agencia);
        if (_agencia) {
            this.http.get(`/v1/administration/ldap/fiscalias/agencias/usuarios?f=${_agencia}`).subscribe(
                response => {
                    this.usuarios = [];
                    for (const object of response) {
                        this.usuarios.push({value: object.uid, label: object.displayName});
                    }
                }
            );
        }
    }

    public save(_form) {
        _form.caso.id = this.data.casoId;
        return new Promise<any>((resolve, reject) => {
            this.http.post('/v1/base/titulares', _form).subscribe(
                (response) => {
                    response['notify'] = this.notify.getNotify({
                        username: response.userNameAsignado,
                        titulo: 'Transferencia de titularidad del caso',
                        contenido: 'Se le ha transferido un nuevo caso',
                        tipo: 'transferencia',
                        caso: {
                            id: this.data.casoId
                        }
                    });

                    this.notify.emitMessage(response);
                    this.casoServ.cleanCaso();
                    this.router.navigate(['/' ]);
                    resolve('Se cambió de titular del caso');
                },
                (error) => {

                    reject(error);
                }
            );
        });
    }
}

@Component({
    templateUrl: './component.html',
    selector: 'titular'
})
export class TitularComponent implements OnInit, OnDestroy {

    public pag = 0;

    public columns = ['operador', 'oficina', 'titular', 'asignacion', 'nic', 'transferir'];

    public data: Titular[];

    public dataSource: TableService | null;

    public casoId: number = null;

    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    public isTitular = false;

    public casoChangeSubs: Subscription;

    constructor(
        public dialog: MatDialog,
        private route: ActivatedRoute,
        public onLine: OnLineService,
        private db: CIndexedDB,
        private http: HttpService,
        public auth: AuthenticationService,
        public casoServ: CasoService
    ) {
        if (this.casoServ.caso.currentTitular) {
            this.isTitular = (this.casoServ.caso.currentTitular.userNameAsignado === this.auth.user.username);
        }
    }

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            if (params['id']) {
                this.casoId = +params['id'];
                if (this.onLine.onLine) {
                    this.page('/v1/base/titulares/' + this.casoId + '/page');

                } else {
                    this.columns = ['operador', 'oficina', 'titular', 'asignacion', 'nic'];
                    if (this.casoServ.caso['titulares']) {
                        this.dataSource = new TableService(this.paginator, this.casoServ.caso['titulares'] as Titular[]);
                    }
                }
            }
        });

        this.casoChangeSubs = this.casoServ.casoChange.subscribe(
            caso => this.isTitular = (caso.currentTitular.userNameAsignado === this.auth.user.username)
        );
    }

    ngOnDestroy() {
        this.casoChangeSubs.unsubscribe();
    }

    public changePage(_e) {
        if (this.onLine.onLine) {
            this.page('/v1/base/titulares/' + this.casoId + '/page?p=' + _e.pageIndex + '&tr=' + _e.pageSize);

        }
    }

    public page(url: string) {
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Titular[];
            for (const titular of this.data) {
                this.http.get(`/v1/base/casos/propietario/${titular.id}`).subscribe(
                    propietario => titular['propietario'] = propietario
                );
            }
            Logger.log(this.data);
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }

    transferirDialog() {
        this.dialog.open(TransferirComponent, {
            height: 'auto',
            width: '550px',
            data: {
              casoId: this.casoId
            }
        });
    }

}


export class Titular {
    id: number;
    operador: string;
    oficina: string;
    titular: string;
    fechaAsignacion: Date;
    nic: string;
    propietario: any;
}
