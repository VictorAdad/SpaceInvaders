import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from '@components-app/usuario/usuario.component';
import { UsuarioCreateComponent } from '@components-app/usuario/create/create.component';
import { HomeComponent } from '@components-app/home/home.component';
import { NoticiaHechoComponent } from '@components-app/noticiaHecho/noticia-hecho.component';
import { ArmaComponent } from '@components-app/noticiaHecho/arma/arma.component';
import { ArmaCreateComponent } from '@components-app/noticiaHecho/arma/create/create.component';
import { LoginComponent } from '@components-app/login/login.component';
import { VehiculoComponent } from '@components-app/noticiaHecho/vehiculo/vehiculo.component';
import { VehiculoCreateComponent } from '@components-app/noticiaHecho/vehiculo/create/create.component';
import { LugarComponent } from '@components-app/noticiaHecho/lugar/lugar.component';
import { LugarCreateComponent } from '@components-app/noticiaHecho/lugar/create/create.component';
import {PersonaFisicaImputadoComponent} from '@components-app/noticiaHecho/persona/create/persona-fisica-imputado.component';
import { RelacionComponent } from '@components-app/noticiaHecho/relacion/relacion.component';
import { RelacionCreateComponent } from '@components-app/noticiaHecho/relacion/create/create.component';

const routes: Routes = [
    { path : '', component: HomeComponent},
    { path : 'login', component: LoginComponent},
    { path : 'usuarios', component : UsuarioComponent},
    { path : 'usuarios/create', component : UsuarioCreateComponent},
    { path : 'noticia-hecho', component : NoticiaHechoComponent},
    { path : 'armas', component : ArmaComponent},
    { path : 'armas/create', component : ArmaCreateComponent},   
    { path : 'vehiculos', component :  VehiculoComponent},
    { path : 'vehiculos/create', component : VehiculoCreateComponent },
    { path : 'lugares', component :  LugarComponent},
    { path : 'lugares/create', component : LugarCreateComponent },
    { path : 'personas/persona-fisica-imputado', component : PersonaFisicaImputadoComponent },
    { path : 'relaciones', component : RelacionComponent },
    { path : 'relaciones/create', component : RelacionCreateComponent }
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
    NoticiaHechoComponent
];