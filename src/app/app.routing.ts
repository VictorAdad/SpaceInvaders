import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioCreateComponent } from './components/usuario/create/create.component';

const routes: Routes = [
    { path : 'usuarios', component : UsuarioComponent},
    { path : 'usuarios/create', component : UsuarioCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [
	UsuarioComponent,
	UsuarioCreateComponent
];

