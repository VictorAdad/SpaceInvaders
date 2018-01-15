import {Component} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/form/select2/select2.component'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '@models/usuario';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { Logger } from "@services/logger.service";

@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})

export class UsuarioCreateComponent{

    public form  : FormGroup;
    public permiso : '';
    public inhabilitado : '';
    public model : Usuario;
    public titulo: string;
    public sub: any;
    public settings:ConfirmSettings={
    overlayClickToClose: false, // Default: true
    showCloseButton: true, // Default: true
    confirmText: "Continuar", // Default: 'Yes'
    declineText: "Cancelar",

    }; 

    public sexos : MOption[]=[ 
        {value:"Masculino", label:"Masculino"},
        {value:"Femenino", label:"Femenino"}
       ];
    public agencias: MOption[]=[ 
        {value:"Agencia 1", label:"Agencia 1"},
        {value:"Agencia 2", label:"Agencia 2"},
        {value:"Agencia 3", label:"Agencia 3"},
        {value:"Agencia 4", label:"Agencia 4"}
       ];
    public cargos : MOption[]=[ 
        {value:"Cargo 1", label:"Cargo 1"},
        {value:"Cargo 2", label:"Cargo 2"}
       ];    
    public permisos: MOption[]=[ 
        {value:"Permiso 1", label:"Permiso 1"},
        {value:"Permiso 2", label:"Permiso 2"},
        {value:"Permiso 3", label:"Permiso 3"}
       ];
    public accionesCarpeta: MOption[]=[ 
        {value:"Asignarlas a otro usuario", label:"Asignarlas a otro usuario"},
        {value:"Dejarlo en la agencia", label:"Dejarlo en la agencia"},
        {value:"No realizar ninguna acción", label:"No realizar ninguna acción"}
       ];
    public isEditForm:boolean;
    constructor(private _fbuilder: FormBuilder,private route: ActivatedRoute,private _confirmation: ConfirmationService) { }
    ngOnInit(){
        this.model = new Usuario();
        this.form  = new FormGroup({
            'usuario'            : new FormControl(this.model.usuario),
            'nombre'             : new FormControl(this.model.nombre),
            'apellidoPaterno'    : new FormControl(this.model.apellidoPaterno),
            'apellidoMaterno'    : new FormControl(this.model.apellidoMaterno),
            'numeroContacto'     : new FormControl(this.model.numeroContacto),
            'sexo'               : new FormControl(this.model.sexo),
            'distrito'           : new FormControl(this.model.distrito),
            'fiscalia'           : new FormControl(this.model.fiscalia),
            'agenciaAdscripcion' : new FormControl(this.model.agenciaAdscripcion),
            'turno'              : new FormControl(this.model.turno),
            'email'              : new FormControl(this.model.email),
            'numeroGafete'       : new FormControl(this.model.numeroGafete),
            'cargo'              : new FormControl(this.model.cargo),
            'permiso'            : new FormControl(this.model.permiso),
            'accionCarpeta'      : new FormControl(this.model.accionCarpeta),
            'inhabilitado'       : new FormControl(this.model.inhabilitado) });

     let id; 
      this.sub = this.route.params.subscribe(params => {
      id = +params['id'];
      this.isEditForm= id ? true:false ;
      this.titulo = this.isEditForm ? 'Editar usuario' : 'Crear usuario';
      let control = this.form.get('usuario')
      this.isEditForm ?  control.disable(): control.enable();
      });
      // traer el id desde el servicio
      Logger.log('-> ID: ', id);

    }

    public save(valid : any, model : any):void{
         if(valid){
           Logger.log(this._confirmation);
           let resolved=this._confirmation.create('','¿Estás seguro de continuar con el registro de este usuario?',this.settings)
           .subscribe((ans: ResolveEmit) => ans.resolved?Logger.log('Usuario@save()'):Logger.log('cancel'));
         }else{
            console.error('El formulario no pasó la validación D:')
        }
    }
    public edit(valid : any, model : any):void{
         let resolved=this._confirmation.create('','¿Estás seguro guardar los cambios de este usuario?',this.settings)
         .subscribe((ans: ResolveEmit) => ans.resolved?Logger.log('Usuario@edit()'):Logger.log('cancel'));

    }


}