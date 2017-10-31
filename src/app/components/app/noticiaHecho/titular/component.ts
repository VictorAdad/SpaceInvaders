import { Component, ViewChild, Inject} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService } from '@services/http.service';
import { OnLineService} from '@services/onLine.service';
import { TableService} from '@utils/table/table.service';
import { MOption } from '@partials/form/select2/select2.component'

@Component({
    templateUrl:'tranferir.component.html'
})
export class TransferirComponent{

    public agencias: MOption[] = [];
    public usuarios: MOption[] = [];
    public form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<TransferirComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {casoId:any},
        private http: HttpService,
        private router: Router
       ){}

    ngOnInit() {
        this.form =  new FormGroup({
            'usuario': new FormControl(''),
            'fechaAsignacion': new FormControl(new Date()),
            'caso': new FormGroup({
                'id':new FormControl(''),
            })
        })
        this.http.get('/v1/administration/ldap/agencias').subscribe(
            response => {
                for (let object of response) {
                    this.agencias.push({value: object.name, label: object.name});
                }
            }
        )
    }

    close(){
        this.dialogRef.close();
    }

    public findByAgencia(_agencia: string){
        this.http.get(`/v1/administration/ldap/usuarios?f=${_agencia}`).subscribe(
            response => {
                for (let object of response) {
                    this.usuarios.push({value: object.name, label: object.name});
                }
            }
        )
    }

    public save(_form){
        _form.caso.id = this.data.casoId;
        return new Promise<any>((resolve, reject) => {            
            this.http.post('/v1/base/titulares', _form).subscribe(
                (response) => {
                    this.router.navigate(['/caso/'+this.data.casoId+'/noticia-hecho/titulares' ]);
                    resolve("Se cambió de titular del caso");
                },
                (error) => {

                    reject(error);
                }
            );
        });
    }
}

@Component({
    templateUrl:'./component.html',
    selector:'titular'
})
export class TitularComponent{

    pag: number = 0;
    columns = ['operador', 'oficina', 'titular', 'asignacion', 'nic', 'transferir'];
    data      :Titular[];
    dataSource: TableService | null;
    public casoId: number = null;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private route:ActivatedRoute,
        public onLine: OnLineService,
        private db:CIndexedDB,
        private http: HttpService
        ){}

    ngOnInit() {
        console.log(this.route)
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                if(this.onLine.onLine){
                    this.page('/v1/base/titulares/'+this.casoId+'/page');

                }else{
                    this.db.get("casos",this.casoId).then(caso=>{
                        console.log("Caso en armas ->",caso);
                        if (caso){
                            if(caso["arma"]){
                                this.dataSource = new TableService(this.paginator, caso["arma"] as Titular[]);
                            }
                        }
                    });
                }
            }
        });
    }

    public changePage(_e){
        if(this.onLine.onLine){
            this.page('/v1/base/titulares/'+this.casoId+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
            
        }
    }  

    public page(url: string){
        this.http.get(url).subscribe((response) => {
            this.pag = response.totalCount;
            this.data = response.data as Titular[];
            console.log("Loading armas..");
            console.log(this.data);
            this.dataSource = new TableService(this.paginator, response.data);
        });
    }

    transferirDialog() {
        this.dialog.open(TransferirComponent, {
            height: 'auto',
            width: '500px',
            data: {
              casoId: this.casoId
            }
        });
    }

}


export class Titular {
    id        : number;
    operador  : string;
    oficina   : string;
    titular   : string;
    fechaAsignacion: Date;
    nic       : string;
}
