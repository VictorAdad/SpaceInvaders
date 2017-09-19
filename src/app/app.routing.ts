import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from '@components-app/usuario/usuario.component';
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
//Determinación
import { AcuerdoInicioComponent } from '@components-app/determinacion/acuerdo-inicio/component';

import { RegistroGeneralComponent } from '@components-app/solicitud-preliminar/registro-general/component';
import { RegistroGeneralCreateComponent } from '@components-app/solicitud-preliminar/registro-general/create/component';

const routes: Routes = [
    { path : '', redirectTo: 'home', pathMatch: 'full'},
    { path : '', component: HomeComponent, data : { breadcrumb : 'Noticia de hechos'}},
    { path : 'noticia-hecho', component : NoticiaHechoComponent, data : { breadcrumb : 'Detalle noticia de hechos'}},
    { path : 'login', component: LoginComponent,  data : { breadcrumb : 'Login' } },
    { path : 'usuarios', component : UsuarioComponent, data : { breadcrumb : 'Usuarios' } },
    { path : 'usuarios/create', component : UsuarioCreateComponent, data : { breadcrumb : 'Crear usuarios', rutas:[{path:'algo',label:"Otra ruta"}, {path:'/papu',label:"Otra ruta2"}] } },
    { path : 'armas', component : ArmaComponent, data : { breadcrumb : 'Armas' } },
    { path : 'armas/create', component : ArmaCreateComponent, data : { breadcrumb : 'Nueva arma', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'lugares', component :  LugarComponent, data : { breadcrumb : 'Lugares' }},
    { path : 'lugares/create', component : LugarCreateComponent, data : { breadcrumb : 'Crear lugares', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'relaciones', component : RelacionComponent, data : { breadcrumb : 'Relaciones' } },
    { path : 'relaciones/create', component : RelacionCreateComponent, data : { breadcrumb : 'Nueva relación', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] } },
    { path : 'vehiculos', component :  VehiculoComponent, data: { breadcrumb: 'Vehiculos'}},
    { path : 'vehiculos/create', component : VehiculoCreateComponent, data: { breadcrumb: 'Nuevo Vehiculo', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}]}},
    { path : 'personas/persona-fisica-imputado', component : PersonaFisicaImputadoComponent, data : { breadcrumb : 'Crear Persona', rutas:[{path:'/noticia-hecho',label:"Detalle noticia de hechos"}] }},
    { path : 'documentos', component : DocumentoComponent },
    { path : 'documentos/create', component : DocumentoCreateComponent },
    //Solicitud Preliminar
    { path : 'acuerdo-general', component : AcuerdoGeneralComponent, data : { breadcrumb : 'Solicitudes de acuerdo general'}},
    { path : 'acuerdo-general/create', component : AcuerdoGeneralCreateComponent, data : { breadcrumb : 'Acuerdos generales'}},
    { path : 'inspeccion', component : InspeccionComponent, data : { breadcrumb : 'Solicitudes de inspección'}},
    { path : 'inspeccion/create', component : InspeccionCreateComponent, data : { breadcrumb : 'Inspecciones'}},
    { path : 'registro-general', component : RegistroGeneralComponent, data : { breadcrumb : 'Solicitudes de registro general'}},
    { path : 'registro-general/create', component : RegistroGeneralCreateComponent, data : { breadcrumb : 'Registro generales'}},
    { path : 'policia', component : PoliciaComponent, data : { breadcrumb : 'Solicitudes de Policia Ministerial'}},
    { path : 'policia/create', component : PoliciaCreateComponent, data : { breadcrumb : 'Solicitudes de Policia Ministerial'}},
    { path : 'perito', component : PeritoComponent, data : { breadcrumb : 'Solicitudes preliminares a peritos'}},
    { path : 'perito/create', component : PeritoCreateComponent, data : { breadcrumb : 'Solicitudes de servicios periciales'}},
    //Determinación
    { path : 'acuerdo-inicio', component : AcuerdoInicioComponent, data : { breadcrumb : 'Acuerdo de inicio'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [
	UsuarioComponent,
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
  //Determinación
  AcuerdoInicioComponent
];
