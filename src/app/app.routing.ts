import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from '@components-app/usuario/usuario.component';
import { UsuarioCreateComponent } from '@components-app/usuario/create/create.component';
import { ArmaComponent } from '@components-app/noticiaHecho/arma/arma.component';
import { ArmaCreateComponent } from '@components-app/noticiaHecho/arma/create/create.component';

const routes: Routes = [
    { path : 'usuarios', component : UsuarioComponent},
    { path : 'usuarios/create', component : UsuarioCreateComponent},
    { path : 'armas', component : ArmaComponent},
    { path : 'armas/create', component : ArmaCreateComponent}



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
	ArmaCreateComponent
];

