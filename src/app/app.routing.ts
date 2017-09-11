import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from '@components-app/usuario/usuario.component';
import { UsuarioCreateComponent } from '@components-app/usuario/create/create.component';
import { ArmaComponent } from '@components-app/noticiaHecho/arma/arma.component';
import { ArmaCreateComponent } from '@components-app/noticiaHecho/arma/create/create.component';
import { VehiculoComponent } from '@components-app/noticiaHecho/vehiculo/vehiculo.component';
import { VehiculoCreateComponent } from '@components-app/noticiaHecho/vehiculo/create/create.component';
import { LugarComponent } from '@components-app/noticiaHecho/lugar/lugar.component';
import { LugarCreateComponent } from '@components-app/noticiaHecho/lugar/create/create.component';

const routes: Routes = [
    { path : 'usuarios', component : UsuarioComponent},
    { path : 'usuarios/create', component : UsuarioCreateComponent},
    { path : 'armas', component : ArmaComponent},
    { path : 'armas/create', component : ArmaCreateComponent},
    { path : 'vehiculos', component :  VehiculoComponent},
    { path : 'vehiculos/create', component : VehiculoCreateComponent },
    { path : 'lugares', component :  LugarComponent},
    { path : 'lugares/create', component : LugarCreateComponent }
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
  LugarCreateComponent
];

