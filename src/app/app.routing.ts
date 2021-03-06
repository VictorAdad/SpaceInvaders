import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from '@components-app/usuario/usuarios.component';
import { UsuarioCreateComponent } from '@components-app/usuario/create/create.component';
import { HomeComponent } from '@components-app/home/home.component';
import { NoticiaHechoComponent } from '@components-app/noticiaHecho/component';
import { DatosGeneralesComponent } from '@components-app/noticiaHecho/datos-generales/component';
import { PersonaComponent } from '@components-app/noticiaHecho/persona/component';
import { DelitoComponent } from '@components-app/noticiaHecho/delito/component';
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
import { TitularComponent } from '@components-app/noticiaHecho/titular/component';
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
import { CatalogosCreateComponent } from '@components-app/catalogos/create/component';
import { CatalogoArmasComponent } from '@components-app/catalogos/armas/component';
import { TipoArmaComponent } from '@components-app/catalogos/armas/tipo/component';
import { CalibreArmaComponent } from '@components-app/catalogos/armas/calibre/component';
import { CreateArmaComponent } from '@components-app/catalogos/armas/create/create.component';
import { MecanismoAccionComponent } from '@components-app/catalogos/armas/mecanismo/component';

import { estadosCreateComponent } from '@components-app/catalogos/estados/create/create.component';
import { estadosCatalogosComponent } from '@components-app/catalogos/estados/component';
import { municipioCatalogosComponent } from '@components-app/catalogos/municipios/component';
import { municipioCreateComponent } from '@components-app/catalogos/municipios/create/create.component';
import { ColoniaComponent } from '@components-app/catalogos/colonias/component';
import { ColoniaCreateComponent } from '@components-app/catalogos/colonias/create/create.component';
import { LocalidadComponent } from '@components-app/catalogos/localidades/component';
import { LocalidadCreateComponent } from '@components-app/catalogos/localidades/create/create.component';
import {TurnoCatalogosComponent} from '@components-app/catalogos/turno/turno.component';
import {TurnoCatalogosCreateComponent} from '@components-app/catalogos/turno/create/create.component';

import {AyudaComponent} from '@components-app/ayuda/component';

import {Nothing} from '@components-app/home/nothing.component';

import {DashBoardOffline} from '@components-app/offline/dashboard.offline.componet';

const routes: Routes = [
    { path : '', redirectTo: 'home', pathMatch: 'full'},
    { path : '', component: HomeComponent, data : { breadcrumb : 'Noticia de hechos'}},
    { path : 'enlinea', component: HomeComponent, data : { breadcrumb : 'Noticia de hechos'}},
    { path : 'sinconexion', component: HomeComponent, data : { breadcrumb : 'Noticia de hechos'}},
    { path : 'login', component: LoginComponent,  data : { breadcrumb : 'Login' } },
    { path : 'usuarios', component : UsuariosComponent, data : { breadcrumb : 'Usuarios' } },
    { path : 'usuarios/create', component : UsuarioCreateComponent, data : { breadcrumb : 'Crear usuario', rutas:[{path:'/usuarios',label:"Usuarios"}] } },
    { path : 'usuarios/edit/:id',component : UsuarioCreateComponent,data : { breadcrumb : 'Editar usuario', rutas:[{path:'/usuarios',label:"Usuarios"}] } },
    { path : 'nada', component: Nothing,  data : { breadcrumb : 'nada' } },
    //Noticia de Hecho
    { path : 'noticia-hecho', component : NoticiaHechoComponent, data : { breadcrumb : 'Detalle noticia de hechos'}, children: [
        { path : 'datos-generales', component : DatosGeneralesComponent },
    ]},
    { path : 'caso/:id/noticia-hecho', component : NoticiaHechoComponent, data : { breadcrumb : 'Detalle noticia de hechos'}, children : [
        { path : 'datos-generales', component : DatosGeneralesComponent },
        { path : 'personas', component : PersonaComponent },
        { path : 'delitos', component : DelitoComponent },
        { path : 'lugares', component : LugarComponent },
        { path : 'armas', component : ArmaComponent },
        { path : 'vehiculos', component : VehiculoComponent },
        { path : 'relaciones', component : RelacionComponent },
        { path : 'titulares', component : TitularComponent },
        { path : 'documentos', component : DocumentoComponent }
    ]},
    { path : 'armas', component : ArmaComponent, data : { breadcrumb : 'Armas' } },
    { path : 'caso/:casoId/armas/create', component : ArmaCreateComponent, data : { breadcrumb : 'Nueva arma'} },
    { path : 'caso/:casoId/armas/:id', component : ArmaCreateComponent, data : { breadcrumb : 'Nueva arma'} },
    { path : 'lugares', component :  LugarComponent, data : { breadcrumb : 'Lugares' }},
    { path : 'caso/:casoId/lugares/create', component : LugarCreateComponent, data : { breadcrumb : 'Crear lugares'} },
    { path : 'caso/:casoId/lugares/:id', component : LugarCreateComponent, data : { breadcrumb : 'Crear lugares'} },
    { path : 'relaciones', component : RelacionComponent, data : { breadcrumb : 'Relaciones' } },
    { path : 'caso/:casoId/relaciones/create', component : RelacionCreateComponent, data : { breadcrumb : 'Nueva relación'} },
    { path : 'caso/:casoId/relaciones/:id', component : RelacionCreateComponent, data : { breadcrumb : 'Nueva relación'} },
    { path : 'vehiculos', component :  VehiculoComponent, data: { breadcrumb: 'Vehículos'}},
    { path : 'caso/:casoId/vehiculos/create', component : VehiculoCreateComponent, data: { breadcrumb: 'Nuevo Vehículo'}},
    { path : 'caso/:casoId/vehiculos/:id', component : VehiculoCreateComponent, data: { breadcrumb: 'Nuevo Vehículo'}},
    { path : 'caso/:casoId/personas/persona-fisica-imputado', component : PersonaFisicaImputadoComponent, data : { breadcrumb : 'Crear persona'}},
    { path : 'caso/:casoId/personas/:id', component : PersonaFisicaImputadoComponent, data : { breadcrumb : 'Crear persona', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] }},
    { path : 'documentos', component : DocumentoComponent },
    { path : 'documentos/create', component : DocumentoCreateComponent },
    { path : 'notificaciones', component : NotificacionesComponent, data : { breadcrumb : 'Notificaciones' }},

    //Solicitud Preliminar
    { path : 'acuerdos-generales', component : AcuerdoGeneralComponent, data : { breadcrumb : 'Solicitudes y acuerdos generales'}},
    { path : 'acuerdos-generales/create', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Solicitudes y acuerdos generales'}},
    { path : 'acuerdos-generales/:id/edit', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Solicitudes y acuerdos generales'}},
    { path : 'caso/:casoId/acuerdo-general', component : AcuerdoGeneralComponent, data : { breadcrumb : 'Solicitudes de acuerdo general'}},
    { path : 'caso/:casoId/acuerdo-general/create', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Solicitudes y acuerdos generales'}},
    { path : 'caso/:casoId/acuerdo-general/:id/edit', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Solicitudes y acuerdos generales'}},

    { path : 'inspecciones', component : InspeccionComponent, data : { breadcrumb : 'Solicitudes de inspección'}},
    { path : 'inspecciones/create', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
    { path : 'inspecciones/:id/edit', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
    { path : 'caso/:casoId/inspeccion', component : InspeccionComponent, data : { breadcrumb : 'Solicitudes de inspección'}},
    { path : 'caso/:casoId/inspeccion/create', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
    { path : 'caso/:casoId/inspeccion/:id/edit', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},

    { path : 'caso/:casoId/registro-general', component : RegistroGeneralComponent, data : { breadcrumb : 'Solicitudes de registro general'}},
    { path : 'caso/:casoId/registro-general/create', component : RegistroGeneralCreateComponent, data : { breadcrumb : 'Registro general'}},
    { path : 'caso/:casoId/registro-general/:id/edit', component : RegistroGeneralCreateComponent, data : { breadcrumb : 'Registro general'}},

    { path : 'caso/:casoId/policia', component : PoliciaComponent, data : { breadcrumb : 'Solicitudes preliminares de Policía de investigación'}},
    { path : 'caso/:casoId/policia/create', component : PoliciaCreateComponent, data : { breadcrumb : 'Solicitudes de Policía de investigación'}},
    { path : 'caso/:casoId/policia/:id/edit', component : PoliciaCreateComponent, data : { breadcrumb : 'Solicitudes de Policía de investigación'}},

    { path : 'caso/:casoId/perito', component : PeritoComponent, data : { breadcrumb : 'Solicitudes preliminares a peritos'}},
    { path : 'caso/:casoId/perito/create', component : PeritoCreateComponent, data : { breadcrumb : 'Solicitudes de servicios periciales'}},
    { path : 'caso/:casoId/perito/:id/edit', component : PeritoCreateComponent, data : { breadcrumb : 'Solicitudes de servicios periciales'}},

    { path : 'caso/:casoId/requerimiento-informacion', component : RequerimientoInformacionComponent, data : { breadcrumb : 'Solicitudes de requerimiento de información' } },
    { path : 'caso/:casoId/requerimiento-informacion/create', component : RequerimientoInformacionCreateComponent, data : { breadcrumb : 'Requerimiento de información' } },
    { path : 'caso/:casoId/requerimiento-informacion/:id/edit', component : RequerimientoInformacionCreateComponent, data : { breadcrumb : 'Requerimiento de información' } },
    //Determinación
    { path : 'caso/:casoId/acuerdo-inicio', component : AcuerdoInicioComponent, data : { breadcrumb : 'Acuerdo de inicio'}},
    { path : 'caso/:casoId/acuerdo-inicio/:id/view', component : AcuerdoInicioComponent, data : { breadcrumb : 'Acuerdo de inicio'}},

    { path : 'caso/:casoId/delito/create', component : DelitoCreateComponent, data : { breadcrumb : 'Delitos'}},
    { path : 'caso/:casoId/delito/:id', component : DelitoCreateComponent, data : { breadcrumb : 'Delitos'}},
    { path : 'caso/:casoId/archivo-temporal', component : ArchivoTemporalComponent, data : { breadcrumb : 'Archivo temporal' } },
    { path : 'caso/:casoId/archivo-temporal/create', component : ArchivoTemporalCreateComponent, data : { breadcrumb : 'Archivo temporal' } },
    { path : 'caso/:casoId/archivo-temporal/:id/edit', component : ArchivoTemporalCreateComponent, data : { breadcrumb : 'Archivo temporal' } },
    { path : 'caso/:casoId/acuerdo-radicacion', component : AcuerdosRadicacionComponent, data : { breadcrumb : 'Acuerdos de Radicación'}},
    { path : 'caso/:casoId/acuerdo-radicacion/create', component : AcuerdoRadicacionCreateComponent, data : { breadcrumb : 'Acuerdo de radicación'}},
    { path : 'caso/:casoId/acuerdo-radicacion/:id/edit', component : AcuerdoRadicacionCreateComponent, data : { breadcrumb : 'Acuerdo de radicación'}},
    { path : 'caso/:casoId/facultad-no-investigar', component : FacultadesNoInvestigarComponent, data : { breadcrumb : 'Facultad de no investigar'}},
    { path : 'caso/:casoId/facultad-no-investigar/create', component : FacultadNoInvestigarCreateComponent, data : { breadcrumb : 'Facultad de no investigar'}},
    { path : 'caso/:casoId/facultad-no-investigar/:id/edit', component : FacultadNoInvestigarCreateComponent, data : { breadcrumb : 'Facultad de no investigar'}},
    // Pre-denuncia
    { path : 'caso/:casoId/predenuncia/create', component : PredenunciaCreateComponent, data : { breadcrumb : 'Pre denuncia'}},

    { path : 'caso/:casoId/no-ejercicio-accion-penal', component : NoEjercicioAccionPenalComponent, data : { breadcrumb : 'No ejercicio de la acción penal' } },
    { path : 'caso/:casoId/no-ejercicio-accion-penal/create', component : NoEjercicioAccionPenalCreateComponent, data : { breadcrumb : 'No ejercicio de la acción penal' } },
    { path : 'caso/:casoId/no-ejercicio-accion-penal/:id/edit', component : NoEjercicioAccionPenalCreateComponent, data : { breadcrumb : 'No ejercicio de la acción penal' } },

    //Detalle del Caso
    { path : 'caso/:id/detalle', component : DetalleCasoComponent, data : { breadcrumb : 'Detalle del caso' } },

    //Entrevista
    { path : 'caso/:casoId/entrevista', component : EntrevistaComponent, data : { breadcrumb : 'Entrevistas' } },
    { path : 'caso/:casoId/entrevista/create', component : EntrevistaCreateComponent, data : { breadcrumb : 'Entrevista' } },
    { path : 'caso/:casoId/entrevista/:id/view', component : EntrevistaCreateComponent, data : { breadcrumb : 'Entrevista' } },
    //Catalogos

    //prueba catalogos
    { path : 'catalogos/turno', component : TurnoCatalogosComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/turno/create', component : TurnoCatalogosCreateComponent, data : { breadcrumb : 'Crear catálogos' } },
    { path : 'catalogos/turno/:id', component : TurnoCatalogosCreateComponent, data : { breadcrumb : 'Crear catálogos' } },

    { path : 'catalogos/estado', component : estadosCatalogosComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/estado/create', component : estadosCreateComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/estado/:id', component : estadosCreateComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/colonias', component : ColoniaComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/colonias/create', component : ColoniaCreateComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/colonias/:id', component : ColoniaCreateComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/localidades', component : LocalidadComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/localidades/create', component : LocalidadCreateComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/localidades/:id', component : LocalidadCreateComponent, data : { breadcrumb : 'Catálogos' } },

    { path : 'catalogos/municipios', component : municipioCatalogosComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/municipios/create', component : municipioCreateComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/municipios/:id/edit', component : municipioCreateComponent, data : { breadcrumb : 'Catálogos' } },


    { path : 'catalogos/:tipo', component : CatalogosComponent, data : { breadcrumb : 'Catálogos' } },
    { path : 'catalogos/:tipo/create', component : CatalogosCreateComponent, data : { breadcrumb : 'Crear catálogos' } },
    { path : 'catalogos/:tipo/:id', component : CatalogosCreateComponent, data : { breadcrumb : 'Crear catálogos' } },
    { path : 'catalogo-armas', component : CatalogoArmasComponent, data : { breadcrumb : 'Catálogo de Armas', rutas:[{path:'/catalogos',label:"Catálogos"}]  } },

    { path : 'ayuda', component : AyudaComponent, data : { breadcrumb : 'Catálogo de Armas', rutas:[{path:'/catalogos',label:"Catálogos"}]  } },


    { path : 'tipo-arma', component : TipoArmaComponent, data : { breadcrumb : 'Tipo de arma', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"}] } },
    { path : 'tipo-arma/create', component : CreateArmaComponent, data : { breadcrumb : 'Agregar Tipo de Arma', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Tipo de arma"}] }  },
    { path : 'tipo-arma/:id/edit', component : CreateArmaComponent, data : { breadcrumb : 'Editar Tipo de Arma', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Editor Tipo de arma"}] }  },
    { path : 'calibre-arma', component : CalibreArmaComponent, data : { breadcrumb : 'Calibre de Armas', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"}] } },
    { path : 'calibre-arma/create', component : CreateArmaComponent, data : { breadcrumb : 'Agregar Calibre', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Calibre de Armas"}] }  },
    { path : 'calibre-arma/:id/edit', component : CreateArmaComponent, data : { breadcrumb : 'Editar Calibre', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Calibre de Armas"}] }  },
    { path : 'mecanismo-accion', component : MecanismoAccionComponent, data : { breadcrumb : 'Mecanismo de Acción', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"}] } },
    { path : 'mecanismo-accion/create', component : CreateArmaComponent, data : { breadcrumb : 'Agregar Mecanismo', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/mecanismo-accion',label:"Mecanismo de Acción"}] }  },
    { path : 'mecanismo-accion/:id/edit', component : CreateArmaComponent, data : { breadcrumb : 'Editar Mecanismo', rutas : [{path:'/catalogos', label:'Catálogos'},{path:'/catalogo-armas',label:"Catálogo de Armas"},{path:'/tipo-arma',label:"Calibre de Armas"}] }  },
    
    { path : 'reporte/offline', component : DashBoardOffline, data : { breadcrumb : 'Estatus offline'}  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [
    Nothing,
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

  estadosCatalogosComponent,
  estadosCreateComponent,
  ColoniaComponent,
  ColoniaCreateComponent,
  LocalidadComponent,
  LocalidadCreateComponent,
  TurnoCatalogosComponent,
  TurnoCatalogosCreateComponent,

  CatalogosComponent,
  CatalogosCreateComponent,
  CatalogoArmasComponent,

  AyudaComponent,


  TipoArmaComponent,
  CreateArmaComponent,
  CalibreArmaComponent,
  MecanismoAccionComponent,

  DashBoardOffline
];
