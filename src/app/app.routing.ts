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
//Solicitud Preliminar
import { AcuerdoGeneralComponent } from '@components-app/solicitud-preliminar/acuerdo-general/component';
import { AcuerdoGeneralCreateComponent } from '@components-app/solicitud-preliminar/acuerdo-general/create/component';

const routes: Routes = [
    { path : '', redirectTo: 'home', pathMatch: 'full' },
    { path : '', component: HomeComponent, data : { breadcrumb : 'Inicio'} },
    { path : 'login', component: LoginComponent },
    { path : 'usuarios', component : UsuarioComponent },
    { path : 'usuarios/create', component : UsuarioCreateComponent },
    {
      path : 'noticia-hecho',
      component : NoticiaHechoComponent,
      data : { breadcrumb : 'Noticia de hechos'},
      children: [{
        path: "armas",
        component: ArmaComponent,
        data: {
          breadcrumb: "Armas"
        }
      }]
    },
    {
      path : 'armas/create',
      component : ArmaCreateComponent
    },
    {
      path : 'lugares',
      component :  LugarComponent
    },
    {
      path : 'lugares/create',
      component : LugarCreateComponent
    },
    {
      path : 'relaciones',
      component : RelacionComponent
    },
    {
      path : 'relaciones/create',
      component : RelacionCreateComponent
    },
    {
      path : 'vehiculos',
      component :  VehiculoComponent,
      data: { breadcrumb: 'Vehiculos'}
    },
    {
      path : 'vehiculos/create',
      component : VehiculoCreateComponent,
      data: { breadcrumb: 'Nuevo Vehiculo'}
    },
    {
      path : 'personas/persona-fisica-imputado',
      component : PersonaFisicaImputadoComponent,
      data : { breadcrumb : 'Crear Persona'}
    },
    //Solicitud Preliminar
    {
      path : 'acuerdo-general',
      component : AcuerdoGeneralComponent,
      data : { breadcrumb : 'Solicitudes de acuerdo general'}
    },
    {
      path : 'acuerdo-general/create',
      component : AcuerdoGeneralCreateComponent,
      data : { breadcrumb : 'Solicitudes de acuerdo general'}
    }
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
  //Solicitud Preliminar
  AcuerdoGeneralComponent,
  AcuerdoGeneralCreateComponent
];
