import {Component} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/form/select2/select2.component'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '@models/usuario';

@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})

export class UsuarioCreateComponent{

    public form  : FormGroup;
    public model : Usuario;
    public titulo: string;
    private sub: any;

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
    public isEditForm:boolean;
    constructor(private _fbuilder: FormBuilder,private route: ActivatedRoute) { }
    ngOnInit(){
        this.model = new Usuario();
        this.form  = new FormGroup({
            'usuario'            : new FormControl(this.model.usuario, [Validators.required,]),
            'nombre'             : new FormControl(this.model.nombre, [Validators.required,]),
            'apellidoPaterno'    : new FormControl(this.model.apellidoPaterno, [Validators.required,]),
            'apellidoMaterno'    : new FormControl(this.model.apellidoMaterno, [Validators.required,]),
            'numeroContacto'     : new FormControl(this.model.numeroContacto),
            'sexo'               : new FormControl(this.model.sexo),
            'distrito'           : new FormControl(this.model.distrito),
            'fiscalia'           : new FormControl(this.model.fiscalia),
            'agenciaAdscripcion' : new FormControl(this.model.agenciaAdscripcion),
            'turno'              : new FormControl(this.model.turno),
            'email'              : new FormControl(this.model.email),
            'numeroGafete'       : new FormControl(this.model.numeroGafete),
            'cargo'              : new FormControl(this.model.cargo),
            'permiso'            : new FormControl(this.model.permiso, [Validators.required,]),
            'inhabilitado'       : new FormControl(this.model.inhabilitado) });
     let id; 
      this.sub = this.route.params.subscribe(params => {
      id = +params['id'];
      this.isEditForm= id ? true:false ;
      this.titulo = this.isEditForm ? 'Editar usuario' : 'Crear usuario';

      });
      // traer el id desde el servicio
      console.log('-> ID: ', id);

    }

    public save(valid : any, model : any):void{
        console.log('Usuario@save()');
    }
    public edit(valid : any, model : any):void{
        console.log('Usuario@edit()');
    }


}