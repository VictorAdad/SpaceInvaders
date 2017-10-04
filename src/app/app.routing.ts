import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from '@components-app/usuario/usuarios.component';
import { UsuarioCreateComponent } from '@components-app/usuario/create/create.component';
import { HomeComponent } from '@components-app/home/home.component';
import { NoticiaHechoComponent } from '@components-app/noticiaHecho/component';
import { ArmaComponent } from '@components-app/noticiaHecho/arma/arma.component';
import { ArmaCreateComponent } from '@components-app/noticiaHecho/arma/create/create.component';
import { LoginComponent } from '@components-app/login/login.component';
import { VehiculoComponent } from '@components-app/noticiaHecho/vehiculo/vehiculo.component';
import { VehiculoCreateComponent } from '@components-app/noticiaHecho/vehiculo/create/create.component';
import { LugarComponent } from '@components-app/noticiaHecho/lugar/lugar.component';
import { LugarCreateComponent } from '@components-app/noticiaHecho/lugar/create/create.component';
import { PersonaFisicaImputadoComponent } from '@components-app/noticiaHecho/persona/create/persona-fisica-imputado.component';
import { RelacionComponent } from '@components-app/noticiaHecho/relacion/relacion.component';
import { RelacionCreateComponent } from '@components-app/noticiaHecho/relacion/create/create.component';
import {DelitoCreateComponent } from '@components-app/noticiaHecho/delito/create/create.component';
//Documentos
import { DocumentoComponent } from '@components-app/noticiaHecho/documento/documento.component';
import { DocumentoCreateComponent } from '@components-app/noticiaHecho/documento/create/create.component';
//Solicitud Preliminar
import { AcuerdoGeneralComponent } from '@components-app/solicitud-preliminar/acuerdo-general/component';
import { AcuerdoGeneralCreateComponent } from '@components-app/solicitud-preliminar/acuerdo-general/create/component';
import { InspeccionComponent } from '@components-app/solicitud-preliminar/inspeccion/component';
import { InspeccionCreateComponent } from '@components-app/solicitud-preliminar/inspeccion/create/component';
import { PoliciaComponent } from '@components-app/solicitud-preliminar/policia/component';
import { PoliciaCreateComponent } from '@components-app/solicitud-preliminar/policia/create/component'
import { PeritoComponent } from '@components-app/solicitud-preliminar/perito/component';
import { PeritoCreateComponent } from '@components-app/solicitud-preliminar/perito/create/component';
import { RequerimientoInformacionComponent } from '@components-app/solicitud-preliminar/requerimiento-informacion/component';
import { RequerimientoInformacionCreateComponent } from '@components-app/solicitud-preliminar/requerimiento-informacion/create/component';
import { RegistroGeneralComponent } from '@components-app/solicitud-preliminar/registro-general/component';
import { RegistroGeneralCreateComponent } from '@components-app/solicitud-preliminar/registro-general/create/component';
//Determinación
import { AcuerdoInicioComponent } from '@components-app/determinacion/acuerdo-inicio/component';
import { AcuerdosRadicacionComponent } from '@components-app/determinacion/acuerdo-radicacion/acuerdos-radicacion.component';
import { AcuerdoRadicacionCreateComponent } from '@components-app/determinacion/acuerdo-radicacion/create/create.component';
import { FacultadesNoInvestigarComponent } from '@components-app/determinacion/facultad-no-investigar/facultades-no-investigar.component';
import { FacultadNoInvestigarCreateComponent } from '@components-app/determinacion/facultad-no-investigar/create/create.component';
import { ArchivoTemporalComponent } from '@components-app/determinacion/archivo-temporal/component';
import { ArchivoTemporalCreateComponent } from '@components-app/determinacion/archivo-temporal/create/component';
import { NoEjercicioAccionPenalComponent } from '@components-app/determinacion/no-ejercicio-accion-penal/component';
import { NoEjercicioAccionPenalCreateComponent } from '@components-app/determinacion/no-ejercicio-accion-penal/create/component';
// Predenuncia
import { PredenunciaCreateComponent} from '@components-app/predenuncia/create/create.component';


//Notificaciones
import { NotificacionesComponent } from '@components-app/notificaciones/notificaciones.component';

//Detalle del Caso
import { DetalleCasoComponent } from '@components-app/detalle-caso/component';

//Entrevistas
import { EntrevistaComponent } from '@components-app/entrevista/component';
import { EntrevistaCreateComponent } from '@components-app/entrevista/create/component';

//Catalogos
import { CatalogosComponent } from '@components-app/catalogos/catalogos.component';
import { CatalogoArmasComponent } from '@components-app/catalogos/armas/component';
import { TipoArmaComponent } from '@components-app/catalogos/armas/tipo/component';
import { CalibreArmaComponent } from '@components-app/catalogos/armas/calibre/component';
import { CreateArmaComponent } from '@components-app/catalogos/armas/create/create.component';
import { MecanismoAccionComponent } from '@components-app/catalogos/armas/mecanismo/component';

const routes: Routes = [
    { path : '', redirectTo: 'home', pathMatch: 'full'},
    { path : '', component: HomeComponent, data : { breadcrumb : 'Noticia de hechos'}},
    { path : 'login', component: LoginComponent,  data : { breadcrumb : 'Login' } },
    { path : 'usuarios', component : UsuariosComponent, data : { breadcrumb : 'Usuarios' } },
    { path : 'usuarios/create', component : UsuarioCreateComponent, data : { breadcrumb : 'Crear usuario', rutas:[{path:'/usuarios',label:"Usuarios"}] } },
    { path : 'usuarios/edit/:id',component : UsuarioCreateComponent,data : { breadcrumb : 'Editar usuario', rutas:[{path:'/usuarios',label:"Usuarios"}] } },

    //Noticia de Hecho
    { path : 'noticia-hecho', component : NoticiaHechoComponent, data : { breadcrumb : 'Detalle noticia de hechos'}},
    { path : 'caso/:id/noticia-hecho', component : NoticiaHechoComponent, data : { breadcrumb : 'Detalle noticia de hechos'}},
    { path : 'armas', component : ArmaComponent, data : { breadcrumb : 'Armas' } },
    { path : 'caso/:casoId/armas/create', component : ArmaCreateComponent, data : { breadcrumb : 'Nueva arma', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'caso/:casoId/armas/:id', component : ArmaCreateComponent, data : { breadcrumb : 'Nueva arma', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'lugares', component :  LugarComponent, data : { breadcrumb : 'Lugares' }},
    { path : 'caso/:casoId/lugares/create', component : LugarCreateComponent, data : { breadcrumb : 'Crear lugares', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'caso/:casoId/lugares/:id', component : LugarCreateComponent, data : { breadcrumb : 'Crear lugares', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'relaciones', component : RelacionComponent, data : { breadcrumb : 'Relaciones' } },
    { path : 'caso/:casoId/relaciones/create', component : RelacionCreateComponent, data : { breadcrumb : 'Nueva relación', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'caso/:casoId/relaciones/:id', component : RelacionCreateComponent, data : { breadcrumb : 'Nueva relación', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'vehiculos', component :  VehiculoComponent, data: { breadcrumb: 'Vehiculos'}},
    { path : 'caso/:casoId/vehiculos/create', component : VehiculoCreateComponent, data: { breadcrumb: 'Nuevo Vehiculo', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}]}},
    { path : 'caso/:casoId/vehiculos/:id', component : VehiculoCreateComponent, data: { breadcrumb: 'Nuevo Vehiculo', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}]}},
    { path : 'caso/:casoId/personas/persona-fisica-imputado', component : PersonaFisicaImputadoComponent, data : { breadcrumb : 'Crear Persona', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] }},
    { path : 'documentos', component : DocumentoComponent },
    { path : 'documentos/create', component : DocumentoCreateComponent },

    { path : 'notificaciones', component : NotificacionesComponent, data : { breadcrumb : 'Notificaciones' }},

    //Solicitud Preliminar
    { path : 'acuerdos-generales', component : AcuerdoGeneralComponent, data : { breadcrumb : 'Acuerdos generales'}},
    { path : 'acuerdos-generales/create', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Acuerdo general'}},    
    { path : 'acuerdos-generales/:id/edit', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Acuerdo general'}},    
    { path : 'caso/:casoId/acuerdo-general', component : AcuerdoGeneralComponent, data : { breadcrumb : 'Solicitudes de acuerdo general'}},
    { path : 'caso/:casoId/acuerdo-general/create', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Acuerdos generales'}},    
    
    { path : 'inspecciones', component : InspeccionComponent, data : { breadcrumb : 'Solicitudes de inspección'}},
    { path : 'inspecciones/create', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
    { path : 'inspecciones/:id/edit', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
    { path : 'caso/:casoId/inspeccion', component : InspeccionComponent, data : { breadcrumb : 'Solicitudes de inspección'}},
    { path : 'caso/:casoId/inspeccion/create', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
   
    { path : 'caso/:casoId/registro-general', component : RegistroGeneralComponent, data : { breadcrumb : 'Solicitudes de registro general'}},
    { path : 'caso/:casoId/registro-general/create', component : RegistroGeneralCreateComponent, data : { breadcrumb : 'Registro generales'}},
    
    { path : 'caso/:casoId/policia', component : PoliciaComponent, data : { breadcrumb : 'Solicitudes de Policia Ministerial'}},
    { path : 'caso/:casoId/policia/create', component : PoliciaCreateComponent, data : { breadcrumb : 'Solicitudes de Policia Ministerial'}},
    
    { path : 'caso/:casoId/perito', component : PeritoComponent, data : { breadcrumb : 'Solicitudes preliminares a peritos'}},
    { path : 'caso/:casoId/perito/create', component : PeritoCreateComponent, data : { breadcrumb : 'Solicitudes de servicios periciales'}},
    
    { path : 'caso/:casoId/requerimiento-informacion', component : RequerimientoInformacionComponent, data : { breadcrumb : 'Solicitudes de requerimiento de información' } },
    { path : 'caso/:casoId/requerimiento-informacion/create', component : RequerimientoInformacionCreateComponent, data : { breadcrumb : 'Requerimiento de información' } },
    //Determinación
    { path : 'caso/:id/acuerdo-inicio', component : AcuerdoInicioComponent, data : { breadcrumb : 'Acuerdo de inicio'}},
    { path : 'caso/:casoId/delito/create', component : DelitoCreateComponent, data : { breadcrumb : 'Delitos', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}]}},
    { path : 'caso/:casoId/delito/:id', component : DelitoCreateComponent, data : { breadcrumb : 'Delitos', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}]}},
    { path : 'caso/:id/archivo-temporal', component : ArchivoTemporalComponent, data : { breadcrumb : 'Archivo temporal' } },
    { path : 'caso/:id/archivo-temporal/create', component : ArchivoTemporalCreateComponent, data : { breadcrumb : 'Archivo temporal' } },
    { path : 'caso/:id/acuerdo-radicacion', component : AcuerdosRadicacionComponent, data : { breadcrumb : 'Acuerdos de radicación'}},
    { path : 'caso/:id/acuerdo-radicacion/create', component : AcuerdoRadicacionCreateComponent, data : { breadcrumb : 'Acuerdo de radicación'}},
    { path : 'caso/:id/facultad-no-investigar', component : FacultadesNoInvestigarComponent, data : { breadcrumb : 'Facultad de no investigar'}},
    { path : 'caso/:id/facultad-no-investigar/create', component : FacultadNoInvestigarCreateComponent, data : { breadcrumb : 'Facultad de no investigar'}},

    // Pre-denuncia
    { path : 'caso/:id/predenuncia/create', component : PredenunciaCreateComponent, data : { breadcrumb : 'Pre denuncia'}},

    { path : 'caso/:id/no-ejercicio-accion-penal', component : NoEjercicioAccionPenalComponent, data : { breadcrumb : 'No ejercicio de la acción penal' } },
    { path : 'caso/:id/no-ejercicio-accion-penal/create', component : NoEjercicioAccionPenalCreateComponent, data : { breadcrumb : 'No ejercicio de la acción penal' } },

    //Detalle del Caso
    { path : 'caso/:id/detalle', component : DetalleCasoComponent, data : { breadcrumb : 'Detalle del caso' } },    

    //Entrevista
    { path : 'caso/:id/entrevista', component : EntrevistaComponent, data : { breadcrumb : 'Entrevistas' } },
    { path : 'caso/:id/entrevista/create', component : EntrevistaCreateComponent, data : { breadcrumb : 'Entrevistas' } },
    //Catalogos
    { path : 'catalogos', component : CatalogosComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogo-armas', component : CatalogoArmasComponent, data : { breadcrumb : 'Catálogo de Armas', rutas:[{path:'/catalogos',label:"Catálogos"}]  } },
    { path : 'tipo-arma', component : TipoArmaComponent, data : { breadcrumb : 'Tipo de arma', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"}] } },
    { path : 'tipo-arma/create', component : CreateArmaComponent, data : { breadcrumb : 'Agregar Tipo de Arma', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Tipo de arma"}] }  },
    { path : 'tipo-arma/:id/edit', component : CreateArmaComponent, data : { breadcrumb : 'Editar Tipo de Arma', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Editor Tipo de arma"}] }  },
    { path : 'calibre-arma', component : CalibreArmaComponent, data : { breadcrumb : 'Calibre de Armas', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"}] } },
    { path : 'calibre-arma/create', component : CreateArmaComponent, data : { breadcrumb : 'Agregar Calibre', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Calibre de Armas"}] }  },
    { path : 'calibre-arma/:id/edit', component : CreateArmaComponent, data : { breadcrumb : 'Editar Calibre', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Calibre de Armas"}] }  },
    { path : 'mecanismo-accion', component : MecanismoAccionComponent, data : { breadcrumb : 'Mecanismo de Acción', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"}] } },
    { path : 'mecanismo-accion/create', component : CreateArmaComponent, data : { breadcrumb : 'Agregar Mecanismo', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/mecanismo-accion',label:"Mecanismo de Acción"}] }  },
    { path : 'mecanismo-accion/:id/edit', component : CreateArmaComponent, data : { breadcrumb : 'Editar Mecanismo', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Calibre de Armas"}] }  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [
	UsuariosComponent,
	UsuarioCreateComponent,
	ArmaComponent,
	ArmaCreateComponent,
  UsuarioCreateComponent,
  VehiculoComponent,
  VehiculoCreateComponent,
  LugarComponent,
  LugarCreateComponent,
  LoginComponent,
  PersonaFisicaImputadoComponent,
  RelacionComponent,
  RelacionCreateComponent,
  HomeComponent,
  NoticiaHechoComponent,
  DocumentoComponent,
  DocumentoCreateComponent,
  //Solicitud Preliminar
  AcuerdoGeneralComponent,
  AcuerdoGeneralCreateComponent,
  InspeccionComponent,
  InspeccionCreateComponent,
  RegistroGeneralComponent,
  RegistroGeneralCreateComponent,  
  PoliciaComponent,
  PoliciaCreateComponent,
  PeritoComponent,
  PeritoCreateComponent,
  RequerimientoInformacionComponent,
  RequerimientoInformacionCreateComponent,
  //Determinación
  AcuerdoInicioComponent,
  DelitoCreateComponent,
  ArchivoTemporalComponent,
  ArchivoTemporalCreateComponent,
  NoEjercicioAccionPenalComponent,
  NoEjercicioAccionPenalCreateComponent,

  //Notificaciones
  NotificacionesComponent,

  //Detalle del Caso
  DetalleCasoComponent,

  //Entrevista
  EntrevistaComponent,
  EntrevistaCreateComponent,

  //Catalogos
  CatalogosComponent,
  CatalogoArmasComponent,
  TipoArmaComponent,
  CreateArmaComponent,
  CalibreArmaComponent,
  MecanismoAccionComponent
];
